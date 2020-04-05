<template>
    <md-tabs
        md-alignment="left"
        class="app-tabs"
    >
        <!-- Tab button template -->
        <template slot="md-tab" slot-scope="{ tab }">
            <div class="pad--right-15">
                <md-icon 
                    v-if="tab.data.icon"
                    :class="tab.data.icon"
                />
                {{ tab.label }}
            </div>
        </template>

        <!-- Main tab - User Stats, app settings, & outcome chart -->
        <md-tab
            href="#stats"
            md-label="Stats"
            :md-template-data="{ icon: ['mdi', 'mdi-chart-areaspline'] }"
        >
            <h3 class="md-display-2 margin--v-30">
                Predictive Outcomes
            </h3>
            <div class="width--100">
                <slot name="intro"/>
            </div>

            <!-- User Stats -->
            <user-stats-form
                @update="onStatsChange"
                :userStats="userStats"
                :measurementSystem="measurementSystem"
            />

            <!-- Next Tab -> Results -->
            <div class="width--100 pad--v-15 i-flex flex--justify-end flex--align-center">
                <md-button
                    @click="showResults"
                    href="#results"
                    class="md-primary"
                    style="height: auto; width: auto;"
                >
                    <span class="text--increase-90">
                        Outcomes
                    </span>
                    <md-icon class="md-size-4x">arrow_forward</md-icon>
                </md-button>
            </div>
        </md-tab>

        <!-- Calorie Intake, PAL, Date Range, Outcome Chart, & Outcome Summary -->
        <md-tab
            href="#results"
            md-label="Outcomes"
            :md-template-data="{ icon: ['mdi', 'mdi-billiards'] }"
        >
            <!-- Intake + PAL -->
            <predictor-form
                @update="onStatsChange"
                :userStats="userStats"
                :measurementSystem="measurementSystem"
            />

            <!-- Date Range -->
            <date-form @update="onStatsChange" v-model="duration"/>

            <!-- Chart -->
            <outcome-chart
                :measurementSystem="measurementSystem"
            />

            <!-- Summary / Delta Stats Overview -->
            <outcome-summary
                :userStats="userStats"
                :measurementSystem="measurementSystem"
            />

            <!-- Prev Tab -> Stats -->
            <div class="width--100 pad--v-15 i-flex flex--align-center">
                <md-button
                    @click="showStats"
                    href="#stats"
                    class="md-primary"
                    style="height: auto; width: auto;"
                >
                    <md-icon class="md-size-4x">arrow_back</md-icon>
                    <span class="text--increase-90">
                        Stats
                    </span>
                </md-button>
            </div>
        </md-tab>

        <!-- About this app -->
        <md-tab
            href="#about"
            md-label="About"
            :md-template-data="{ icon: ['mdi', 'mdi-information-outline'] }"
        >
            <slot name="about"/>
        </md-tab>

        <!-- Development - Github stuff -->
        <md-tab
            href="#dev"
            md-label="Development"
            :md-template-data="{ icon: ['mdi', 'mdi-code-tags'] }"
        >
            <slot name="dev"/>
        </md-tab>
    </md-tabs>
</template>

<script>
    import { mapState } from 'vuex'
    import { debounce, toPojo } from 'common/utils'
    import PredictorForm from './predictor/PredictorForm.vue'
    import UserStatsForm from './user/UserStatsForm.vue'
    import { diffObj } from './shared/diff'


    export const AppTabs = {
        name: 'app-tabs',
        components: {
            PredictorForm,
            UserStatsForm,
            'date-form': ()=> import('./predictor/DateForm.vue'),
            'outcome-chart': ()=> import('./outcome_chart/OutcomeChart.vue'),
            'outcome-summary': ()=> import('./outcome_summary/OutcomeSummary.vue')
        },

        data() {
            return {
                activeTab: null
            }
        },

        computed: {
            ...mapState('stat', [
                'activityLevel',
                'calorieIntake',
                'measurementSystem',
                'userStats'
            ]),

            duration: {
                get() {
                    return this.$store.state.prediction.dateRange.duration
                },
                
                set(duration) {
                    this.$store.dispatch('prediction/setDuration', duration)
                    this.onStatsChange()
                }
            }
        },

        methods: {
            /**
             * @method handleStatsChange - NOTE: This is where the "magic" happens - where we hand off
             * the userStats, measurementSystem, etc. to the "prediction" module.  
             */
            handleStatsChange() {
                const {
                    activityLevel,
                    calorieIntake,
                    measurementSystem,
                    userStats
                } = this.$store.state.stat

                this.$store.dispatch('prediction/calculate', toPojo({
                    activityLevel,
                    calorieIntake,
                    measurementSystem,
                    userStats
                }))
            },

            showResults() {
                document.querySelector('[href="#results"]').click()
            },

            showStats() {
                document.querySelector('[href="#stats"]').click()
            }
        },

        created() {
            this.onStatsChange = debounce(()=> this.handleStatsChange(), 150)
        },

        mounted() {
            this.$nextTick(()=> this.onStatsChange())
        }
    }

    export default AppTabs
</script>

<style lang="scss">
    @import 'styles/constants';

    // Container for tabs + tab content (basically the whole page)
    .app-tabs.md-tabs {
        width: 100%;
        max-width: 100vw;
        overflow-x: auto;
        position: relative;

        // Main container for tab buttons
        .md-tabs-navigation {
            width: 100%;
            // max-width: 100%;
            margin: auto auto auto 0;
            padding: 0;

            overflow-x: auto;
            display: flex;
            justify-content: flex-start;
            flex-flow: row nowrap;
            position: absolute;
        }

        .md-tab-nav-button {
            // margin: auto 1rem;
            flex: none;
            width: 33%; // Enforce overflow (except <= desktop)

            &:first-of-type {
                flex-grow: 2;
                flex-shrink: 0;
            }
        }
        
        @media (max-width: $desktop) {
            .md-tabs-content {
                margin-top: 3rem;
            }
        }

        // Width >= desktop
        @media (min-width: $desktop) {
            .md-tabs-navigation {
                position: relative;
            }

            .md-tab-nav-button {
                width: auto;
            }
        }
    }

</style>