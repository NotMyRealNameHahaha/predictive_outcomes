import * as R from 'ramda';
import * as moment_module from 'moment';
import { merge } from '../../common/utils.js'
const moment = moment_module.default

/* Utils
*****************************/

const first = (arr)=> arr[0]
const second = (arr)=> arr[1]
const last = (arr)=> (arr.length - 1) > 0
    ? arr[arr.length - 1]
    : first(arr)


/* Find the average value of an array of Numbers
*  >>> mean([1, 2, 3, 4, 5, 6, 7]) //=> 4
*/
const mean = R.converge(R.divide, [R.sum, R.length])


/* Macros <-> Calories
*****************************/

export const macroNames = ['protein', 'carbs', 'fat']

export const proCals = 4
export const choCals = 4
export const fatCals = 9


export const pro = R.prop('protein')
export const calsFromPro = (o)=> pro(o) * proCals

export const cho = R.prop('carbs')
export const calsFromCho = (o)=> cho(o) * choCals

export const fat = R.prop('fat')
export const calsFromFat = (o)=> fat(o) * fatCals

export const macroCals = {
    protein: proCals,
    carbs: choCals,
    fat: fatCals
}


/* @Function calFromMacros: Calculate Total kcals per macro set
*  gpro {Number}, gcho {Number}, gfat {Number} -> {Number}
*=============================*/
export const calFromMacros = (gpro, gcho, gfat)=> R.sum([
    calsFromPro(gpro),
    calsFromCho(gcho),
    calsFromFat(gfat)
])


const calsPerMacro = (macro_name)=> (g)=> macroCals[macro_name] * g

const _calReducer = (accum, item)=> {
    const calsForItem = calsPerMacro(first(item))
    return accum + calsForItem(second(item))
}



/* @Function calFromMacroObj: Calculate total kcal per macro Object
*  obj {Object} -> {Number}
*
*  >>> const myMacros = {protein: 1, carbs: 2, fat: 3}
*  >>> calFromMacroObj(myMacros) //=> 36
*========================================*/
export const calFromMacroObj = (obj)=> Object.entries(obj).reduce(
    _calReducer,
    0
)


/*  Calorie Breakdown (% kCal from macros)
*====================================================*
*====================================================*/

const fractionTotal = (total, val)=> val / total

const cFractionTotal = (t)=> (v)=> fractionTotal(t, v)


/* @Function percentCalFromMacro: ({Number}) -> {Function -> {Object}}
*  Accepts an the total number of kCals consumed, and returns a function
*   that accepts an macronutrient object
*  It returns an Object with the values set to total # of kCals from each
*    macronutrient
*/
export const percentCalFromMacro = (t)=> R.applySpec({
    protein: R.compose(cFractionTotal(t), calsFromPro),
    carbs: R.compose(cFractionTotal(t), calsFromCho),
    fat: R.compose(cFractionTotal(t), calsFromFat)
})



export const MacroTypeObject = (name, grams, total_kcal)=> {
    const macroKcal = calsPerMacro(name)(grams)
    return {
        grams: Number(grams).toFixed(2),
        kcal: Number(macroKcal).toFixed(2),
        percentKcal: Number(fractionTotal(total_kcal, macroKcal)).toFixed(2)
    }
}

const _isMacro = (name)=> macroNames.indexOf(name) > -1

const _firstIsMacro = R.compose(_isMacro, first)

const _macrosOnly = R.compose(
    R.fromPairs,
    R.filter(_firstIsMacro),
    Object.entries
)


/* @Function MacroObject
*  Transform an object of macros to an object of macro grams, kcals, and % kcal
*  >>> const myMacros = {protein: 1, carbs: 2, fat: 3}
*  >>> const myMacroObj = macroObject(myMacros)
*  >>> console.log(myMacroObject)
* ... {
    protein: {
        grams: 1,
        kcal: 4,
        percentKcal: 0.111111
    },
    carbs: {
        grams: 2,
        kcal: 8,
        percentKcal: 0.22222
    },
    etc, etc.
 }
* ...
*/
export const MacroObject = (o)=> {
    // Filter to ensure we are only working with macros
    const macros = _macrosOnly(o)
    const total_kcal = calFromMacroObj(o)

    // [a, b] -> MacroObject(a, b, total_kcal)
    const macroWithKcal = (x)=> MacroTypeObject(first(x), second(x), total_kcal)

    return Object.entries(macros).reduce((accum, item)=> {
        const itemKey = String(first(item))

        accum[itemKey] = macroWithKcal(item)
        return accum
    }, {})
}

