/** Provide the means to calculate Basal Metabolic Rate,
 *    and Total Energy Expenditure
 *  Calculations are based on the Mifflin St. Jeor equation
 *
 * @exports Bmr {class}: Basal Metabolic Rate calculator
 * @exports TotalExpenditure {class}: Extends Bmr by
 *   facilitating Physical Activity Level (pal)
 * @exports weightDiffKilos {Function}: How many KG would an individual lose
 *   if they consumed `x` calories and burned `y` calories?
 */
// import * as R from 'ramda';
import { __, add, divide, multiply, subtract, sum, ifElse, pipe, isNil } from 'ramda';


// @Function sexModifier ( isMale {Boolean})=> {Function (n {Number})=> {Number} }
const sexModifier = ifElse(
    Boolean,
    add(5),
    subtract(161)
)


/** Basal Metabolic Rate 
 * @class 
 * @param {Number} bw: Weight in (lbs or kilos)
 * @param {Number} height: Height in CM
 * @param {Number} age: Age in years
 * @param {Boolean} isMale: true === male, false === female
 * @param {Boolean} weight_metric: If false, bw will be converted to kilos during computation
 */
export class Bmr {
    constructor(bw, height, age, isMale=true, weight_metric=false) {
        this.weight = bw
        this.height = height
        this.age = age
        this.isMale = isMale
        this.weight_pred = weight_metric ? 1 : 2.2
    }

    get modifier() {
        return sexModifier(this.isMale)
    }

    getData() {
        const weightModifier = 10 * (this.weight / this.weight_pred)
        const heightModifier = 6.25 * this.height
        const ageModifier = 5 * this.age
        const baseBmr = sum([
            weightModifier,
            heightModifier,
            ageModifier
        ])
        return this.modifier(baseBmr)
    }
}

const weightDiffPounds = (intake, expenditure)=> (intake - expenditure) / 3500

const toKilos = divide(__, 2.2)


/**
 * 
 * @param intake {Number}: Calories consumed
 * @param expenditure {Number}: Calories burned
 * @returns delta kilos {Number}
 */
export const weightDiffKilos = (intake, expenditure)=> toKilos(
    weightDiffPounds(intake, expenditure)
)


/** @extends Bmr
 * @inheritdoc
 * @param pal {Number}: Physical Activity Level
 *  Ref: https://en.wikipedia.org/wiki/Harris-Benedict_equation#Step_2_-_Determine_Total_Intake
 */
export class TotalExpenditure extends Bmr {
    constructor(bw, height, age, isMale=true, pal=1.53) {
        super(bw, height, age, isMale)
        this.pal = pal
    }

    get modifier() {
        return pipe(add(super.modifier), multiply(this.pal))
    }

    /**
     *  Generate an Array of TotalExpenditure instances
     *  based on an Array of calories
     *  Eg. Determine how a person's weight will change over time
     *     based on calories burned & calories consumed
     *  @param intake_arr {Number[]}: Calories consumed for a given period
     *  @returns {TotalExpenditure[]}
     */
    flatMap(intake_arr) {

        const _this = this
        let lastNode = null
        
        return intake_arr.map((calories)=> {
            let target = isNil(lastNode) ? _this : lastNode
            const weightDiff = weightDiffKilos(
                calories,
                target.getData()
            )

            const copy = target.copy(target.weight + weightDiff)
            lastNode = copy
            return copy
        })
    }

    copy(weight) {
        /* Generate a copy of this instance, but with a new weight
        */
        return new TotalExpenditure(
            weight,
            this.height,
            this.age,
            this.isMale,
            this.pal
        )
    }
}

