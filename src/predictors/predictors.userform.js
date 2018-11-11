
export const UserForm = {
    
    template: `
        <div class="predictors--user-stats-container">

            <!-- Height -->
            <div class="input-group">
                <h4 class="mdc-typography--headline4">
                    Height
                </h4>
                <div class="mdc-text-field">
                    <input type="text"
                            v-model="height.feet"
                            ref="height.feet"
                            id="predictors--height-feet"
                            class="mdc-text-field__input">
                    <label class="mdc-floating-label" for="predictors--height-feet">
                        Feet
                    </label>
                    <div class="mdc-line-ripple"></div>
                </div>


                <!-- Height (inches) -->
                <div class="mdc-text-field">
                    <input type="text"
                            v-model="height.inches"
                            ref="height.inches"
                            id="predictors--height-inches"
                            class="mdc-text-field__input">
                    <label class="mdc-floating-label"
                            for="predictors--height-inches">
                        Inches
                    </label>
                    <div class="mdc-line-ripple"></div>
                </div>
            </div>

            <!-- Weight -->
            <div class="input-group">
                <div class="mdc-text-field">
                    <input type="text"
                            v-model="userStats.weight"
                            ref="weight"
                            id="predictors--weight"
                            class="mdc-text-field__input">
                    <label class="mdc-floating-label"
                            for="predictors--weight">
                        Weight (lbs.)
                    </label>
                    <div class="mdc-line-ripple"></div>
                </div>
            </div>

            <!-- Age -->
            <div class="input-group">
                <div class="mdc-text-field">
                    <input type="text"
                            v-model="userStats.age"
                            ref="age"
                            id="predictors--age"
                            class="mdc-text-field__input">
                    <label class="mdc-floating-label"
                            for="predictors--age">
                        Age (years)
                    </label>
                    <div class="mdc-line-ripple"></div>
                </div>
            </div>

            <!-- Sex -->
            <div class="input-group">
                <h4 class="mdc-typography--headline4">
                    Sex
                </h4>
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
        </div>
    `
}