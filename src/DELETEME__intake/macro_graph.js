import Vue from 'vue';
import * as R from 'ramda';
import * as moment_module from 'moment';
import * as flatpickr_module from 'flatpickr'
import  * as Chartist_ from 'chartist';

import { cEl, isFunction, merge, Str, deferFn, Dom } from '../../common/utils.js'
import { Observable } from '../../Observable.js'
import { fetchData, Router } from '../../common/router.js';
import {
    IntakeIngredient,
    IntakeMap,
    IntakeMeal,
    DailyIntake
} from './intake.serializers.js';

import * as Calc from './calculations.js';

const moment = moment_module.default
const Chartist = Chartist_.default
const flatpickr = flatpickr_module.default;

// TEST_URL : http://127.0.0.1:8000/organization/analysis/intake/58/


/* Utils
***********************/

const first = (x)=> x[0]

const second = (x)=> x[1]


//-- flatpickr utils
const isPickr = (el)=> el.hasOwnProperty('_flatpickr')

const timePickr = (el)=> {
    if (!isPickr(el)) {
        flatpickr(el, {
            enableTime: false,
            noCalendar: false,
            dateFormat: 'd M Y', // 02 Jan 2018
        })
    }
    return el
}

const initTimePickr = (meal_data)=> timePickr(
    cEl('.meal_time_input')(mealRow(meal_data))
)

const getDate = (el)=> el._flatpickr.selectedDates[0]

const setDate = (el, date)=> el._flatpickr.setDate(date, false)

// Format a date the way our server likes it =D
const _sendDate = (d)=> moment(d).format('YYYY-MM-DD')



/*  Common
**********************/


class AnalysisRouter extends Router {
    constructor() {
        const base_url = '/organization/analysis/intake/'
        super(base_url)
    }

    read(start_date, end_date) {
        /* Fetch data for checkins between start_date
        *    and end_date
        * @param start_date {Date}
        * @param end_date {Date}
        * @return {Promise -> Object}
        */
        const paramObj = {
            start_date: _sendDate(start_date),
            end_date: _sendDate(end_date)
        }
        return super.read(false, paramObj)
    }
}



const dataInput = cEl('#hidden_daily_intake')

const getData = ()=> {
    try {
        return JSON.parse(dataInput().value)
    } catch(err) {
        console.warn(err)
        window._err = err
    }
}

(function() {
    let el = dataInput()
    let dData = merge({}, getData())

    let macros = dData.macro_nutrients[0]

    delete macros.calories

    dData.macro_nutrients[0] = macros

    el.value = JSON.stringify(dData)
})()


const baseMacro = ()=> { return {
    grams: 0,
    kcal: 0,
    percentKcal: 0
}}



//-- Macro Calculations
const percentKCal = R.prop('kcal')

const dayLabel = (name, amt)=> {
    const grams = Number(amt).toFixed(2)
    const proper_name = Str(name).titleCase()
    return `${proper_name}: ${grams}g`
}



const _getDayData = (scope=false)=> {
    const macros = scope
        ? scope.macros :
        first(getData().macro_nutrients)

    return Object.entries(macros
        ).reduce((accum, item)=> {
            const k = first(item)
            const amt = second(item)

            accum.push({
                name: dayLabel(k, amt),
                value: amt
            })
            return accum
        }, [])
}



/* App Model
*=======================*/


const foodMaps = R.prop('food_maps')

const sumMealCalories = R.compose(
    R.sum,
    R.map(R.compose(
        R.prop('calories'),
        R.prop('calculated_macros')
    ))
)

const composeMaps = R.compose(R.map(foodMaps), R.prop('meals'))

const sumDailyCalories = R.compose(
    R.sum,
    R.map(sumMealCalories),
    composeMaps,
)


const Model = ( (d)=> {

    return {
        meta: {
            calories: Number(sumDailyCalories(d)).toFixed(2),
            macros: R.compose(
                    Calc.MacroObject,
                    first
                )(d.macro_nutrients)
        },
        macros: first(d.macro_nutrients),
        meals: d.meals,

        chart: {
            state: _getDayData()
        }
    }
})(getData())


/* App Actions
*=======================*/

const Actions = {

    getDayData: (scope)=> _getDayData(scope)
}


/* ChartMeta Component
*==================================*/

export const chartMeta = Vue.component('chart-meta', {
    // props: ['meta'],

    data: function() {
        return merge({}, Model)
    },
    template: `
        <div class="full-w t-left">
            <div class="meta-row calories-row">
                <p>
                    <b>Calories: </b> {{ meta.calories }}
                </p>
            </div>

            <div v-for="(v, k) in meta.macros"
                    class="meta-row">
                <p>
                    <b>{{ k }}</b>: {{ v.grams }}g ({{ v.kcal }} kCal)
                </p>
            </div>
        </div>
    `
})






/* Daily Overview Pie Chart
*===============================*/

const pieChartQs = `.my_arbitrary_wrapper .ct-chart`

const getPieChartData = ()=> {
    const scope = Model
    const data = scope.chart.state
    // transform the name/val pairs to two arrs
    const labels = data.map(R.prop('name'))
    const vals = data.map(R.prop('value'))

    return {
        labels: labels,
        series: vals
    }
}

const buildPieChart = ()=> {    
    const chart_data = getPieChartData()
    window._chart_data = chart_data
    chartState.pie_chart = new Chartist.Pie(pieChartQs, chart_data, {
        labelDirection: 'explode'
    })

    return chartState.pie_chart
}


/*  Daily Intake Breakdown
*===============================*/
const diGraphQs = `.di_graph .ct-chart`

// Build out a Bar Graph where
// each bar represents the calories in a meal
// and each bar is comprised of smaller bars,
// each representing % calories from a macronutrient


//-- Configs
const horizontalGraphOpts = {
    seriesBarDistance: 2,
    reverseData: true,
    horizontalBars: true,
    axisY: {
        offset: 70,
    },
    axisX: {
        scaleMinSpace: 15,
        onlyInteger: true
    }
}

const stackedGraphOpts = {
    stackBars: true
}


const getDimensions = ()=> {
    const docEl = document.documentElement
    const screenHeight = docEl.clientHeight

    const container = cEl(diGraphQs)
    const parentOffset = Dom(container()).parent().getOffset()

    const parentWidth = container().parentElement.clientWidth

    return {
        height: screenHeight - parentOffset.top,
        width: parentWidth * 0.98
    }
}


const getIntakeConfig = (series_arr)=> {
    const baseConfig = merge({}, horizontalGraphOpts)
    const dimensions = getDimensions()

    // baseConfig.axisX.labelInterpolationFnc = getXaxisLabel(series_arr)
    baseConfig.stackBars = true
    baseConfig.height = dimensions.height
    baseConfig.width = dimensions.width

    return baseConfig
}


//-- Meal Chart helpers/utils
const sMeal = (x)=> new IntakeMeal(x)

const kCal = R.prop('kcal')

const bDkCal = (macro_name)=> (bd)=> kCal(bd[String(macro_name)])

const sMealBd = (im)=> im.getBreakdown()

const bdSeries = (bd)=> {
    // m {Object} w/ key/val pairs as: (macro name): (kcal from macro)
    const m = Calc.macroNames.reduce((accum, x)=> {
        accum[x] = bDkCal(x)(bd)
        return accum
    }, {})
    m['calories'] = R.sum(Object.values(m))
    return m
}


const mealChartData = (macro_name, val, scope)=> {
    return {
       // name: macro_name,
        value: val,
        meta: merge(scope, {
            name: macro_name
        })
    }
}



const mealMacroMap = (meal_arr)=> {
    const macroObj = {
        calories: [],
        protein: [],
        carbs: [],
        fat: []
    }
    const sMealArr = meal_arr.map(sMeal)

    sMealArr.map((x)=> {
        const mealKcalBreakdown = bdSeries(x.getBreakdown())

        Object.entries(mealKcalBreakdown).forEach((item)=> {
            const name = first(item)
            const cals = parseFloat(second(item)).toFixed(2)
            macroObj[String(name)].push(
                mealChartData(name, cals, x.toDict())
            )
        })
    })

    return macroObj
}


/* @Function buildMealChartSeries - Build out the 'series' data for a chart
*  @param daily_intake {Object}: The Intake for an entire day
*    This must have a 'meals' key/val pair, with the value being an {Array} of meals
*  @return {Array[{Array}]: A parent array consisting of child arrays.
*    The child arrays contain the calories from a given macro for each meal
*/
const buildMealChartSeries = (daily_intake)=> {
    // Get all of our respective calories, pro, cho, & fat
    const mealSeriesObj = mealMacroMap(daily_intake.meals)
    // Restructure into an array of arrays
    return [
        //mealSeriesObj.calories,
        mealSeriesObj.protein,
        mealSeriesObj.carbs,
        mealSeriesObj.fat
    ]
}


const mealLabel = (meal)=> `${meal.time_consumed}`

const buildMealLabels = (daily_intake)=> daily_intake.meals.map(sMeal).map(mealLabel)


const buildBarLabel = (data, callback=false)=> {
    // Data.type MUST === 'bar'
    const mealMacros = new IntakeMeal(data.meta).getMacros()
    const macro_qty = Number(R.prop(data.meta.name)(mealMacros)).toFixed(1)
    const display_name = Str(data.meta.name).titleCase()
    const labelSvg = new Chartist.Svg('text')

    labelSvg.text(`${macro_qty}g \n${display_name}`)
    labelSvg.attr({
        style: `font-family: Roboto,sans-serif; font-size: 10px; color: white;`,
        x: R.add(data.x1, data.element.width() * 0.1),
        y: R.add(data.y1, (70 * 0.12)),
    })

    return labelSvg
}


const _onMealDraw = function(data) {
    if (data.type === 'bar') {
        data.element.attr({
            style: 'stroke-width: 70px;'
        })
        // Get the label thatwe want to add to the bar
        const barLabel = buildBarLabel(data)
        data.group.append(barLabel)

        if (R.add(barLabel._node.clientWidth, 50) >= data.element.width()) {
            barLabel.remove()
        }
    }
}

const getMealGraphData = (daily_intake)=> {
    const labels = buildMealLabels(daily_intake)
    const series = buildMealChartSeries(daily_intake)

    return {
        labels: labels,
        series: series
    }
}


const buildMealGraph = (onDraw)=> (daily_intake)=> {
    const chart_data = getMealGraphData(daily_intake)
    const graphOpts = getIntakeConfig(chart_data.series)

    const meal_graph = new Chartist.Bar(diGraphQs, chart_data, graphOpts)
    meal_graph.on('draw', onDraw)

    chartState.meal_graph = meal_graph
    return chartState
}





/* Meal Breakdown
*===============================*/



//-- Chart Specific State
const chartState = {
    pie_chart: null,
    meal_graph: null
}


//-- ChartActions all nice and organized for consumption =D
const ChartActions = {

    buildPieChart: buildPieChart,
    buildMealGraph: ()=> {
        const graph = buildMealGraph(_onMealDraw)
        return graph(getData())
    },

    initCharts: (actions)=> {
        return new Promise((resolve, reject)=> {
            deferFn(()=> {
                return resolve(actions.buildPieChart())
            })
        }).then( (x)=> {
            return actions.buildMealGraph()
        })
    },

    onUpdate: (callback)=> {
        chartState.pie_chart.update(getPieChartData())

        setTimeout(()=> {
            // Chartist bar graphs don't like when we do
            // a bunch of styling while animations/transitions are taking place
            // on the chart's parent element
            // So we wait a second & ensure the coast is clear
            // before building out the bar graph
            const chart_data = getMealGraphData(getData())
            const graphOpts = getIntakeConfig(chart_data.series)

            chartState.meal_graph.update(
                chart_data,
                graphOpts
            )
            return callback(true)
        }, 250)

        return true
    },

    updateCharts: (actions)=> {
        return new Promise( (resolve, reject)=> {
            console.log('updateCharts()')
            return actions.onUpdate((x)=> resolve(x))
        })
    }
}





export const MacroGraph = {
    name: 'MacroGraph',

    model: Model,

    components: {
        chartMeta: chartMeta
    },
    mount: function(app) {
        const _this = this        
        window._macroGraph = {
            vue_stuff: {
                chartMeta: chartMeta
            },
            component: _this
        }

        app.observable.subscribe('init', ()=> ChartActions.initCharts(ChartActions))
        app.observable.subscribe('tabChange', ()=> ChartActions.updateCharts(ChartActions))
    }
}










/* Daily Intake Overview & relativity
*=======================================*/

//*****************************************


const default_ratios = {
    fat: 0.30,
    protein: 0.25,
    carbs: 0.45
}

const caloriesFromMacros = (g_pro, g_cho, g_fat)=> (g_pro * 4) + (g_cho * 4) + (g_fat * 9)

/* Given the total calories consumed, and desired ratios, return
*    the macros that comprise the total calories
*  @param ratios {Object}: The macro ratios you want to use as a 'baseline'
*  @param total_kcal {Number}: The total number of calories consumed
*  @return {Object}: The amonut of each macro, translated to grams
*/
const macrosForRatios = (ratios)=> (total_kcal)=> {
    const fat_kcal = total_kcal * ratios.fat
    const carb_kcal = total_kcal * ratios.carbs
    const pro_kcal = (total_kcal - fat_kcal - carb_kcal)

    return {
        protein: pro_kcal / 4,
        fat: fat_kcal / 9,
        carbs: carb_kcal / 4
    }
}


/* Determine the % kcal from each macro when given the total macros consumed
*/
const ratiosForMacros = (macros)=> {
    const cals = caloriesFromMacros(macros.protein, macros.carbs, macros.fat)

    const protein_kcal = macros.protein * 4
    const carb_kcal = macros.carbs * 4
    const fat_kcal = (cals - protein_kcal - carb_kcal)

    // Return the ratios as Floating-point decimals
    return {
        protein: protein_kcal / cals,
        carbs: carb_kcal / cals,
        fat: fat_kcal / cals
    }
}
