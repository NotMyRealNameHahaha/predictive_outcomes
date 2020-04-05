<template>
    <div
        :class="[
            'predictors-component predictors-component--group flex flex--align-start flex--justify-start pad--v-20 pad--h-10',
            inlineClass
        ]"
    >
        <div class="predictors-component--header">
            <div class="predictors-component--title md-title">
                <slot
                    :title="title"
                    name="title"
                >
                    <span class="md-title">
                        {{ title }}
                    </span>
                </slot>
            </div>

            <!-- Sub-heading describes what this field does or means -->
            <div class="predictors-component--sub md-subheading">
                <slot
                    :sub="sub"
                    :data="$data"
                    name="sub"
                >
                    <span
                        v-if="sub"
                        v-html="sub"
                        class="md-caption"
                    >
                    </span>
                </slot>
            </div>
        </div>

        <!-- Field/Form input slot -->
        <div class="predictors-component--field">
            <transition name="slide-slow" appear>
                <div class="predictors-component--field-container">
                    <slot name="default"/>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'predictor-field',
        props: {
            title: {
                type: String,
                default: ''
            },
            sub: {},
            // field value
            value: {},
            inline: {
                type: Boolean,
                default: false
            }
        },

        computed: {
            inlineClass() {
                return this.inline
                    ? 'predictors-component--inline'
                    : 'predictors-component--block'
            }
        },

        data() {
            return {
                internalValue: this.value
            }
        },

        watch: {
            value(value, oldValue) {
                if (this.internalValue !== value) {
                    this.internalValue = value
                }
            }
        },

        methods: {
            onUpdate(value) {
                if (this.internalValue !== value) {
                    this.$emit('update', value)
                }
            }
        }
    }
</script>
<style lang="scss">
    @mixin fullWidth() {
        width: 100%;
    }

    .predictors-component {
        width: 100%;
        display: inline-flex;
        justify-content: flex-start;
        align-content: center;
    }

    .predictors-component--field {
        @include fullWidth;
        padding: 0 1rem 1rem 1rem;

    }

    .predictors-component--inline {
        margin: auto 1rem auto 0;
        flex-wrap: nowrap;
    
        .predictors-component--title,
        .predictors-component--field {
            margin: auto 1rem auto 0;
        }

        .predictors-component--header {
            margin: auto;
            display: inline-flex;
            justify-content: flex-start;
            align-content: flex-start;
            flex-wrap: wrap;
        }

        .predictors-component--field-container {
            width: 20rem;
            max-width: 100%;
        }
    }

    .predictors-component--block {
        @include fullWidth;
        flex-wrap: wrap;

        .predictors-component--header
        .predictors-component--title,
        .predictors-component--field {
            @include fullWidth;
        }
    }
</style>