<template>
    <div class="predictor-slider">
        <div class="width--100 md-layout md-alignment-center-left">
            <div class="predictor-slider--header md-layout-item md-small-size-100 i-flex flex--justify-start flex--align-center">
                <slot
                    :title="title"
                    name="title"
                >
                    <div class="md-title">
                        {{ title }}
                    </div>
                    <div v-if="help" class="predictor-slider--help">
                        <md-button class="md-accent md-icon-button">
                            <md-icon class="mdi mdi-help-circle-outline" />

                            <md-tooltip>
                                <slot name="help"></slot>
                            </md-tooltip>
                        </md-button>
                    </div>
                </slot>
            </div>

            <!-- Form Field -->
            <div class="predictor-slider--sub md-layout-item md-small-size-100 md-size-70">
                <div class="width--100 pad--h-10">
                    <vue-slider
                        v-bind="config"
                        v-model="internalValue"
                    >
                        <template v-slot:tooltip="{ value, focus }">
                            <div :class="['predictor-tooltip', { focus }]">
                                <div class="predictor-tooltip--value">
                                    {{ value }}
                                </div>
                                <div class="predictor-tooltip--suffix text--decrease-20">
                                    {{ suffix }}
                                </div>
                            </div>
                        </template>
                    </vue-slider>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import VueSlider from 'vue-slider-component'
    import PredictorField from './PredictorField.vue'

    const defaultOptions = {
        contained: false,
        tooltip: 'always',
        min: 0
    }


    export const PredictorSlider = {
        name: 'predictor-slider',
        components: {
            PredictorField,
            VueSlider
        },
    
        props: {
            title: {
                type: String,
                default: ''
            },
            suffix: {
                type: String,
                default: ''
            },
            value: {},
            sliderOptions: {
                type: Object,
                default: ()=> ({...defaultOptions})
            },
            help: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            config() {
                return {...defaultOptions, ...this.sliderOptions}
            }
        },

        data() {
            return {
                internalValue: this.value
            }
        },

        watch: {
            internalValue(value) {
                this.$emit('update', value)
            }
        }
    }

    export default PredictorSlider
</script>

<style lang="scss">
    @import '../../_breakpoints.scss';

    $pad: 1rem;

    .predictor-slider--field {
        width: 100%;
    }

    .predictor-slider--inline {
        // margin: auto 1rem auto 0;
    }

    .predictor-slider--field {
        // padding-top: 1rem;
        padding-bottom: $pad;
    }

    .predictor-slider {
        @media (max-width: $md-breakpoint-medium) {
            padding-top: $pad;
            padding-bottom: $pad;
        }

        @media (min-width: $md-breakpoint-medium) {
            padding-left: 1.5rem;
        }

        .predictor-slider--header {
            flex-wrap: nowrap;
        }

        .predictor-slider--help {
            padding-left: $pad;
        }

        .predictor-slider--sub {
            width: 100%;
            display: inline-flex;
            flex-wrap: wrap;
            align-items: center;
            // margin: auto 0.5rem auto auto;
            padding-top: 1.5rem;
        }
        
        .wut {
            width: 100%;
            display: inline-flex;
            align-items: center;
            margin: auto 0 auto auto;
        }

        .md-button {
            margin: auto 0 auto auto;

            .wut--icon.md-icon{
                // F#@& you, vue-material
                font-size: 1.0rem !important;
            }
        }

        .predictor-tooltip {
            width: 10rem;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            text-align: center;

            .predictor-tooltip--value {

            }

            .predictor-tooltip--suffix {
                font-weight: 500;
                padding-left: calc(#{$pad} / 1.619);
            }
        }
    }
</style>