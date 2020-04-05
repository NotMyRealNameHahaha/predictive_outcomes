/**
 * @module stat - Holds Vuex Store module for User Stats, calorie intake, and calorie expenditure
 */
import { mutations } from 'shared/store/mutations'
import { MEASUREMENT_SYSTEMS } from '../../measurement/measurement_system'


const State = {
    // NOTE: User Stats are always stored in the format outlined for each field
    userStats: {
        height: 175, // height in centimeters
        weight: 69, // BW in kg
        age: 18,  // Age in years
        isMale: true  // sex (default: male)
    },

    activityLevel: 1.53,  // Physical Activity Level
    calorieIntake: 2000,
    measurementSystem: MEASUREMENT_SYSTEMS.metric
}


const Getters = {
    // TODO: CR 2020-Feb-16 -  Review for deletion.  Currently not used
}


const Mutations = {
    ...mutations,
    setStats: (state, userStats)=> state.userStats = {...state.userStats, ...userStats}
}


const Actions = {
    /**
     * @method setStoredStats - TODO: CR 2020-Feb-16 - Build this out
     * @see app.js
     */
    setStoredStats: ({ commit, state }, stats)=> {
        return Promise.resolve(stats)
    },

    pushStats: ({ commit, dispatch, state }, stats)=> {
        if (stats.userStats) {
            commit('mergeProp', {
                key: 'userStats',
                value: stats.userStats
            })
        }

        // 'userStats' is the only object value, set
        // all of the other key/vals directly (vs merging)
        commit('setProps',
            Object.entries(stats)
                .filter(
                    ([k, v]) => k !== 'userStats' && state[k] !== v
                )
                .map((key, value) => ({
                    key,
                    value: value
                }))
        )
        return state
    }
}


export const stat = {
    namespaced: true,
    state: State,
    getters: Getters,
    mutations: Mutations,
    actions: Actions
}

export default stat
