const _ref = 'pal'


export class ActivityLevel {
    constructor(pal, description='') {
        this.pal = pal
        this.description = description

        console.log(pal)
    }

    getEnergyExpenditure(bmr) {
        /** Get a person's total energy expenditure for a day
         *   when given their PAL & BMR
         * 
         *  NOTE:
         *    Tee = Total Energy expenditure (for a 24-hr period)
         *    BMR = Basal Metabolic Rate
         *  PAL = Tee / BMR
         *  @param bmr {Number}: The user's BMR
         *  @returns {Number}
         */
        return this.pal * bmr
    }
}


const palOptions = [
    ['Zero Activity', 1.20],
    ['Sedentary (little or no exercise)', 1.45],
    ['Low Activity (~3 1 hr. wrokouts/week)', 1.65],
    ['Moderate Activity (~5 1 hr. workouts/week)', 1.85],
    ['Hardcore Activity (heavy labor or 7-9 1 hr. workouts/week)', 2.0],
    ['Professional Athlete (12-14 1 hr. workouts week)', 2.4],
    ['Active Military Deployment', 4.6]
]

const optionStr = palOptions.map(
    (p)=> new ActivityLevel(p[1], p[0])
).map(
    (cls)=> `<option value="${cls.pal}">${cls.description}</option>`
).join('')


export const PhysicalActivityForm = {
    options: palOptions,
    ActivityLevel: ActivityLevel,
    ref: _ref,
    template: `
        <!-- Physical Activity Level -->
        <div class="predictors--${_ref}-container mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
           <div class="mdc-select mdc-select--with-leading-icon">
                <i class="material-icons mdc-select__icon"> fitness_center </i>
                <i class="mdc-select__dropdown-icon"></i>
                <select class="mdc-select__native-control"
                        v-model="userStats.pal"
                        ref="${_ref}">
                
                    ${optionStr}
                </select>
                <label class="mdc-floating-label">
                    Physical Activity Level
                </label>
                <div class="mdc-line-ripple"></div>
            </div>

        </div>
    `
}