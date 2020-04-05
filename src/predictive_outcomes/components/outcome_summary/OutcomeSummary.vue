<template>
    <div class="width--100">
        <h1 class="md-display-1">Summary</h1>
        <md-table v-model="summaryStats">
            <!-- Row Template -->
            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Category" md-sort-by="name">
                    {{ item.name }}
                </md-table-cell>
                <md-table-cell md-label="Start" md-sort-by="start">
                    {{ item.start }}
                </md-table-cell>
                <md-table-cell md-label="End" md-sort-by="end">
                    {{ item.end }}
                </md-table-cell>
                <md-table-cell md-label="Total Change" md-sort-by="deltaValue">
                    <DeltaValue
                        :value="item.deltaValue"
                        :suffix="item.suffix"
                    />
                </md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>
<script>
    /**
     * @module OutcomeSummary - Displays prediction highlights in a table
     * Weights are converted to the appropriate measurement system prior to being
     * set in the store.  Meaning everything is already converted and ready for display,
     * we just have to get some suffixes to display `${userStat.weight} ${Weight.displayName().short}`,
     * or `100kg`
     */
    import * as R from 'ramda'
    import { mapState } from 'vuex'
    import { toPojo, uuid } from 'common/utils'
    import { Weight } from '../../measurement/measurement_system'
    import DeltaValue from './DeltaValue.vue'


    export const OutcomeSummary = {
        name: 'outcome-summary',
        components: {
            DeltaValue
        },

        props: {
            userStats: {
                type: Object,
                required: true
            },

            measurementSystem: {
                type: Number,
                required: true
            }
        },

        computed: {
            ...mapState('prediction', [
                'dateRange',
                'predictions'
            ]),

            weightSuffix() {
                return Weight.of(this.measurementSystem)(0).args().nameObj.short
            }
        },

        data() {
            return {
                summaryStats: []
            }
        },

        watch: {
            predictions: {
                deep: true,
                handler({ highlights }) {
                    const mergedHighlights = toPojo(highlights).reduce(R.mergeDeepRight, {})
                    this.setSummaryStats(mergedHighlights)
                }
            }
        },

        methods: {
            setSummaryStats(highlights) {
                const {
                    min,
                    max,
                    minBmi,
                    maxBmi,
                    delta,
                    average,
                    minCaloriesBurnedPerDay,
                    maxCaloriesBurnedPerDay,
                    startWeight,
                    endWeight
                } = highlights

                const weightIncreased = endWeight > startWeight

                const stats = [
                    {
                        name: 'Bodyweight',
                        start: startWeight,
                        end: endWeight,
                        deltaValue: Math.abs(max - min),
                        suffix: this.weightSuffix
                    },
                    {
                        name: 'BMI',
                        start: weightIncreased ? minBmi : maxBmi,
                        end: weightIncreased ? maxBmi : minBmi,
                        deltaValue: Math.abs(maxBmi - minBmi),
                        suffix: null
                    },
                    {
                        name: 'Calories burned per day',
                        start: weightIncreased ? minCaloriesBurnedPerDay : maxCaloriesBurnedPerDay,
                        end: weightIncreased ? maxCaloriesBurnedPerDay : minCaloriesBurnedPerDay,
                        deltaValue: Math.abs(maxCaloriesBurnedPerDay - minCaloriesBurnedPerDay),
                        suffix: 'kCal'
                    }
                ]

                this.summaryStats = stats.map(obj => ({
                    ...obj,
                    id: uuid()
                }))
            }
        },

        mounted() {
            this.$nextTick(()=> {
                const mergedHighlights = toPojo(this.predictions.highlights).reduce(R.mergeDeepRight, {})
                this.setSummaryStats(mergedHighlights)
            })
        }
    }

    export default OutcomeSummary
</script>