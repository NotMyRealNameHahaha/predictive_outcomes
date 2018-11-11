const R = require('ramda');
const moment = require('moment');
import Vue from 'vue';
import { MDCSlider } from '@material/slider';

// App
import { AppStore } from '../outcomes_component/app.store';
import { TotalExpenditure, weightDiffKilos } from '../common/bmr';

// Templates
import { DateForm } from './predictors.date.form';
import { IntakeForm } from './predictors.intake.form';
import { PhysicalActivityForm } from './predictors.date.form';
import { UserForm } from './predictors.userform';

import * as utils from '../utils';

export const PredictorsTemplate = `<predictors-component></predictors-component>`

export const formTemplate = [
    DateForm,
    IntakeForm,
    PhysicalActivityForm,
    UserForm
].map(R.prop('template')).join('')

/**
    MDC Cheat Sheet

    //-- Slides
    // import { MDCSlider } from '@material/slider';
    const dayRangeSlider = document.querySelector('[ref="PredictorsComponent.dayrange"]')
    const slider = new MDCSlider(dayRangeSlider)
    slider.listen('MDCSlider:change', ()=> console.log(`Value changed to ${slider.value}`))


    // Select
    // import {MDCSelect} from '@material/select';
    const palSelect = document.querySelector('[ref="PredictorsComponent.pal"]')
    const select = new MDCSelect(palSelect)

    select.listen('MDCSelect:change', () => {
        console.log(
            `Selected option at index ${select.selectedIndex} with value "${select.value}"`
        )
    })


    // Text input
    // import {MDCTextField} from '@material/textfield';
    const myTextInput = document.querySelector('.mdc-text-field')
    const textField = new MDCTextField(myTextInput)
  */


const initSlider = (el)=> {
    const slider = new MDCSlider(el)
    return {
        el: el,
        slider: slider
    }
}


const sortByDate = R.sortBy(R.prop('date'))

const toInches = (feet, inches=0)=> (12 * feet) + inches
const toCm = R.multiply(2.54)


export const PredictorsComponent = Vue.component('predictors-component', {
    data: function() { return {
        dateRange: 30,
        calorie_intake: 2000,

        // TODO: Map this to userStats.is_male
        sex: 'male',

        // TODO: Map this to userStats.height
        height: {
            feet: 5,
            inches: 7
        },

        userStats: {
            // height: 175, // height in centimeters
            weight: 69, // BW in KG
            age: 18,  // Age in years
            is_male: true,  // sex (default: male)
            pal: 1.53
        }
    }},

    watch: {
        calorie_intake: function(val) {
            console.log('calorie_intake')
            AppStore.commit('setIntake', Number(val))
        },

        dateRange: function(val) {
            // AppStore.state.dateRange = Number(val)
            console.log('dateRange')
            console.log(this.dateRange)

            const today = moment().toDate()
            const diff = moment().add(this.dateRange, 'days').toDate()

            AppStore.commit('setDateRange', {
                start: today,
                end: diff
            })
        },

        height: function() {
            this.pushState()
        }
    },

    methods: {
        pushState: function() {
            console.log('pushState()')
            const stats = this.userStats
            const calcHeight = toCm(
                toInches(Number(this.height.feet), Number(this.height.inches))
            )

            const newStats = {
                weight: Number(stats.weight) / 2.2,
                age: Number(stats.age),
                is_male: (stats.sex === 'male'),
                pal: Number(stats.pal),
                height: calcHeight
            }

            AppStore.commit('setStats', newStats)
        }
    },

    template: `<div id="predictors-component--container">${formTemplate}</div>`,

    mounted: function() {
        console.log('mounted')
        window._PredictorsComponent = this
        this.pushState()

        const sliderRef = DateForm.ref
        const sliderEl = this.$refs[sliderRef]
        const _mdcSlider = initSlider(sliderEl).slider
        const _this = this

        _mdcSlider.listen('MDCSlider:change', ()=> {
            _this.dateRange = _mdcSlider.value
        })
    },

    updated: function() {
        console.log('updated')
        window._PredictorsComponent = this
        this.pushState()
    }

    // computed: {
    //     dateRange: ()=> AppStore.state.dateRange,
    //     calorie_intake: ()=> AppStore.state.calorie_intake,
    //     userStats: ()=> AppStore.state.userStats,
    //     chartData: ()=> getChartData(
    //         AppStore.getters.rangeScopeNodes()
    //     )
    // },

    // watch: {
    //     // Redraw when the chart data changes
    //     chartOptions: function() { this.redraw() },
    //     chartData: function() { this.redraw() }
    // },

    // mounted: function() {
    //     window._ChartComponent = this
    //     this.redraw()
    // },

    // updated: function () {
    //     this.redraw()
    // },
    // activated: function() {
    //     this.redraw()
    // },

    // methods: {

    //     redraw() {
    //         /**
    //          * @method redraw: Update the Chartist instance w/ fresh data
    //          */
    //         if (this.chart) {
    //             this.chart.update(
    //                 this.chartData,
    //                 this.chartOptions
    //             )
    //         } else if (this.$refs.chartElement) {
    //             try {
    //                 const chart = new Chartist.Line(
    //                     this.$refs.chartElement,
    //                     serialize(this.chartData),
    //                     serialize(this.chartOptions)
    //                 )
    //                 console.log('Chart:')
    //                 console.log(chart)
    //                 this.chart = chart
    //             } catch(err) {
    //                 throw err
    //             }
    //         }
    //     }

    // },
   
})

window._PredictorsComponent = PredictorsComponent
window._store = AppStore
window.moment = moment
window.R = R