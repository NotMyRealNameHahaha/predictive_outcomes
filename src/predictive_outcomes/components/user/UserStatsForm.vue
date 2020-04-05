<template>
    <div class="stats width--100">

        <!-- User Stats Form Fields-->
        <div class="stats--header md-layout">
            <div class="md-layout-item md-size-100">

                <!-- Measurement System -->
                <MeasurementSystem
                    @update="onUpdate"
                    :value="measurementSystem"
                />
            </div>
            <div class="md-layout-item md-size-100">

                <!-- Sex -->
                <SexChips
                    @update="onUpdate"
                    :value="userStats.isMale"
                />
            </div>
            <div class="md-layout-item md-size-100">

                <!-- Age -->
                <PredictorField title="Age">
                    <template v-slot:default>
                        <md-field md-inline>
                            <label></label>
                            <md-input
                                @update="updateAge"
                                :value="userStats.age"
                                type="number"
                                :min="18"
                                :max="100"
                                required
                            />
                            <span class="md-suffix">
                                years
                            </span>
                        </md-field>
                    </template>
                </PredictorField>
            </div>
            <div class="md-layout-item md-size-100">

                <!-- Height -->
                <Height
                    @update="onUpdate"
                    :measurementSystem="measurementSystem"
                />
            </div>
            <div class="md-layout-item md-size-100">

                <!-- weight -->
                <Weight
                    @update="onUpdate"
                    :measurementSystem="measurementSystem"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import * as R from 'ramda'
    import { debounce, toPojo } from 'common/utils'
    import Height from './Height.vue'
    import MeasurementSystem from './MeasurementSystem.vue'
    import PredictorField from '../shared/PredictorField.vue'
    import SexChips from './SexChips.vue'
    import Weight from './Weight.vue'
    import { diffObj } from '../shared/diff'


    const defaultUserStats = ()=> ({
        height: 180, // cm
        weight: 70,  // kg
        age: 27,     // years
        isMale: true // yeah
    })


    export const UserStatsForm = {
        name: 'user-stats-form',
        components: {
            Height,
            MeasurementSystem,
            PredictorField,
            SexChips,
            Weight
        },

        props: {
            userStats: {
                type: Object,
                default: ()=> {}
            },

            measurementSystem: {}
        },

        methods: {
            onUpdate() {
                this.$emit('update', this.userStats)
            },

            updateAge(age) {
                this.$store.commit('stat/mergeProp', {
                    key: 'userStats',
                    value: {
                        age
                    }
                })
                this.onUpdate()
            }
        }
    }
    export default UserStatsForm

</script>
<style lang="scss">
    @import 'styles/constants';

    $chip-size: 1.5rem;
    $chip-padding: $chip-size * $phi;


    .ms-chip.md-chip,
    .sex-chip.md-chip {
        width: 400px;
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        font-size: #{$chip-size};
        padding-top: $chip-padding;
        padding-bottom: $chip-padding;
        text-align: center;

        .ms-chip--icon,
        .sex-chip--icon {
            font-size: #{$chip-padding};
            line-height: #{$chip-padding};
            margin-right: 0.5rem;
        }
    }
</style>