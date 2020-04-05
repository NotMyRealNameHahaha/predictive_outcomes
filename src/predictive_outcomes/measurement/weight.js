import * as R from 'ramda'
import { Term } from './term'


export const RATIO = 2.20462


const fixed = n => parseFloat(n.toFixed(2))


export const toMetric = R.compose(fixed, lb => lb / RATIO)


export const toImperial = R.compose(fixed, kg => kg * RATIO)


const formatter = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 3 })


export const displayNumber = n => Number(formatter.format(n))


export const Weight = (nameObj, isMetric=false) => {
    const nameFn = n => {
        const displayN = displayNumber(n)
        const toTerm = t => Term(t)[displayN === 1 ? 'toPlural' : 'toSingular']()
        return {
            short: ()=> toTerm(`${displayN} ${nameObj.short}`),
            long: ()=> toTerm(`${displayN} ${nameObj.long}`)
        }
    }
    const recursive = n => Weight(nameObj, isMetric)(n)

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

        flip: ()=>
            isMetric
                ? Lb(n).map(toImperial)
                : Kg(n).map(toMetric),

        displayNames: ()=> ({
            short: nameFn(n).short(),
            long: nameFn(n).long()
        }),
        
        eq: weight => recursive(n).toMetric().value() === weight.toMetric().value(),

        of: x => recursive(x),
        args: ()=> ({ nameObj, isMetric }),
        value: ()=> n,
        map: fn => recursive(fn(n)),
        chain: fn => fn(n),

        toString: ()=> recursive(n).displayNames().long
    })
}



export const Kg = Weight(
    {
        short: 'kg',
        long: 'kilogram'
    },
    true
)


export const Lb = Weight(
    {
        short: 'lb',
        long: 'pound'
    },
    false
)
