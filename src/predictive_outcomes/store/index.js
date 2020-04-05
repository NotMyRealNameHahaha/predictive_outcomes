import Vue from 'vue'
import Vuex from 'vuex'
import prediction from './modules/prediction'
import stat from './modules/stat'

Vue.use(Vuex)



/**
 * @exports store {Vuex.Store}
 * @property {Object} state: The store state
 */
export const store = new Vuex.Store({
    modules: {
        prediction,
        stat
    }
})

export default store
