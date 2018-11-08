import * as R from 'ramda';
import * as Calc from './calculations.js';
import { merge } from '../../common/utils.js'
import { Meal, FoodMap, IngredientSerializer } from '../../nutrition/serializers.js';


const zeroIfNull = (x)=> R.isNil(x) || isNaN(x) ? 0 : x

class MacroAdapter {
    constructor(cls) {
        this.cls = cls
    }

    getData() {
        return Calc.MacroObject(this.cls.getMacros())
    }
}

const macroData = (cls)=> ()=> new MacroAdapter(cls).getData()


const _sumMacro = (name, arr)=> R.sum(arr.map(R.compose(
    zeroIfNull, R.prop(name)
)))


export const sumMacroArr = (arr)=> Calc.macroNames.reduce((obj, item)=> {
    obj[String(item)] = _sumMacro(item, arr)
    return obj
}, {})


export class IntakeIngredient extends IngredientSerializer {
    constructor(data, meal_id, map_id){
        super(data, meal_id, map_id)
        this.food_groups = data.food_groups || []

        this.getBreakdown = macroData(this)
    }

    toDict() {
        return merge(super.toDict(), {
            food_groups: this.food_groups
        })
    }

    getMacros() {
        return this.macros
    }
}


export class IntakeMap extends FoodMap {
    constructor(data, meal_id, childSerializer=IntakeIngredient) {
        super(data, meal_id, childSerializer)
        this.getBreakdown = macroData(this)
    }

    getMacros() {
        return this.display_macros
    }
}


export class IntakeMeal extends Meal {
    constructor(data, childSerializer=IntakeMap){
        super(data, childSerializer)
        this.getBreakdown = macroData(this)
    }

    getFoodMaps() {
        const scope = this
        return this.food_maps
    }

    getMacros() {
        const macroArr = this.getFoodMaps().map((x)=> x.calculated_macros)
        return sumMacroArr(macroArr)
    }
}


export class DailyIntake {
    constructor(data, childSerializer=IntakeMeal) {
        const scope = this
        this.intake_id = data.intake_id
        this.childSerializer = childSerializer
        this.meals = data.meals
        this.getBreakdown = macroData(this)
    }

    getMeals() {
        const scope = this
        return scope.meals.map((x)=> new scope.childSerializer(x))
    }

    getMacros() {
        const macroArr = this.getMeals().map( (x)=> x.getMacros())
        return sumMacroArr(macroArr)
    }
}
