/**
 * @module weight_categories - Body Mass Index (Bmi) & Ponderal Index (aka Corpulence Index || Ci) categories
 * @see https://www.cdc.gov/nccdphp/dnpao/growthcharts/training/bmiage/page5_1.html
 * @see https://en.wikipedia.org/wiki/Corpulence_index
 * bmi = weight / [(height / 100) ^ 2]
 * ci = weight / [(height / 100) ^ 3]
 */


const bmiObese = 30
const bmiOverweight = 25
const bmiNormal = 18.5


const BmiCategories = {
    obese: bmi => bmi >= bmiObese,
    overweight: bmi => bmi < bmiOverweight && bmi > bmiNormal,
    normal: bmi => bmi < bmiOverweight && bmi >= bmiNormal,
    underweight: bmi => bmi < bmiNormal
}


const ciObese = 18
const ciOverweight = 15
const ciNormal = 11


const CiCategories = {
    obese: ci => ci >= ciObese,
    overweight: ci => ci < ciOverweight && ci > ciNormal,
    normal: ci => ci < ciOverweight && ci >= ciNormal,
    underweight: ci => ci < ciNormal
}


const equation = factor => height => {
    const denominator = Math.pow(height / 100, factor)
    return weight => weight / denominator
}


export const Bmi = equation(2)

export const Ci = equation(3)


/**
 * @func getCategory - Get the category name that corresponds with the given value
 * Uses the `categoryMap` to find the first key/val pair where the value is a unary
 * function that accepts a Number and returns a Boolean.
 * @param {Object.<number, function(Number):Boolean>} categoryMap
 * @returns {function(Number): String|null}
 */
const getCategory = categoryMap => value => {
    for (let k in categoryMap) {
        const func = categoryMap[k]
        if (func(value)) {
            return k
        }
    }
    return null
}


export const getBmiCategory = getCategory(BmiCategories)

export const getCiCategory = getCategory(CiCategories)

