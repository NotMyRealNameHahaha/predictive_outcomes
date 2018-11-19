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
    const headMeta = `
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
    `

    document.head.insertAdjacentHTML('beforeend', headMeta)

    const styleElement = `
        <link href="/bundle.css" type="text/css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
        <link href="https://cdn.materialdesignicons.com/2.8.94/css/materialdesignicons.min.css" rel="stylesheet">
    `
    const appTemplate = `
        ${styleElement}
        <div id="app">
            <div class="row">
                ${ChartTemplate}
            </div>
            <div class="row">
                ${PredictorsTemplate}
            </div>
        </div>
    `

    const bod = document.body
    bod.insertAdjacentHTML('beforeend', appTemplate)
    bod.classList.add('mdc-typography')

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
