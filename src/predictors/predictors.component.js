const R = require('ramda');
const moment = require('moment');
import Vue from 'vue';

import { AppStore } from '../outcomes_component/app.store';
import { TotalExpenditure, weightDiffKilos } from '../common/bmr';


const sortByDate = R.sortBy(R.prop('date'))


/**
 * Docs: https://material.io/develop/web/components/input-controls/radio-buttons/
 * Example:
```
    import {MDCFormField} from '@material/form-field';
    import {MDCRadio} from '@material/radio';

    const radio = new MDCRadio(document.querySelector('.mdc-radio'));
    const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
    formField.input = radio;
```
 */

 /**
  * Sliders
  * Docs: https://material.io/develop/web/components/input-controls/sliders/
  * Example:
```
import {MDCSlider} from '@material/slider';

const slider = new MDCSlider(document.querySelector('.mdc-slider'));
slider.listen('MDCSlider:change', () => console.log(`Value changed to ${slider.value}`));

```
  */


export const PredictorsComponent = Vue.component('predictors-component', {
    data: ()=> ({
        duration: 0,
        
    }),

    computed: {
        dateRange: ()=> AppStore.state.dateRange,
        calorie_intake: ()=> AppStore.state.calorie_intake,
        userStats: ()=> AppStore.state.userStats,
        chartData: ()=> getChartData(
            AppStore.getters.rangeScopeNodes()
        )
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
        <div v-if="chartData.series[0].length > 1"> 
            <div ref="chartElement" class="ct-chart ct-major-second"></div>
        </div>
    `
})

window._ChartComponent = ChartComponent
window._store = AppStore
window.moment = moment
window.R = R