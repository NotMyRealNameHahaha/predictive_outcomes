import * as moment from 'moment'
import { or, and, prop, repeat } from 'ramda'


const meow = moment().toDate()


const deltaDays = (start, end)=> Math.abs(
    moment(start).diff(moment(end), 'days')
)


/**
 * @func dateRangeList - Generate a list of dates, each increasing by one `increment`, starting at `startDate`
 * @param {{ startDate: Date, increment: String, duration: Number }} startDate
 * @returns {Date[]}
 */
export const dateRangeList = ({ startDate=meow, increment='day', duration=30 }) =>
    repeat(1, duration)
        .reduce(
            ({ current, accum })=> {
                const thisDate = moment(current).add(1, increment).toDate()
                return {
                    accum: accum.concat(thisDate),
                    current: thisDate
                }
            },
            {
                current: startDate,
                accum: []
            }
        ).accum


/*  RangeNode Filters
*===========================*/
export class DateRange {
    constructor(start_date, end_date) {
        this.start_date = start_date
        this.end_date = end_date
        this.diff = deltaDays(start_date, end_date)
    }
}


const incrementArr = [
    // Days
    [
        {max: 0, len: 1},
        {increment: 1, name: 'days'}
    ],
    // Weeks
    [
        {max: 30, len: 7},
        {increment: 7, name: 'days'}
    ],
    // Fortnights
    [
        {max: (365 / 2), len: 14},
        {increment: 14, name: 'days'}
    ],
    // Months
    [
        {max: 365, len: 30},
        {increment: 1, name: 'months'}
    ],
    // Quarters
    [
        {max: 730, len: 90},
        {increment: 3, name: 'months'}
    ],
    // Years
    [
        {max: 3650, len: 365},
        {increment: 1, name: 'years'}
    ]
]


const maxLength = 30

export class RangeFilter {
    constructor(dateRange, lens=prop('date')) {
        this.dateRange = dateRange
        this.lens = lens
        this.incrementMap = new Map(incrementArr)
    }

    getIncrement() {
        const maxVal = this.dateRange.diff

        // Search the incrementMap,
        // return the pair of objects that will
        // ultimately help us retrieve the right indexes
        // from our Array of RangeNodes
        for (let i of this.incrementMap.entries()) {
            const minMax = i[0]
            if (maxVal <= minMax.max
                || (maxVal / minMax.len) < maxLength) {
                // incrementInstance = i
                return i
            }
        }

        // Otherwise, just return the first item in our map
        for (let x of this.incrementMap.entries()) {
            return x
        }
    }

    _getNextIncrement(indexDate, momentParams) {
        /** Get the MOMENT associated w/ the next increment
         *  @param indexDate {Date}: Ie. start_date + currentIndex
         *  @param momentParams {Object}: {increment: Number, name: String}
         *  @returns {moment}
         */
        return moment(indexDate).add(
            momentParams.increment,
            momentParams.name
        ).toDate()
    }

    getIndexes() {
        /**
         * @returns { Array[Number] }
         */
        const incrementInstance = this.getIncrement()
        const momentParams = incrementInstance[1]
        const startDate = this.dateRange.start_date
        const endDate = this.dateRange.end_date

        let nextIncrement = null
        let indexAccum = [0]

        for (let i = 0; i < this.dateRange.diff; i++) {
            const indexDate = moment(startDate).add(i, 'days').toDate()

            const validIncrement = or(
                and(
                    nextIncrement !== null,
                    moment(indexDate).isSame(nextIncrement)
                ),
                moment(indexDate).isSame(endDate)
            )

            if (validIncrement) {
                // If the date lines up with the next date increment,
                // add this index to our indexAccum Array
                // and get the next valid date
                indexAccum.push(i)
                nextIncrement = this._getNextIncrement(indexDate, momentParams)

            } else if (
                moment(nextIncrement).isBefore(indexDate)
                || nextIncrement === null) {
                // Set the initial increment if needed,
                // && handle edge-cases where we missed the increment
                nextIncrement = this._getNextIncrement(indexDate, momentParams)
            }
        }

        return indexAccum
    }
}


