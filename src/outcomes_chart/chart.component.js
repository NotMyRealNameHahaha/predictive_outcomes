const R = require('ramda');
const moment = require('moment');
const Chartist = require('chartist');

import Vue from 'vue';
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
            seriesMap.labels.push(item.date)
            seriesMap.series.push(item.userStats.weight)
        }
    })
    const seriesArr = seriesMap.series
    // seriesMap.series = [seriesArr]
    seriesMap.series = [seriesArr]
    return seriesMap
}


export const ChartTemplate = `<outcome-chart></outcome-chart>`


export const ChartComponent = Vue.component('outcome-chart', {
    data: ()=> ({
        chart: '',

        chartOptions: {
            fullWidth: true,
            height: '500px',
            // axisY: { onlyInteger: true },
            // axisX: { onlyInteger: true },
            chartPadding: { right: 10, left: 10 },
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
                this.dateRange.start,
                this.dateRange.end
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
        chartData: function() { this.redraw() }
    },

    mounted: function() {
        window._ChartComponent = this
        this.redraw()
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
            if (this.chart) {
                this.chart.update(
                    this.chartData,
                    this.chartOptions
                )
            } else if (this.$refs.chartElement) {
                try {
                    const chart = new Chartist.Line(
                        this.$refs.chartElement,
                        serialize(this.chartData),
                        serialize(this.chartOptions)
                    )
                    console.log('Chart:')
                    console.log(chart)
                    this.chart = chart
                } catch(err) {
                    throw err
                }
            }
        }

    },
   
    template: `
        <div> 
            <div ref="chartElement" class="ct-chart ct-major-second"></div>
        </div>
    `
})

window._ChartComponent = ChartComponent
window._store = AppStore
window.moment = moment
window.R = R