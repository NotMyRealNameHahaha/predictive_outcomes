
export const UserForm = {
    
    template: `

        <!-- Sex -->
        <div class="input-group mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
            <!-- Male -->
            <div class="mdc-form-field">
                <div class="mdc-radio">
                    <input class="mdc-radio__native-control"
                            v-model="sex"
                            value="male"
                            type="radio"
                            id="sex--male" checked>
                    <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                    </div>
                </div>
                <label for="sex--male">
                    Male
                </label>
            </div>
        
            <!-- Female -->
            <div class="mdc-form-field">
                <div class="mdc-radio">
                    <input class="mdc-radio__native-control"
                            v-model="sex"
                            value="female"
                            type="radio"
                            id="sex--female">
                    <div class="mdc-radio__background">
                        <div class="mdc-radio__outer-circle"></div>
                        <div class="mdc-radio__inner-circle"></div>
                    </div>
                </div>
                <label for="sex--female">
                    Female
                </label>
            </div>
        </div>
    

        <!-- Height -->
        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12 mdc-layout-grid__cell--align-left">
            <div class="mdc-text-field mdc-text-field--with-leading-icon">
                <i class="material-icons mdc-text-field__icon">directions_walk</i>
                <input type="number"
                        v-model="height.feet"
                        ref="height.feet"
                        id="predictors--height-feet"
                        class="mdc-text-field__input"
                        min="0"
                        max="100">
                <label class="mdc-floating-label" for="predictors--height-feet">
                    Feet
                </label>
                <div class="mdc-line-ripple"></div>
            </div>


            <!-- Height (inches) -->
            <div class="mdc-text-field mdc-text-field--with-leading-icon">
                <i class="mdc-text-field__icon mdi-24px mdi mdi-ruler"></i>
                <input type="number"
                        v-model="height.inches"
                        ref="height.inches"
                        id="predictors--height-inches"
                        class="mdc-text-field__input"
                        min="0"
                        max="12">
                <label class="mdc-floating-label"
                        for="predictors--height-inches">
                    Inches
                </label>
                <div class="mdc-line-ripple"></div>
            </div>

        </div>

        <!-- Weight -->
        <div class="input-group mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
            <div class="mdc-text-field mdc-text-field--with-leading-icon">
                <i class="mdc-text-field__icon mdi-24px mdi mdi-scale-bathroom"></i>
                <input type="number"
                        v-model="userStats.weight"
                        ref="weight"
                        id="predictors--weight"
                        class="mdc-text-field__input"
                        min="0"
                        max="2000">
                <label class="mdc-floating-label"
                        for="predictors--weight">
                    Weight (lbs.)
                </label>
                <div class="mdc-line-ripple"></div>
            </div>
        </div>

        <!-- Age -->
        <div class="input-group mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
            <div class="mdc-text-field mdc-text-field--with-leading-icon">
                <i class="mdc-text-field__icon mdi-24px mdi mdi-timetable"></i>
                <input type="number"
                        v-model="userStats.age"
                        ref="age"
                        id="predictors--age"
                        class="mdc-text-field__input"
                        min="0"
                        max="200">
                <label class="mdc-floating-label"
                        for="predictors--age">
                    Age (years)
                </label>
                <div class="mdc-line-ripple"></div>
            </div>
        </div>    
    `
}