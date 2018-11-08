const moment = require('moment');
const R = require('ramda');
import Vue from 'vue';
import { AppStore } from './app.store';
import { ChartComponent } from '../outcomes_chart/chart.component';
import { PredictorsComponent } from '../predictors/predictors.component';


// Component Config
const chartComponent = {
    el:'#app',
    AppStore,

    components: {
        'outcomes-component': ChartComponent,
        'predictors-component': PredictorsComponent
    }
}


// Vue Config
// Vue.use(require('vue-chartist'), {
//     messageNoData: 'No chart data to display'
// })

export const app = new Vue(chartComponent)

