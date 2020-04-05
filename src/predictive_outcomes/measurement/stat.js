/**
 * Provide the means to calculate Total Energy Expenditure (TEE) & Basal Metabolic Rate (BMR)
 * As well as several functions to project how those factors influence bodyweight (and vice-versa)
 * over a given period of time.
 * 
 * NOTE #1: TEE & BMR calculations are based on the Mifflin St. Jeor equation
 * Research regarding the efficacy of this equation & reason for choosing it:
 * @see https://www.ncbi.nlm.nih.gov/pubmed/15883556
 * 
 * NOTE #2:  Measurements are always metric
 * 
 * @exports WeightGenerator
 * @exports userStatsPredictions
 */

import * as R from 'ramda'
import Monad from 'common/functional_types'
import { ActivityLevel } from './activity_level'
import { Bmi, Ci } from './weight_categories'


const toFixed = n => parseFloat(n.toFixed(2))


/**
 * @typedef {Object} UserStats - An object used to represent the physical stats
 * of a human.  We only care about their physical composition & properties.
 * @property {Number} height - Height (cm)
 * @property {Number} weight - Bodyweight (kg)
 * @property {Number} age - Years old (min = 10)
 * @property {Boolean} isMale - Is this person male?  Males have a higher BMR
 */
const defaultUserStats = {
    height: 175,
    weight: 69,  // lol
    age: 18,
    isMale: true
}


const weightChangeImperial = (intake, expenditure) => Math.abs(intake - expenditure) / 3500


const weightChange = intake => expenditure => weightChangeImperial(intake, expenditure) / 2.2


const burnRate = intake => (expenditure, kg) => {
    const bodyWeightDelta = weightChange(intake)(expenditure)
    return (intake - expenditure) > 0
        ? kg + bodyWeightDelta
        : kg - bodyWeightDelta
}


const sexModifier = isMale => isMale ? 5 : -161


class Equation extends Monad {
    constructor(stats, index=0) {
        super(stats)
        this.index = index
        this.spec = {
            weight: R.multiply(10),
            height: R.multiply(6.25),
            age: R.multiply(5)
        }
    }

    getBmrFn() {
        const { height, age, isMale } = this.value().userStats
        const staticSum = R.sum([
            this.spec.height(height),
            this.spec.age(age),
            sexModifier(isMale)
        ])
        const weightPred = this.spec.weight

        return weight => staticSum + weightPred(weight)
    }
}


const Bmr = userStats =>
    new Equation({ userStats })
        .getBmrFn()(userStats.weight)


const totalCalorieNeeds = activityLevel => userStats =>
    new ActivityLevel(activityLevel)
        .tee(
            Bmr(userStats)
        )

/**
 * @typedef {{
 *     caloriesBurnedPerDay: Number,
 *     lastWeight: Number,
 *     index: Number,
 *     weight: Number
 * }} StatsSummary
 */

/**
 * @func WeightGenerator - Determine how a person's weight changes over time.
 * @param {Number} activityLevel
 * @param {Number} calorieIntake
 * @param {UserStats} userStats
 * @returns {function(Number): {
 *      statsList: StatsSummary[],
 *      lastWeight: Number
 * }}
 */
export const WeightGenerator = (activityLevel, calorieIntake, userStats = defaultUserStats) => {
    const palFn = totalCalorieNeeds(activityLevel)
    const needsFn = burnRate(calorieIntake)
    return duration =>
        R.repeat(0, duration)
        .reduce(
            ({ statsList, lastWeight }, _, index) => {
                const caloriesBurnedPerDay = palFn({
                    ...userStats,
                    weight: lastWeight
                })
                const newWeight = needsFn(
                    caloriesBurnedPerDay,
                    lastWeight
                )

                return {
                    statsList: statsList.concat({
                        caloriesBurnedPerDay,
                        index,
                        lastWeight,
                        weight: newWeight
                    }),
                    lastWeight: newWeight
                }
            }, {
                statsList: [],
                lastWeight: userStats.weight
            }
        )
}


const heightLens = R.lensProp('height')

const vHeight = R.compose(
    R.view(
        // @ts-ignore
        R.compose(
            R.lensIndex(0),
            heightLens
        )
    )
)


const weightLens = R.lensProp('weight')

const vWeight = R.view(weightLens)


const liftWeightValues = R.compose(
    R.filter(n => n > 0),
    R.map(vWeight)
)


const liftMax = R.reduce(R.max, 0)


const liftMin = R.reduce(R.min, Infinity)


const getHighlights = statsList => {
    const bmiPred = Bmi(vHeight(statsList))
    const weights = liftWeightValues(statsList)
    const min = liftMin(weights)
    const max = liftMax(weights)
    const minBmi = bmiPred(min)
    const maxBmi = bmiPred(max)
    const delta = max - min
    const average = Math.abs(delta) / statsList.length
    const caloriesBurnedPerDayList = statsList.map(R.prop('caloriesBurnedPerDay'))
    const minCaloriesBurnedPerDay = liftMax(caloriesBurnedPerDayList)
    const maxCaloriesBurnedPerDay = liftMin(caloriesBurnedPerDayList)

    return Object.entries({
        min,
        max,
        minBmi,
        maxBmi,
        delta,
        average,
        minCaloriesBurnedPerDay,
        maxCaloriesBurnedPerDay,
        startWeight: R.head(weights),
        endWeight: R.last(weights)
    }).reduce(
        (obj, [k, v])=> ({
            ...obj,
            [k]: toFixed(v)
        }),
        {}
    )
}


/**
 * @func userStatsPredictions - Get a list of user stats representing how an
 * individual's stats (weight, calorie needs, etc) change over time
 * @param {Number} duration
 * @param {Number} activityLevel
 * @param {Number} calorieIntake
 * @param {Object} userStats
 */
export const userStatsPredictions = (duration, activityLevel, calorieIntake, userStats=defaultUserStats)=> {
    const { statsList } = WeightGenerator(activityLevel, calorieIntake, userStats)(duration)
    return {
        statsList: statsList,
        highlights: getHighlights(statsList)
    }
}
