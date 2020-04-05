import * as R from 'ramda'
import { Monad } from 'common/functional_types'
import { Term } from './term'
import { displayNumber, Kg, Lb } from './weight'
import { Cm, FootInch, Inch } from './length'


export const MEASUREMENT_SYSTEMS = {
    imperial: 0,
    metric: 1
}


const isMetric = systemId => MEASUREMENT_SYSTEMS.metric === systemId


const isImperial = systemId => MEASUREMENT_SYSTEMS.imperial === systemId


export const measurementSystemOptions = Object.entries(MEASUREMENT_SYSTEMS)
    .map(([name, id])=> ({
        id,
        name,
        value: id
    }))


export const Length = {
    imperial: Inch,
    metric: Cm,
    Cm,
    FootInch,
    Inch,
    of: systemId =>
        isImperial(systemId)
            ? Inch
            : Cm
}


export const Weight = {
    displayNumber,
    Kg,
    Lb,
    imperial: Lb,
    metric: Kg,
    isMetric,
    isImperial,
    of: systemId =>
        isImperial(systemId)
            ? Lb
            : Kg,
    
    /**
     * @method convert - Assuming you always provide a value in Kg,
     * this will automagically convert to Imperial when `systemId`
     * is the Imperial Measurement System ID
     * @param {Number} systemId
     * @returns{function(Number): Kg<T>|Lb<T>}
     */
    convert: systemId => {
        const method = isImperial(systemId)
            ? 'toImperial'
            : 'toMetric'

        // @ts-ignore
        return value => Kg(value)[method]()
    },

    displayWeight: systemId => weight =>
        Weight.of(systemId)(weight)
            .displayNames()
            .short
}
