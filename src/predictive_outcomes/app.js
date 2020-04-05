import './app_styles.scss'
import { MdChips } from 'vue-material/dist/components'
import TrendChart from 'vue-trend-chart'
import Vue from '../shared/global_components'
import * as R from 'ramda'
import store from './store/index'


Vue.use(MdChips)
Vue.use(TrendChart)


export const app = new Vue({
    store,
    el:'#app',
    components: {
        'predictive-outcomes': ()=> import('./components/PredictiveOutcomes.vue')
    }
})

window._App = app
window.R = R