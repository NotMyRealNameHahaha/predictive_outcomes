const R = require('ramda');
const moment = require('moment');
const Chartist = require('chartist');
import Vue from 'vue';

import * as utils from '../common/utils';
import { AppStore } from '../outcomes_component/app.store';
import { RangeFilter, DateRange } from './chart.rangefilter';


const serialize = (x)=> JSON.parse(JSON.stringify(x))


/**
 * Convert an Array of RangeNode instances to an
 * Object representation of the respective chart data
 * @param range_node_arr {Array [RangeNode]}
 * @param validIndexes {Array [Number]}
 * @returns {Object}
 */
const getChartData = (range_node_arr, validIndexes)=> {
    let seriesMap = {
        labels: [],
        series: []
    }
    
    range_node_arr.forEach((item, index)=> {
        if (validIndexes.indexOf(index) >= 0) {
            seriesMap.labels.push(
                moment(item.date).format('MMM D YY')
            )
            seriesMap.series.push(item.userStats.weight)
        }
    })
    seriesMap.series = [seriesMap.series]

    return seriesMap
}


export const ChartTemplate = `<outcome-chart></outcome-chart>`


export const ChartComponent = Vue.component('outcome-chart', {
    data: ()=> ({
        chart: '',

        chartOptions: {
            // fullWidth: true,
            // height: '500px',
            // minHeight: '500px',
            // chartPadding: { right: 20, left: 20 },
            lineSmooth: Chartist.Interpolation.cardinal({ fillHoles: true }),
            low: 0,
            showArea: true
        }
    }),

    computed: {
        dateRange: ()=> AppStore.state.dateRange,
        calorie_intake: ()=> AppStore.state.calorie_intake,
        userStats: ()=> AppStore.state.userStats,
        chartData: function() {
            const dateRangeInstance = new DateRange(
                moment(this.dateRange.start).toDate(),
                moment(this.dateRange.end).toDate()
            )
            const dataIndexes = new RangeFilter(dateRangeInstance).getIndexes()
            console.log(dataIndexes)

            const data = getChartData(
                AppStore.getters.rangeScopeNodes(),
                dataIndexes
            )
            console.log(data)

            return data
        }
    },

    watch: {
        // Redraw when the chart data changes
        chartOptions: function() { this.redraw() },
        chartData: function() { this.redraw() },
        calorie_intake: function() { this.redraw() },
        userStats: function() { this.redraw() },
        dateRange: function() { this.redraw() }
    },

    mounted: function() {
        window._ChartComponent = this
        utils.deferFn(()=> this.redraw())
    },

    updated: function () {
        this.redraw()
    },
    activated: function() {
        this.redraw()
    },

    methods: {

        redraw() {
            /**
             * @method redraw: Update the Chartist instance w/ fresh data
             */
            const scope = this

            return utils.debounce(()=> {
                if (scope.chart) {
                    scope.chart.update(
                        scope.chartData,
                        scope.chartOptions
                    )
                } else if (scope.$refs.chartElement) {
                    const chart = new Chartist.Line(
                        scope.$refs.chartElement,
                        serialize(scope.chartData),
                        serialize(scope.chartOptions)
                    )
            
                    chart.on('draw', onChartDraw)
            
                    scope.chart = chart
                }
            }, 200)()
        }

    },
   
    template: `
        <div> 
            <div ref="chartElement" class="ct-chart ct-minor-sixth"></div>
        </div>
    `
})



/** Update or create the Chartist instance
 *  this is handled outside of the component
 *  to reduce cognitive load WRT debouncing
 * @param scope {ChartComponent}
 * @returns {void}
*/

const redrawChart = (scope)=> {
    if (scope.chart) {
        scope.chart.update(
            scope.chartData,
            scope.chartOptions
        )
    } else if (scope.$refs.chartElement) {
        const chart = new Chartist.Line(
            scope.$refs.chartElement,
            serialize(scope.chartData),
            serialize(scope.chartOptions)
        )

        chart.on('draw', onChartDraw)

        scope.chart = chart
    }
}


const onChartDraw = (data)=> {
    if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
            d: {
                begin: 2000 * data.index,
                dur: 2000,
                from: (
                    data.path.clone()
                        .scale(1, 0)
                        .translate(0, data.chartRect.height())
                        .stringify()
                ),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
            }
        })
    }
}

window._ChartComponent = ChartComponent
window._store = AppStore
window.moment = moment
window.R = R