<template>
    <PredictorField title="Weight">
        <template v-slot:default>
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
                    {{ suffix }}
                </span>
            </md-field>
        </template>
    </PredictorField>
</template>
<script>
    import * as R from 'ramda'
    import PredictorField from '../shared/PredictorField.vue'
    import { MEASUREMENT_SYSTEMS, Weight } from '../../measurement/measurement_system'
    import { debounce } from 'common/utils'


    export default {
        name: 'Weight',
        components: {
            PredictorField
        },

        props: {
            measurementSystem: {
                type: Number,
                default: MEASUREMENT_SYSTEMS.imperial
            }
        },

        data() {
            return {
                internalValue: 10
            }
        },

        computed: {
            isImperial() {
                return MEASUREMENT_SYSTEMS.imperial === this.measurementSystem
            },

            suffix() {
                return this.isImperial
                    ? 'Lb'
                    : 'Kg'
            }
        },

        watch: {
            internalValue(internalValue) {
                // We only store KG, so convert if needed
                // & emit the 'update' event
                const kg = !this.isImperial
                    ? Number(internalValue)
                    : Weight.of(this.measurementSystem)( Number(internalValue) ).toMetric().value()
                this.$store.commit('stat/mergeProp', {
                    key: 'userStats',
                    value: {
                        weight: kg
                    }
                })
                this.$emit('update', { weight: kg })
            }
        },

        mounted() {
            this.internalValue = 100
        }
    }
</script>
<style lang="scss">
</style>