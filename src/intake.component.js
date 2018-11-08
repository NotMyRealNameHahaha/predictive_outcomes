//-- Libs
const R = require('ramda')
const moment = require('moment')
//-- Project
import * as utils from '../../common/utils'
import { ChartComponent, TimeChart } from '../../common/graph.component'
import { Observable } from '../../Observable';


//-- Data
const componentVal = 'intake'
const componentProp = R.compose(R.prop('component'), R.prop('dataset'))
const propFilter = R.compose(
    R.equals(componentVal),
    componentProp
)


const intakeInput = utils.cEl('#intake_activity--input')

const getData = ()=> JSON.parse(intakeInput().value)

window._getData = getData
window.utils = utils
window.R = R

/* Chart Component
*======================*/


const qs = `.client_goals`
const chartQs = `${qs} .ct-chart`

const wrap = (x)=> x

const appEvents = {
    click: wrap,
    update: wrap,
    change: wrap
}

export const IntakeChart = {
    chart: null,
    selector: qs,
    data_attr: 'analysis.graph',
    props: ['protein', 'carbs', 'fat'],
    name: 'IntakeChart',
    observable: new Observable(appEvents),

    mount: function(app) {
        window._app = app
        window._TimeChart = ChartComponent
        this.chart = TimeChart.Chart(app, chartQs, this.props)

        this.update(getData())
    },

    unMount: function() {
        this.chart.unMount()
        return this
    },

    update: function(data, partial=true) {
        alert('Yellow!')
        return this.chart.update({
            store: data
        }, partial)
    },

    render: function() {
        this.chart.update({
            store: getData()
        })
    }
}

window.intake_chart = IntakeChart


IntakeChart.observable.subscribe('click', ()=> (
    utils.deferFn(()=> IntakeChart.render())
))






const testData_ = ()=> {

    const dates = {
        start_date: moment().subtract(30, 'days').toDate(),
        end_date: moment().toDate()
    }

    const date_range = 30

    const field_names = ['protein', 'carbs', 'fat']

    const macroMultiplierMap = {
        protein: 12,
        carbs: 13,
        fat: 27
    }

    const setMacroAmount = (item, index)=> R.set(
        R.lensProp(item),
        R.multiply(index, R.prop(item)(macroMultiplierMap))
    )

    const dayMacros = (index)=> field_names.reduce(
        (accum, item)=> setMacroAmount(item, index)(accum),
        {}
    )

    const dayObject = (index)=> R.merge(
        { date: moment(dates.start_date).add(index, 'days').toDate()},
        dayMacros(index)
    )

    return R.range(0, date_range).map(dayObject)
}




const copy_paste = `

var model = intake_chart.chart.model
var data = model.getData()

`