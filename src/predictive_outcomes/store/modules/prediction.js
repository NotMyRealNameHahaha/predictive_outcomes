/**
 * @module stats - Holds Vuex Store module for User Stats, calorie intake, and calorie expenditure
 */
import * as moment from 'moment'
import * as R from 'ramda'
import { mutations } from 'shared/store/mutations'
import { getRangeScope, RangeNode } from '../utils'
import { userStatsPredictions } from '../../measurement/stat'
import { MEASUREMENT_SYSTEMS, Weight } from '../../measurement/measurement_system'


const today = moment().toDate()


const dateByIndex = n =>
    moment(today)
        .add(n, 'day')
        .toDate()


//-- State

const State = {
    // NOTE: User Stats are always stored in the format outlined for each field
    dateRange: {
        startDate: today,
        endDate: moment().add(30, 'days').toDate(),
        duration: 30  // # of days between start & end
    },

    predictions: {
        nodes: [],
        highlights: []
    },

    measurementSystem: 0
}


//-- Getters

const Getters = {
    rangeScope: (state)=> ()=> {
        return R.tryCatch(
            getRangeScope,
            ()=> []
        )(state)
    },

    rangeScopeNodes: (state, getters)=> {
        return ()=> getters.rangeScope().map((i)=> RangeNode.map(i))
    },

    weightMonad: ({ measurementSystem })=> Weight.of(measurementSystem),
}


//-- Mutations

const Mutations = {
    ...mutations
}


//-- Actions

const Actions = {
    setDuration: ({ state, commit }, duration)=> {
        commit('mergeProp', {
            key: 'dateRange',
            value: {
                duration
            }
        })
    },

    /**
     * @method calculate - Handles building out our "predictions"
     * Uses activity level, calories, & physical stats to build out a list
     * representing the user's physical stats over time, as well as their
     * calorie burn stats, just for funsies
     *
     * The measurement system is required to ensure weights are converted to a
     * format the user is most familiar with.  This is especially useful
     * for the chart tooltips, chart labels, & stat summary table values
     * 
     * @param {Object} arg
     * @param {{
     *   activityLevel: Number,
     *   calorieIntake: Number,
     *   userStats: Object,
     *   measurementSystem: Number
     * }} params
     * @returns {Promise}
     */
    calculate: ({ state, commit }, { activityLevel, calorieIntake, userStats, measurementSystem })=> {
        commit('setProp', {
            key: 'measurementSystem',
            value: measurementSystem
        })
        const { duration } = state.dateRange
        const { statsList, highlights } = userStatsPredictions(
            duration,
            activityLevel,
            calorieIntake,
            userStats
        )

        const weightConverter = kg => Weight.convert(measurementSystem)(kg).value()

        const nodes = statsList.map((stat, index) => ({
            ...stat,
            weight: weightConverter(stat.weight),
            date: dateByIndex(index)
        }))

        const convertedHighlights = Object.entries(highlights)
            .reduce(
                (obj, [k, v])=> ({
                    ...obj,
                    [k]: weightConverter(v)
                }),
                {}
            )

        commit('mergeProps', [
            {
                key: 'predictions',
                value: {
                    nodes,
                    highlights: [convertedHighlights]
                }
            },
            {
                key: 'dateRange',
                value: {
                    startDate: today,
                    endDate: dateByIndex(duration)
                }
            }
        ])
        return Promise.resolve({ nodes, highlights })
    }
}


//-- Utils


export const prediction = {
    namespaced: true,
    state: State,
    getters: Getters,
    mutations: Mutations,
    actions: Actions
}
export default prediction
