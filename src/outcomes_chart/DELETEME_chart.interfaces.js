const moment = require('moment');
const R = require('ramda');
import { Bmr, TotalExpenditure } from '../common/bmr';

export class Intake {
    constructor(calories, index=0) {
        this.calories = calories
        this.index = index
    }

    toObject() {
        return {
            calories: this.calories,
            index: this.index
        }
    }
}


export class Expenditure {
    constructor(bw, height, age, is_male=true, pal=1.53) {
        this.data = new TotalExpenditure(bw, height, age, is_male, pal)
    }

    toObject() {
        return {
            weight: this.data.weight,
            height: this.data.height,
            age: this.data.age,
            is_male: this.data.is_male,
            pal: this.data.pal
        }
    }

    map(fn) {
        // Pass the total energy expenditure for the day into 'fn'
        return fn(this.data.getData())
    }

    copy(weight) {
        /* Generate a copy of this instance, but with a new weight
        */
        return new Expenditure(weight, this.height, this.age, this.is_male, this.pal)
    }
}


/** @class DateNode
 * @property {Number} weight: BW in kilos
 * @property {Date} date: The first date in this series
 * @property {Number} index: Index of this node in the series
 */
export class DateNode {
    constructor(weight, start_date=moment().toDate(), index=0) {
        this.weight = weight
        this.index = index
        this.date = moment(start_date).add(this.index, 'days')
    }

    seriesNode(meta=false) {
        /** @method seriesNode
         * @param meta {Boolean}: Any meta data to add to the series object
         * @returns {Object}
         */
        return {
            x: this.date,
            y: this.weight,
            meta: meta || {}
        }
    }

    map(intake, expenditure, date) {
        
    }
}







const toKg = R.divide(R.__, 2.2)


export class DateSeries {
    constructor(start_date, end_date) {
        this.start_date = start_date
        this.end_date = end_date
        this.diff = moment(end_date).diff(start_date, 'days')
        this._series = []
    }

    mapNode(index, )

    mapWeek(intake, first_expenditure, index) {
        /**
         * @param intake {Intake}: Intake instance used for this week
         * @param first_expenditure {Expenditure}: Expenditure instance
         *     for the first day of this week
         * @param index {Number}: The index for the first day of this week
         *    Ie. If this is the second week in the series, index would be 13
         * @returns {Array}
         */
        const range = R.range(index, (index + 7))
        
        
        const data = range.reduce((accum, day_index, range_index)=> {
            
        }, {})
        
    }

    mapSeries(series_arr) {


    }

    validate() {
        return R.and(
            moment(this.min).isBefore(this.max),
            moment(this.max).isBefore(moment().toDate())
        )
    }

    mapNode_(index, accum, scope) {
        const lastNode = accum[index - 1]
        const intake = scope.intake
        const expenditure = harrisBenedict(lastNode, scope)
        
        const diff = toKg(
            (intake - expenditure) / 3500
        )

        const nodeDate = moment(this.dateRange.min)
            .add(index, 'days')
            .toDate()

        return {
            weight: lastNode.weight + diff,
            expenditure: expenditure,
            date: nodeDate,
            diff: diff
        }
    }

    toSeries() {
        const mapPred = this.mapNode_
        const dateList = this.dateRange.map(mapPred)
        const min = this.dateRange.min

        return dateList.map((x, index)=> (
            new DateNode(min, index, x.date).seriesNode(x)
        ))
    }

    static factory(min, max, scope) {
        const _dateRange = new DateRange(min, max, scope)
        const series = new DateSeries(_dateRange)
        return series.toSeries()
    }
}
