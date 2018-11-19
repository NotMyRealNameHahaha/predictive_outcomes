const R = require('ramda');
const moment = require('moment');
import Vue from 'vue';
import { MDCSlider } from '@material/slider';
import {MDCSelect} from '@material/select';
import {MDCTextField} from '@material/textfield';
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';


// App
import { AppStore } from '../outcomes_component/app.store';
import { TotalExpenditure, weightDiffKilos } from '../common/bmr';

// Templates
import { DateForm } from './predictors.date.form';
import { IntakeForm } from './predictors.intake.form';
import { PhysicalActivityForm } from './predictors.pal.form';
import { UserForm } from './predictors.userform';

import * as utils from '../common/utils';


// Templates
export const PredictorsTemplate = `<predictors-component></predictors-component>`

export const formTemplate = [
    DateForm,
    IntakeForm,
    PhysicalActivityForm,
    UserForm
].map(R.prop('template')).join('')


const today = moment().toDate()

const toInches = (feet, inches=0)=> (12 * feet) + inches
const toCm = R.multiply(2.54)




/**
 * @export PredictorsComponent {Vue.component}
 * *
 */
export const PredictorsComponent = Vue.component('predictors-component', {
    data: function() { return {
        dateRange: 30,
        calorie_intake: AppStore.state.calorie_intake,

        // TODO: Map this to userStats.is_male
        sex: 'male',

        // TODO: Map this to userStats.height
        height: {
            feet: 5,
            inches: 7
        },

        userStats: AppStore.state.userStats
    }},

    watch: {
        calorie_intake: function(val) {
            AppStore.commit('setIntake', Number(val))
        },

        dateRange: function(val) {
            const diff = moment(today).add(this.dateRange, 'days').toDate()

            AppStore.commit('setDateRange', {
                start: today,
                end: diff
            })
        },

        height: function() {
            this.pushState()
        },

        userStats: function() {
            this.pushState()
        },

        sex: function() {
            this.pushState()
        }
    },

    methods: {
        pushState: function() {
            const stats = this.userStats
            const calcHeight = toCm(
                toInches(Number(this.height.feet), Number(this.height.inches))
            )

            const newStats = {
                weight: Number(stats.weight),
                age: Number(stats.age),
                is_male: (stats.sex === 'male'),
                pal: Number(stats.pal),
                height: calcHeight
            }

            AppStore.commit('setStats', newStats)

            AppStore.commit('setIntake', Number(this.calorie_intake))

            AppStore.commit('setDateRange', {
                start: today,
                end: moment(today).add(this.dateRange, 'days').toDate()
            })

        },

        onDateChange: function(mdc_slider) {
            this.dateRange = mdc_slider.value
        }
    },

    template: `
        <div id="predictors-component--container"
                class="mdc-layout-grid">
            <div class="mdc-layout-grid__inner">
                ${formTemplate}        
            </div>
        </div>
    `,

    mounted: function() {
        const _this = this
        // Let the DOM render & all the other initialization occur,
        // then setup our MDC components.  The slight delay helps
        // prevent resizing related issues
        utils.deferFn(()=> initMdcComponents(_this.$refs, _this.onDateChange))

        utils.deferFn(()=> _this.pushState())
    },

    updated: function() {
        this.pushState()
    }
})




const initMdcComponents = (refs, onDateChange)=> {
    /** Setup MDC components after the form elements are rendered
     */
    const palSelect = refs[PhysicalActivityForm.ref]
    new MDCSelect(palSelect.parentElement)

    utils.cEls('.mdc-text-field')().forEach((i)=> new MDCTextField(i))
    utils.cEls('.mdc-radio')().forEach((i)=> new MDCRadio(i))
    utils.cEls('.mdc-form-field')().forEach((i)=> new MDCFormField(i))

    // Set up the date Slider
    const sliderRef = DateForm.ref
    const sliderEl = refs[sliderRef]
    const _mdcSlider = initSlider(sliderEl).slider

    _mdcSlider.listen('MDCSlider:change', utils.debounce(
        ()=> onDateChange(_mdcSlider), 50
    ))

    _mdcSlider.layout()
}


const initSlider = (el)=> {
    const slider = new MDCSlider(el)
    return {
        el: el,
        slider: slider
    }
}

