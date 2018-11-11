const _ref = 'dayrange'

export const DateForm = {
    ref: _ref,
    template: `
        <!-- Date Slider -->
        <div class="predictors--${_ref}-container">
            <h3>
                Days: {{ dateRange }}
            </h3>
            <div class="mdc-slider mdc-slider--discrete"
                    ref="${_ref}"
                    tabindex="0"
                    role="slider"
                    v-bind:aria-valuenow="dateRange"
                    aria-valuemin="0"
                    aria-valuemax="730"
                    aria-label="Select Value">
                <div class="mdc-slider__track-container">
                    <div class="mdc-slider__track"></div>
                </div>
                <div class="mdc-slider__thumb-container">
                    <div class="mdc-slider__pin">
                        <span class="mdc-slider__pin-value-marker"></span>
                    </div>
                    <svg class="mdc-slider__thumb"
                            width="21"
                            height="21">
                        <circle cx="10.5" cy="10.5" r="7.875"></circle>
                    </svg>
                    <div class="mdc-slider__focus-ring"></div>
                </div>
            </div>
        </div>
    `
}