const _ref = 'calories'

export const IntakeForm = {
    ref: _ref,
    template:`
        <!--  Calorie/Intake form -->
        <div class="predictors--${_ref}-container">
            <div class="mdc-text-field">
                <input type="number"
                        v-model="calorie_intake"
                        ref="${_ref}"
                        id="predictors--${_ref}"
                        class="mdc-text-field__input">
                <label class="mdc-floating-label" for="predictors--${_ref}">
                    Calories
                </label>
                <div class="mdc-line-ripple"></div>
            </div>
        </div>
    `
}
