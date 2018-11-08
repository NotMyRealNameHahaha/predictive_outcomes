//-- Libs
const R = require('ramda')
const Chartist = require('chartist')
const moment = require('moment')
//-- Project
const utils = require('./utils')
import { Observable } from '../Observable.js'


export const DEFAULT_DATE_FORMAT = 'D/MM/YY'


/*  Model
*======================*/

export const ChartModel = {
    data: {
        store: [],
        start_date: moment().subtract(30, 'days').toDate(),
        end_date: moment().toDate(),
    },

    state: {
        ready: false,
        init: false
    },

    settings: {
        date_field: 'checkin_date',
        props: []
    },

    getData: function() {
        return this.data
    },

    getStore: function() {
        const data = this.getData()
        const betweenDates = R.compose(
            R.partialRight(R.allPass, [
                R.partial(R.gte, [data.start_date]),
                R.partial(R.lte, [data.end_date])
            ]),
            R.prop(this.settings.date_field)
        )

        return R.filter(betweenDates, data.store)
    },

    getLabels: function(data=false) {
        if (!data) {
            data = this.getStore()
        }

        const labelMaker = xAxisLabels(this.settings.date_field)

        return labelMaker(data)
    },

    getSeries: function() {
        const props = this.settings.props

        let propMap = {}
        for (let p = 0; p < props.length; p++) {
            propMap[ String(props[p]) ] = []
        }

        const propReducer = this.getStore()
            .map(R.prop('data'))
            .reduce((accum, item)=> {

                props.forEach((p)=> accum[String(p)].push(
                    // R.clamp(0, 10000, R.prop(p)(item))
                    R.prop(p)(item)
                ))
                return accum
            }, propMap)

        return Object.values(propReducer)
    }
}


/* View
*==================*/


/* @Function buildChart (data {Object}, selector {String})=> {Chartist}
* Note: `data.series` must be an Array[ Array[ {Object} ] ]
*     Ex. [ [{x: 0, y: 1}, {x: 1, y: 2}], [{x: 1: y: 1}, {x: 2: y: 2}] ]
*/
export const buildChart = (data, selector)=> new Chartist.Line(selector, {
        labels: data.labels,
        series: data.series
    },
    {
        fullWidth: true,
        height: '500px',
        axisY: { onlyInteger: true },
        axisX: { onlyInteger: true },
        chartPadding: { right: 10, left: 10 },
        lineSmooth: Chartist.Interpolation.cardinal({ fillHoles: true }),
        low: 0,
        showArea: true
    }
)



/* @Functor DateSerializer ( x {Any}, [date_format {String}] )=> {Object}
*  @method parse ()=> {Date}
*  @method format ()=> {String}
*/
export const DateSerializer = (x, date_format=DEFAULT_DATE_FORMAT) => ({
    parse: ()=> moment(x, date_format).toDate(),
    format: ()=> moment(x).format(date_format)
})


export const xAxisLabels = (date_field)=> R.compose(
    R.map(
        R.pipe(
            R.prop(date_field),
            (x)=> DateSerializer(x).format()
        ),
    ),
    R.sortBy(R.prop(date_field))
)


export const ChartView = {

    init: (model, selector)=> {
        /* Build out the Chartist instance
        *  @param model {ChartModel}
        *  @param selector {String}: querySelector
        *  @return {Array}: [{Function -> Element}, {Chartist}]
        */
        const chart = R.curry(buildChart)
        const chartScoped = chart({
            labels: model.getLabels(),
            series: model.getSeries()
        })

        const chartInstance = chartScoped(selector)
        const chartNode = utils.cEl(selector)
        chartNode()._chart = chartInstance

        return [
            chartNode,
            chartInstance
        ]
    },

    update: (chart, model)=> {
        chart.update({
            labels: model.getLabels(),
            series: model.getSeries()
        })
        return model
    },

    destroy: (chart, model, ...args)=> {
        chart.detach()
        return model
    },
}



/* Controller
*=================*/

export const ChartController = {

    init: (component)=> {
        /* Use the component's view & model to build
        *    out the Chartist instance
        * @param component {Any}
        * @return {Chartist}
        */
        const model = component.model

        const chartArr = component.view.init(model, component.selector)
        const cChartNode = chartArr[0]
        const chartInstance = chartArr[1]
        
        model.state.ready = true
        model.state.init = true

        return chartInstance
    },

    getData: (model)=> ({
        labels: model.getLabels(),
        series: model.getSeries(),
    }),

    updateChart: (chart, view, model)=> {
        view.update(chart, model)
        return model
    },

    destroy: (chart, view, model, ...args)=> {
        return view.destroy(chart, model, ...args)
    }
}



const _errWrapper = (observable)=> (fn)=> (...args)=> {
    try {
        return fn(...args)
    } catch(err) {
        observable.dispatch('error', err)
    }
    return undefined
}


const echo = (x)=> x

export const ChartObserver = {
    init: echo,
    update: echo,
    error: echo,
    destroy: echo
}



export class ChartComponent {

    constructor(
        field_names,
        model=ChartModel, view=ChartView,
        controller=ChartController, observer=ChartObserver) {
        //-- Component-specific props
        this.field_names = field_names
        this.selector = ''
        this.settings = {}

        this.app = null
        this.model = model
        this.view = view
        this.controller = controller
        this.observable = new Observable(observer)
    }

    get chartInstance() {
        return utils.cEl(this.selector)()._chart
    }

    _dispatch(data, name) {
        /* NOTE: Param order is flipped to facilitate currying
        */
        return this.observable.dispatch(name, data)
    }

    mount(app, selector) {
        this.app = app
        this.selector = selector

        this.model.settings.props = this.field_names

        // Initialize the component then dispatch the 'init' event
        this._dispatch(this.controller.init(this), 'init')
        console.log('Mounted graph.component')
        return this
    }


    update(data, partial=true) {
        /* Update the model
        *  @param data {Array}: Fresh data for the chart
        *  @param partial {Boolean}: If true, the data will be
        *      MERGED with the current model.data
        *      Otherwise, the data will REPLACE model.data
        *  @return {ChartComponent}
        */
        console.log('Updating graph.component')
        const scope = partial ? R.mergeDeepRight(this.model.data, data) : data

        this.model.data = scope

        this.controller.updateChart(this.chartInstance, this.view, this.model)

        this._dispatch({
            data: data,
            partial: partial
        }, 'update')
        console.log('Updated graph.component')

        return this
    }

    destroy(...args) {
        /* Destroy the chart, get rid of our 'store',
        *  call the 'destroy' method on the controller, & update subscribers
        * @return {ChartComponent}
        */
        this.model.data.store = []

        this.controller.destroy(this.chartInstance, this.view, this.model, ...args)
        this._dispatch(args, 'destroy')

        return this
    }

    unMount(...args) {
        /* Destroy our observable & call the 'destroy' method
        *  @return {ChartComponent}
        */
        Object.keys(this.observable.events)
            .forEach(this.observable.removeEvent)

        return this.destroy(...args)
    }
}



export const TimeChart = {
    Chart: (app, selector, field_names, model=ChartModel, view=ChartView,
        controller=ChartController, observer=ChartObserver)=> {
        /* @method Chart {Factory}
        *  @param app {App}: See `./app.js`
        *  ... etc, etc
        *  @return {ChartComponent}
        */
        const chart = new ChartComponent(field_names, model, view, controller, observer)
        return chart.mount(app, selector)
    }
}

