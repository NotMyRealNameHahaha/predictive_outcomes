
import * as moment from 'moment'
import * as R from 'ramda'
import { TotalExpenditure } from '../measurement/bmr'



const deltaDays = (start, end)=> Math.abs(
    moment(start).diff(moment(end), 'days')
)

const relativeDate = (start_date)=> (index)=> (
    moment(start_date).add(index, 'days').toDate()
)

const userStatsProp = R.prop('stats')

const dateRangeProp = R.prop('dateRange')


const endDate = R.compose(R.prop('end'), dateRangeProp)


const startDate = R.compose(R.prop('start'), dateRangeProp)


const isNumber = R.allPass([
    R.is(Number),
    R.complement(isNaN),
    R.complement(R.isNil)
])


const repeatN = (fn, n)=> {
    if (!isNumber(n)) {
        throw new TypeError(`
            repeatN expected 'n' to be a Number. 
            Received type ${typeof(n)} instead.
            The value of "n": ${n}
        `)
    }
    let accum = []
    let i = 0
    while (i < n) {
        accum.push(fn())
        i++
    }
    return accum
}



/**
 * @class RangeNode: A functor that facilitates rangeScope (see below)
 * @param intake {Number}: Calorie intake
 * @param expenditure {Number}: Calorie expenditure
 * @param date {Date}: Date this instance is associated w/
 * @param userStats {Object}
 */
export class RangeNode {
    constructor(intake, expenditure, date, userStats) {
        this.intake = intake
        this.expenditure = expenditure
        this.date = date
        this.userStats = userStats
        this.data = userStats
    }

    static map(obj) {
        return new RangeNode(
            obj.intake,
            obj.expenditure,
            obj.date,
            obj.userStats
        )
    }
}


export const getRangeScope = (scope)=> {
    try {
        const calorie_intake = scope.calorie_intake
        const start_date = startDate(scope)
        const end_date = endDate(scope)
        const statsProp = userStatsProp(scope)

        if (!statsProp) {
            // If we don't have user stats, then
            // we can't produce results.
            // Once the child components push their
            // state up the chain, we will have user stats
            return []
        }

        const startExpenditure = new TotalExpenditure(
            statsProp.weight,
            statsProp.height,
            statsProp.age,
            statsProp.isMale,
            statsProp.pal
        )

        const calorieArr = repeatN(
            ()=> calorie_intake,
            deltaDays(start_date, end_date)
        )
        // Cache the start_date moment
        const rangeDate = relativeDate(start_date)

        return startExpenditure.flatMap(calorieArr)
            .map((item, index)=> ({
                    intake: calorieArr[index],
                    expenditure: item.getData(),
                    date: rangeDate(index),
                    userStats: item
            }))
            
    } catch(err) {
        console.warn(err)
        throw(err)
    }
}

