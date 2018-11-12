// import '../app_styles.scss';
const mdc = require('material-components-web');
window.mdc = mdc

// Libs
const moment = require('moment');
const R = require('ramda');
import Vue from 'vue';
// App
import { AppStore } from './app.store';
import { ChartComponent, ChartTemplate } from '../outcomes_chart/chart.component';
import { PredictorsComponent, PredictorsTemplate } from '../predictors/predictors.component';



function buildDocument() {
    const styleElement = `
        <link href="/bundle.css" type="text/css" rel="stylesheet">
    `
    const appTemplate = `
        ${styleElement}
        <div id="app">
            ${ChartTemplate}
            ${PredictorsTemplate}
        </div>
    `

    document.body.insertAdjacentHTML('beforeend', appTemplate)

    setTimeout(()=> mdc.autoInit(), 200)
}

buildDocument()



// Component Config
const chartComponent = {
    el:'#app',
    store: AppStore,

    components: {
        'outcomes-component': ChartComponent,
        'predictors-component': PredictorsComponent
    }
}

export const app = new Vue(chartComponent)
