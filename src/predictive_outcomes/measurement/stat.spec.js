import * as R from 'ramda'
import { assert } from 'chai'
import { toPojo } from 'common/utils'
import { getPal } from './activity_level'
import {
    userStatsPredictions,
    WeightGenerator
} from './stat'


const weight = R.prop('weight')


const reduceHighlights = R.compose(
    R.reduce(R.mergeDeepRight, {}),
    toPojo
)


const getMaxCaloriesBurned = R.compose(
    R.prop('maxCaloriesBurnedPerDay'),
    reduceHighlights
)


const tinyPersonStats = {
    height: 200, // height in centimeters
    weight: 2, // BW in kg
    age: 20,  // Age in years
    isMale: true  // sex (default: male)
}


const bigPersonStats = {
    ...tinyPersonStats,
    weight: 200, // 200kg =)
    age: 20
}


// 100 days as a baseline duration
const duration = 100
const sedentaryPal = getPal(1).value
const athletePal = getPal(14).value

const weightLossCalories = 200
// Any will gain weight on 200k calories a day =O
const weightGainCalories = weightLossCalories * 1000



const userPredictionFactory = (userStats=tinyPersonStats)=> (pal, calorieIntake=weightGainCalories)=> {
    const prediction = userStatsPredictions(
        duration,
        pal,
        calorieIntake,
        {...userStats}
    )

    return {
        ...prediction,
        userStats,
        pal,
        calorieIntake
    }
}


const tinyUserPredictionFactory = userPredictionFactory({...tinyPersonStats})


const bigUserPredictionFactory = userPredictionFactory({...bigPersonStats})



/**
 * @function testUserGainsWeight - Checks to ensure
 * the userStatsPredictions predicts that a user will
 * gain weight if they eat way too much
 */
function testUserGainsWeight() {
    const { statsList, userStats } = tinyUserPredictionFactory(sedentaryPal, weightGainCalories)
    const startWeight = weight(R.head(statsList))
    const endWeight = weight(R.last(statsList))

    assert.isAbove(
        endWeight,
        startWeight,
        `User gained weight when they were sedentary and consumed ${weightGainCalories} kcal/day`
    )
    console.log('testUserGainsWeight passed')
    return {
        endWeight,
        startWeight,
        userStats
    }
}
