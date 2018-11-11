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
    ['Sedentary', 1.45],
    ['Low Activity', 1.65],
    ['Moderate Activity', 1.85],
    ['Hardcore Activity', 2.0],
    ['Professional Athlete', 2.4],
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
        <div class="predictors--${_ref}-container">
            <div class="mdc-select">
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