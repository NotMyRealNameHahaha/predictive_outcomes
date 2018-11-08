/* Provide the means to calculate Basal Metabolic Rate,
*    and Total Energy Expenditure
*  Calculations are based on the Mifflin St. Jeor equation
*
*  Note: Values are based on the Metric system (kg, cm, grams, etc).
*/

const R = require('ramda');


// @Function sexModifier ( is_male {Boolean})=> {Function (n {Number})=> {Number} }
const sexModifier = R.ifElse(
    Boolean,
    R.add(5),
    R.subtract(161)
)


/** Basal Metabolic Rate 
 * @class 
 * @param {Number} bw: Weight in kilos
 * @param {Number} height: Height in CM
 * @param {Number} age: Age in years
 * @param {Boolean} is_male: true === male, false === female
 */
export class Bmr {
    constructor(bw, height, age, is_male=true) {
        this.weight = bw
        this.height = height
        this.age = age
        this.is_male = is_male
    }

    get modifier() {
        return sexModifier(this.is_male)
    }

    getData() {
        const weightModifier = 10 * this.weight
        const heightModifier = 6.25 * this.height
        const ageModifier = 5 * this.age
        const baseBmr = R.sum([
            weightModifier,
            heightModifier,
            ageModifier
        ])
        return this.modifier(baseBmr)
    }
}

const weightDiffPounds = (intake, expenditure)=> (intake - expenditure) / 3500

const toKilos = R.divide(R.__, 2.2)


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
    constructor(bw, height, age, is_male=true, pal=1.53) {
        super(bw, height, age, is_male)
        this.pal = pal
    }

    get modifier() {
        return R.pipe(R.add(super.modifier), R.multiply(this.pal))
    }

    flatMap(intake_arr) {
        /**
         *  Generate an Array of TotalExpenditure instances
         *  based on an Array of calories
         *  Eg. Determine how a person's weight will change over time
         *     based on calories burned & calories consumed
         *  @param intake_arr {Array [Number]}: Calories consumed for a given period
         *  @returns {Array [TotalExpenditure]}
         */
        const _this = this
        let lastNode = null
        
        return intake_arr.map((calories)=> {
            let target = R.isNil(lastNode) ? _this : lastNode
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
            this.is_male,
            this.pal
        )
    }
}

