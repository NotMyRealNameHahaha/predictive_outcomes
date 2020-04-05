import * as R from 'ramda'
import { Term } from './term'
import { displayNumber } from './weight'


export const RATIO = 2.54


const fixed = n => parseFloat(n.toFixed(2))


export const toMetric = R.compose(fixed, inch => inch * RATIO)


export const toImperial = R.compose(fixed, cm => cm / RATIO)


/**
 * @func Length
 * @param {{short: String, long: String}} nameObj
 * @param {Boolean} [isMetric=false]
 * @returns {function(Number): Object<string, Function|Boolean>}
 */
export const Length = (nameObj, isMetric=false) => {
    const nameFn = n => {
        const displayN = displayNumber(n)
        const toTerm = t => Term(t)[displayN === 1 ? 'toPlural' : 'toSingular']()
        return {
            short: ()=> toTerm(`${displayN} ${nameObj.short}`),
            long: ()=> toTerm(`${displayN} ${nameObj.long}`)
        }
    }
    
    const recursive = n => Length(nameObj, isMetric)(n)

    return n => ({
        isMetric,
        isImperial: !isMetric,

        toMetric: ()=>
            isMetric
                ? recursive(n)
                : recursive(n)
                    .flip(),

        toImperial: ()=>
            !isMetric
                ? recursive(n)
                : recursive(n)
                    .flip(),

        displayNames: ()=> ({
            short: nameFn(n).short(),
            long: nameFn(n).long()
        }),

        flip: ()=>
            isMetric
                ? Inch(n).map(toImperial)
                : Cm(n).map(toMetric),
        
        eq: len => recursive(n).toMetric().value() === len.toMetric().value(),

        of: x => recursive(x),
        args: ()=> ({ nameObj, isMetric }),
        value: ()=> n,
        map: fn => recursive(fn(n)),
        chain: fn => fn(n),

        toString: ()=> recursive(n).displayNames().long
    })
}



export const Cm = Length(
    {
        short: 'cm',
        long: 'centimeter'
    },
    true
)


export const FootInch = n => ({
    value: ()=> n,
    foot: ()=> Inch(n / 12),
    inch: ()=> Inch(n),
    split: ()=> FootInch.split( Number(n) ),

    join: (foot, inch=0)=> FootInch.join(foot, inch),
    cata: ({ foot, inch })=> FootInch.cata({ foot, inch })
})


/**
 * @method split - Split `n` inches into { foot: Number, inch: Number }
 * @param {Number} n
 * @returns {{ foot: Number, inch: Number }}
 */
FootInch.split = n => {
    // Split `n` inches into { foot: Number, inch: Number }
    const foot = Math.floor(n / 12)
    const inch = n % 12
    return {
        foot,
        inch
    }
}


FootInch.join = (foot, inch=0)=> (foot * 12) + inch

FootInch.cata = ({ foot, inch })=> FootInch(1).join(foot, inch)


export const Inch = Length(
    {
        short: 'in',
        long: 'inch'
    },
    false
)

Inch.FootInch = FootInch

