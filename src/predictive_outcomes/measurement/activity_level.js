/**
 * @module activity_level - Provide an interface for calculating & displaying
 * a User's Physical Activity Level (PAL)
 * 
 *  TEE = Total Energy expenditure (for a 24-hr period)
 *  BMR = Basal Metabolic Rate
 *  PAL = TEE / BMR
 * 
 * See this fantastic research article by the World Health Organization (WHO)
 * for a much better explanation of the Physical Activity Level categories:
 * http://www.fao.org/3/y5686e/y5686e07.htm#bm07.3
 * 
 * Take note of the section regarding the lower PAL values being associated
 * with sedentary lifestyles, specifically notes from the
 * International Obesity Task Force (LOLOLOLOLOLOLOLOLOLOLOL  ¯\_(ツ)_/¯)
 */
export const DEFAULT_PAL = 1.4
export const WORKOUT_MIN = 0
export const WORKOUT_MAX = 15
export const WORKOUT_STEP = 1

export const HEAVY_LABOR_FACTOR = 0.4
export const ACTIVE_MILITARY_FACTOR = 2.1


export const palFactors = [
    ['Heavy Labor', HEAVY_LABOR_FACTOR],
    ['Active Military', ACTIVE_MILITARY_FACTOR]
]


// [workoutHours, [PAL, displayString]]
const palMap = new Map([
    [0, [1.4, 'Sedentary']],
    [1, [1.5, 'Low Activity']],
    [2, [1.57, 'Low Activity']],
    [3, [1.65, 'Low Activity']],
    [4, [1.72, 'Moderate Activity']],
    [5, [1.79, 'Moderate Activity']],
    [6, [1.85, 'Moderate Activity']],
    [7, [1.9, 'Hardcore Activity']],
    [8, [1.95, 'Hardcore Activity']],
    [9, [2.0, 'Hardcore Activity']],
    [10, [2.2, 'Professional Athlete']],
    [11, [2.3, 'Professional Athlete']],
    [12, [2.4, 'Professional Athlete']],
    [13, [2.5, 'Professional Athlete']],
    [14, [2.6, 'Professional Athlete']],
])


/**
 * @func getPal - Get an Object describing the Physical Activity level
 * for an individual based on the number/hours of exercise per week
 * @param {Number} workoutN - Hours of exercise per week
 * @returns {{ name: String, value: Number}}
 */
export const getPal = (workoutN, factors=[]) => {
    if (workoutN > WORKOUT_MAX) {
        return {
            name: 'Active Military',
            value: 4.6
        }
    }

    for (let list of palMap.entries()) {
        const listWorkout = list[0]
        if (workoutN === listWorkout) {
            const [pal, name] = list[1]
            return {
                // @ts-ignore
                name,
                // @ts-ignore
                value: pal
            }
        }
    }

    // Otherwise, return default sedentary value
    return {
        name: 'Sedentary',
        value: DEFAULT_PAL
    }
}


export const palCategories = Array.from(palMap.entries()).reduce(
    (obj, [hours, [pal, description]])=> ({
        ...obj,
        [pal]: description
    }),
    {}
)


export class ActivityLevel {
    constructor(pal) {
        this.value = pal
    }

    static get categories() {
        return palCategories
    }

    static isDefault(n) {
        return n === DEFAULT_PAL
    }

    get description() {
        const categories = this.constructor.categories
        return categories[this.value] || categories[DEFAULT_PAL]
    }

    /** Get a person's total energy expenditure for a day
     *   when given their PAL & BMR
     *  @param {Number} bmr - The user's BMR (Basal Metabolic Rate)
     *  @returns {Number}
     */
    getEnergyExpenditure(bmr) {
        return this.value * bmr
    }

    tee(bmr) {
        return this.getEnergyExpenditure(bmr)
    }
}

export default ActivityLevel