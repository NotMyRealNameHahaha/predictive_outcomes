<template>
    <div class="delta">
        <!--
            DeltaValue is used to represent the change in a value (delta), in a user-friendly format/style
            It is comparable to the "statistic" component by Ant Design
            See here for design inspiration: https://ant.design/components/statistic/
        -->
        <div class="delta-title">
            <slot name="title">
                <div 
                    v-if="title"
                    v-html="title"
                    class="delta-title--text md-subheading"
                ></div>
            </slot>
        </div>
        <div class="delta-body text--mono">
            <slot name="prefix">
                <span v-if="prefix" v-html="prefix" class="delta-prefix"></span>
            </slot>

            <span :class="['delta-value', internalValueClass]">
                <!-- Value Display -->
                <slot name="value">
                    <span class="delta-value--int">
                        {{ intValue }}
                    </span>
                    <span class="delta-value--decimal">
                        {{ decimalValue }}
                    </span>
                </slot>
            </span>

            <slot name="suffix">
                <span v-if="suffix" v-html="suffix" class="delta-suffix"></span>
            </slot>
        </div>
    </div>
</template>

<script>
    import * as R from 'ramda'

    const optionalString = {
        type: String,
        required: false
    }


    const toFixed = len => n => Number(n).toFixed(len)


    const splitNumber = len => R.compose(
        R.split('.'),
        toFixed(len)
    )


    export const DeltaValue = {
        props: {
            value: {
                type: Number,
                required: true
            },
            // # of digits to display after the decimal point
            precision: {
                type: Number,
                default: 2
            },
            title: optionalString,
            prefix: optionalString,
            suffix: optionalString,
            valueClass: optionalString
        },

        computed: {
            internalValueClass() {
                return this.valueClass
                    ? this.valueClass
                    : this.value >= 0
                        ? 'text--primary-light'
                        : 'text--error'
            },

            intValue() {
                const fragments = splitNumber(this.precision)(this.value)
                return R.head(fragments)
            },

            decimalValue() {
                const fragments = splitNumber(this.precision)(this.value)
                return `.${R.last(fragments)}`
            }

        },

        methods: {
            setValues(value) {
                const fragments = splitNumber(this.precision)(value)
                this.intValue = R.head(fragments)
                this.decimalValue = `.${R.last(fragments)}`
            }
        }
    }

    export default DeltaValue
</script>

<style lang="scss">
    $intSize: 1.5rem;
    $decimalSize: $intSize * 0.66;
    $signDisplacement: $decimalSize * 0.5;

    .delta {
        // Outer container
    }

    .delta-title {
        padding-bottom: 0.5rem;
    }

    .delta-body {
        font-size: #{$intSize};
        display: inline-flex;
        align-items: center;
        line-height: 1;
    }

    .delta-value,
    .delta-value--int {
        // Numbers that come before the decimal point
        font-size: #{$intSize};
        line-height: 1;

    }

    .delta-value--decimal,
    .delta-suffix {
        font-size: #{$decimalSize};
        line-height: 1;
    }

    .delta-prefix,
    .delta-suffix {
        display: inline-block;
    }

    .delta-prefix {
        margin-right: #{$signDisplacement};
    }

    .delta-suffix {
        margin-left: #{$signDisplacement};
    }

    .delta-value {
        width: auto;
        height: 100%;
        max-height: 100%;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
    }
</style>