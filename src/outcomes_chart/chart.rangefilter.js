const moment = require('moment');


const deltaDays = (start, end)=> Math.abs(
    moment(start).diff(moment(end), 'days')
)


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
        {min: 0, max: 90},
        {increment: 1, name: 'days'}
    ],
    // Weeks
    [
        {min: 30, max: (365 / 2)},
        {increment: 7, name: 'days'}
    ],
    // Fortnights
    [
        {min: (365 / 2), max: 365},
        {increment: 14, name: 'days'}
    ],
    // Months
    [
        {min: 365, max: 730},
        {increment: 1, name: 'months'}
    ],
    // Quarters
    [
        {min: 730, max: 3650},
        {increment: 3, name: 'months'}
    ],
    // Years
    [
        {min: 3650, max: (365 * 50)},
        {increment: 1, name: 'years'}
    ]
]


export class RangeFilter {
    constructor(dateRange, minNodes=0, maxNodes=50) {
        this.dateRange = dateRange
        this.minNodes = minNodes
        this.maxNodes = maxNodes
        this.incrementMap = new Map(incrementArr)
    }

    getIncrement() {
        let incrementInstance = null
        const maxVal = this.dateRange.diff

        // Search the incrementMap,
        // return the pair of objects that will
        // ultimately help us retrieve the right indexes
        // from our Array of RangeNodes
        for (let i of this.incrementMap.entries()) {
            const minMax = i[0]
            if (minMax.min <= maxVal && minMax.max >= maxVal) {
                incrementInstance = i
            }
        }

        return incrementInstance
    }

    _getNextIncrement(currentIndex, momentParams) {
        /** Get the MOMENT associated w/ the next increment
         *  @param currentIndex {Number}: Ie. start_date + currentIndex = date
         *  @param momentParams {Object}: {increment: Number, name: String}
         *  @returns {moment}
         */
        // Get the date associated with the CURRENT index
        const momentDay = moment().add(currentIndex, 'days')
        // Find the next date based on `increment` and `name`
        return momentDay.add(
            momentParams.increment,
            momentParams.name
        ).toDate()
    }

    getIndexes() {
        const incrementInstance = this.getIncrement()
        const momentParams = incrementInstance[1]

        let nextIncrement = null
        let indexAccum = [0]

        for (let i = 0; i < this.dateRange.diff; i++) {
            const indexDate = moment().add(i, 'days').toDate()
            const validIncrement = (
                nextIncrement !== null
                && moment(indexDate).isSame(nextIncrement)
            )

            if (validIncrement) {
                console.log(`validIncrement: ${i}`)
                indexAccum.push(i)
                nextIncrement = this._getNextIncrement(i, momentParams)
            } else if (moment(nextIncrement).isBefore(indexDate)
                || nextIncrement === null) {
                nextIncrement = this._getNextIncrement(i, momentParams)
            }
        }

        return indexAccum
    }
}


