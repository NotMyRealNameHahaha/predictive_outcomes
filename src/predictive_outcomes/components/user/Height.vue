<template>
    <PredictorField title="Height">
        <template v-slot:default>

            <!-- Imperial -->
            <div v-if="isImperial" class="width--100 i-flex">
                <div class="width--40 pad--h-20">
                    <md-field md-inline>
                        <label></label>
                        <md-input   
                            v-model="imperialValue.foot"
                            type="number"
                            :min="3"
                            :max="10"
                            required
                        />
                        <span class="md-suffix">
                            feet
                        </span>
                    </md-field>  
                </div> 
                <div class="width--40 pad--h-20">
                    <md-field md-inline>
                        <label></label>
                        <md-input   
                            v-model="imperialValue.inch"
                            type="number"
                            :min="0"
                            :max="11"
                            required
                        />
                        <span class="md-suffix">
                            in
                        </span>
                    </md-field>
                </div>
            </div>

            <!-- Metric -->
            <div v-if="!isImperial">
                <md-field md-inline>
                    <label></label>
                    <md-input   
                        v-model="internalValue"
                        type="number"
                        :min="0"
                        :max="500"
                        required
                    />
                    <span class="md-suffix">
                        cm
                    </span>
                </md-field>
            </div>
        </template>
    </PredictorField>

</template>
<script>
    import * as R from 'ramda'
    import PredictorField from '../shared/PredictorField.vue'
    import { MEASUREMENT_SYSTEMS, Length } from '../../measurement/measurement_system'
    const { Inch, Cm } = Length
    const { FootInch } = Inch


    export default {
        name: 'Height',
        components: {
            PredictorField
        },

        props: {
            // height in centimeters
            value: {
                type: Number,
                default: 175
            },

            measurementSystem: {
                type: Number,
                default: MEASUREMENT_SYSTEMS.imperial
            }
        },

        data() {
            return {
                internalValue: this.value,
                imperialValue: {
                    foot: 5,
                    inch: 4
                }
            }
        },

        computed: {
            isImperial() {
                return MEASUREMENT_SYSTEMS.imperial === this.measurementSystem
            }
        },

        watch: {
            imperialValue: {
                deep: true,
                handler({ foot, inch }) {
                    const totalInches = FootInch(null).join(Number(foot), Number(inch))
                    const cm = Inch(totalInches).toMetric().value()
                    this.internalValue = cm
                }
            },

            internalValue(value) {
                const cm = Number(value)
                this.$store.commit('stat/mergeProp', {
                    key: 'userStats',
                    value: {
                        height: cm
                    }
                })
                this.$emit('update', cm)
            },

            // measurementSystem(newValue, oldValue) {
            //     if (newValue === oldValue) {
            //         return newValue
            //     }
            //     if (this.isImperial) {
            //         const { foot, inch } = FootInch( Cm(this.internalValue).toImperial() ).split()
            //         this.imperialValue = {
            //             ...this.imperialValue,
            //             foot,
            //             inch
            //         }
            //     }
            // }
        },

        mounted() {
            this.internalValue = this.$store.state.stat.userStats.height
        }
    }    
</script>
<style lang="scss">
</style>