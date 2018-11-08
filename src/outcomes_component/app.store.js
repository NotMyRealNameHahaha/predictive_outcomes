const moment = require('moment');
const R = require('ramda');
import Vue from 'vue';
import Vuex from 'vuex';

import { TotalExpenditure } from '../common/bmr';

Vue.use(Vuex)

/**
 * @class RangeNode: A functor that facilitates rangeScope (see below)
 * @param intake {Number}: Calorie intake
 * @param expenditure {Number}: Calorie expenditure
 * @param date {Date}: Date this instance is associated w/
 * @param userStats {Object}
 */
export class RangeNode {
    constructor(intake, expenditure, date, userStats) {
        this.intake = intake
        this.expenditure = expenditure
        this.date = date
        this.userStats = userStats
        this.data = userStats
    }

    static map(obj) {
        return new RangeNode(
            obj.intake,
            obj.expenditure,
            obj.date,
            obj.userStats
        )
    }
}

const deltaDays = (start, end)=> Math.abs(
    moment(start).diff(moment(end), 'days')
)

const relativeDate = (start_date)=> {
    const startMoment = moment(start_date)
    return (index)=> startMoment.add(index, 'days').toDate()
}


const userStatsProp = R.prop('userStats')

const userWeight = R.compose(R.prop('weight'), userStatsProp)
const userHeight = R.compose(R.prop('height'), userStatsProp)
const userAge = R.compose(R.prop('age'), userStatsProp)
const userIsMale = R.compose(R.prop('is_male'), userStatsProp)
const userPal = R.compose(R.prop('pal'), userStatsProp)

const dateRangeProp = R.prop('dateRange')
const endDate = R.compose(R.prop('end'), dateRangeProp)
const startDate = R.compose(R.prop('start'), dateRangeProp)

const isNumber = R.compose(R.equals('Number'), R.type)

const repeatN = (fn, n)=> {
    if (!isNumber(n)) {
        throw new TypeError(`
            repeatN expected 'n' to be a Number. 
            Received type ${R.type(n)} instead.
            The value of "n": ${n}
        `)
    }
    let accum = []
    let i = 0
    while (i < n) {
        accum.push(fn())
        i++
    }
    return accum
}

const getRangeScope = (scope)=> {
    try {
        const calorie_intake = scope.calorie_intake
        const start_date = startDate(scope)
        const end_date = endDate(scope)

        const startExpenditure = new TotalExpenditure(
            userWeight(scope),
            userHeight(scope),
            userAge(scope),
            userIsMale(scope),
            userPal(scope)
        )

        const calorieArr = repeatN(
            ()=> calorie_intake,
            deltaDays(start_date, end_date)
        )
        // Cache the start_date moment
        const rangeDate = relativeDate(start_date)

        return startExpenditure.flatMap(calorieArr)
            .map((item, index)=> ({
                    intake: calorieArr[index],
                    expenditure: item.getData(),
                    date: rangeDate(index),
                    userStats: item
            }))
            
    } catch(err) {
        console.error(err)
        throw(err)
    }
}


const passiveMerge = (main)=> R.pipe(
    R.mergeDeepRight(main),
    R.pick(Object.keys(main))
)

const toPlainObj = (obj)=> JSON.parse(JSON.stringify(obj))




// App store/model
export const AppStore = new Vuex.Store({

    // Docs: https://vuex.vuejs.org/guide/state.html
    state: {
        dateRange: {
            start: moment().subtract(30, 'days').toDate(),
            end: moment().toDate()
        },

        calorie_intake: 20000,

        userStats: {
            height: 175, // height in centimeters
            weight: 69, // BW in KG
            age: 18,  // Age in years
            is_male: true,  // sex (default: male)
            pal: 1.53
        }
    },

    // Docs: https://vuex.vuejs.org/guide/getters.html
    getters: {
        rangeScope: (state)=> ()=> {
            return getRangeScope(
                toPlainObj(state)
            )
        },
        rangeScopeNodes: (state, getters)=> {
            return ()=> getters.rangeScope().map((i)=> new RangeNode.map(i))
        }
    },

    // NOTE: Mutations must be synchronous
    // Docs: https://vuex.vuejs.org/guide/mutations.html
    mutations: {
        setDateRange (state, payload) {
            let start = payload.start
            let end = payload.end

            if (start <= end) {
                start = moment(end).subtract(1, 'days').toDate()
            }

            state.dateRange = {
                start: start,
                end: end
            }
        },

        setStats (state, payload) {
            const newStats = passiveMerge(state.userStats, payload)
            state.stats = newStats
        }
    },

    // NOTE: Actions are how you can perform async
    // operations, which then update the state via synchronous mutations
    // Docs: https://vuex.vuejs.org/guide/actions.html
    actions: {

        setDateRange (context) {
            /**
             * @param context {Object}: An object w/ 'commit' method
             * @returns {void}
             */
            context.commit('setDateRange')
        }
    }
})


