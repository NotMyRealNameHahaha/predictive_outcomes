<template>
    <PredictorField title="Sex">
        <template v-slot:default>
            <div class="md-layout md-gutter md-alignment-space-between-center width--100">
                <!-- Male -->
                <div class="md-layout-item md-size-50 md-small-size-100 i-flex flex--justify-center flex--align-center">
                    <md-chip
                        @click="onClick(true)"
                        :class="['sex-chip', 'sex-chip--male', value ? activeClass : '']"
                        md-clickable
                    >
                        <i class="sex-chip--icon mdi mdi-gender-male"></i>
                        <span class="sex-chip--text">
                            Male
                        </span>
                    </md-chip>
                </div>

                <!-- Female -->
                <div class="md-layout-item md-size-50 md-small-size-100 i-flex flex--justify-center flex--align-center">
                    <md-chip
                        @click="onClick(false)"
                        :class="['sex-chip', 'sex-chip--female', value ? '' : activeClass]"
                        md-clickable
                    >
                        <i class="sex-chip--icon mdi mdi-gender-female"></i>
                        <span class="sex-chip--text">
                            Female
                        </span>
                    </md-chip>
                </div>
            </div>
        </template>
    </PredictorField>
</template>
<script>
    import * as R from 'ramda'
    import PredictorField from '../shared/PredictorField.vue'


    export default {
        name: 'sex-chips',
        components: {
            PredictorField
        },

        props: {
            // value = isMale ? true : false
            value: {
                type: Boolean,
                default: true
            }
        },

        data() {
            return {
                activeClass: 'sex-chip--active'
            }
        },

        methods: {
            onClick(isMale) {
                if (this.value !== isMale) {
                    this.$store.commit('stat/mergeProp', {
                        key: 'userStats',
                        value: {
                            isMale
                        }
                    })
                    this.$emit('update', !this.value)
                }
            },


        }
    }    
</script>
<style lang="scss">
    @import 'styles/luminance';
    // Blue 700, Pink 700
    // See: https://material.io/design/color/the-color-system.html#tools-for-picking-colors
    $male: #1976D2;
    $female: #C2185B;


    .sex-chip.md-chip {
        &.sex-chip--active {
            &.sex-chip--male {
                @include text-contrast($male);
                background: $male;
            }

            &.sex-chip--female {
                @include text-contrast($female);
                background: $female;
            }
        }
    }
</style>