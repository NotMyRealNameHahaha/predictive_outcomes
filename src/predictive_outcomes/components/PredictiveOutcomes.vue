<template>
    <div class="width--100">
        <AppTabs>
            <!-- Intro -->
            <template v-slot:intro>
                <p class="margin--bottom-10">
                    Predictive Outcomes is designed to compliment your understanding of how diet and exercise affect <i>your</i> bodyweight over time. By using your physical stats (age, height, weight, etc.), we can predict how your activity level and calorie intake will shape your bodyweight indefinitely.
                </p>
            </template>
            <template v-slot:about>
                <section class="width--100">
                    <!-- Why? -->
                    <h6 class="md-title margin--bottom-0 pad--v-20">
                        How is this different than raw number crunching?
                    </h6>
                    <div>
                        <p>
                            Most formula don't factor in the <u>daily</u> changes in weight.  When you have significant changes in weight, your calorie needs change.  This re-calculates your calorie needs on a daily basis, which drastically increases precision.
                        </p>
                        <p>
                            Picture this scenario:
                            <br>
                            You weigh 200 pounds (arbitrary friendly number).  You're on a weight-loss program, and you cut down to 190 lbs. over 4 weeks.  While you're absolutely kicking ass, you will soon begin to plateau.
                        </p>
                        <pre>But when?</pre>
                        <pre>How bad will I plateau?</pre>
                        <p>
                            These are the questions that lead to the birth of Predictive Outcomes.  \ (•◡•) /
                        </p>
                    </div>
                    
                    <!-- Math Details -->
                    <h6 class="md-title margin--bottom-0 pad--v-20">
                        That's dope.  How do I know it's accurate?
                    </h6>
                    <div>
                        <p>
                            For 99.9999% of people, it's a matter of:
                        </p>
                        <blockquote class="note-block">
                            Bodyweight = <u>Consistency</u> x (calories in - calories out)
                        </blockquote>
                        <br>
                        <p>
                            <b>Calories Out / Calories Burned</b>
                            - This is drastically impacted by your activity level, your bodyweight, and age (along with a few other variables).  
                            The <a href="https://en.wikipedia.org/wiki/Basal_metabolic_rate#BMR_estimation_formulas" target="_blank">Mifflin St. Jeor Equation</a> is used to calculate your Basal Metabolic Rate (BMR).  It is designed to have 90% accuracy for individuals between 18-70 years of age.
                        </p>
                    </div>

                    <h6 class="md-title margin--bottom-0 pad--v-20">
                        Are you going to save my information, then use to blackmail me?
                    </h6>
                    <p>
                        That was oddly specific.  No.  What you enter here stays here.  I don't even save it on my server, meaning all of the number crunching happens in your browser, and I never know what you enter.
                        <br>

                        <a
                            href="https://github.com/NotMyRealNameHahaha/predictive_outcomes/"
                            target="_blank"
                            style="text-decoration: initial;"
                        >
                            This project is open source.  Feel free to check the code.
                        </a>
                    </p>


                    <p>
                        If you have any feedback, I would love to hear it!  I encourage you to submit any questions, feature requests, or bug reports via
                        <a
                            href="https://github.com/NotMyRealNameHahaha/predictive_outcomes/"
                            target="_blank"
                            style="text-decoration: initial;"
                        >
                            Github.
                        </a>
                        <br>
                    </p>
                    <hr>
                </section>
            </template>

            <template v-slot:dev>
                <!-- Tech Details -->
                <h6 class="md-title margin--bottom-0 pad--v-20">
                    Nerd Notes / Development Instructions
                </h6>
                <div class="app--instructions">
                        <a
                            href="https://github.com/NotMyRealNameHahaha/predictive_outcomes/"
                            target="_blank"
                            style="text-decoration: initial;"
                        >
                            Check the Github page
                        </a>
                    <p>
                        This assumes you have <a href="//nodejs.org/" target="_blank">Node.js</a> installed.
                    </p>
                    <br>
                    <ol>
                        <li>
                            Clone the repo & change to its main directory
                            <pre class="app--code">
                                git clone https://github.com/NotMyRealNameHahaha/predictive_outcomes.git && cd predictive_outcomes
                            </pre>
                        </li>
                        <li>
                            Install Node dependencies
                            <pre class="app--code">
                                npm install
                            </pre>
                        </li>
                        <li>
                            Start the server
                            <pre class="app--code">
                                source ./runserver.sh
                            </pre>
                        </li>
                    </ol>
                </div>
            </template>
        </AppTabs>
    </div>
</template>
<script>
    import { toPojo } from 'common/utils'
    import { db } from 'shared/db/index'
    import AppTabs from './AppTabs.vue'


    export const PredictiveOutcomes = {
        name: 'predictive-outcomes',
        components: {
            AppTabs
        },

        data() {
            return {
                // showDialog: false,
                // menuVisible: false,
                // lastScrollPosition: 0,
                isLoading: true,
                isFirstVisit: true
            }
        },

        mounted() {
            // See if we have anything stored locally
            // if we do, then it's not the user's first visit
            // push the stats & let things propagate as they may
            this.getStoredStats()
                .then(stats => {
                    if (!R.isNil(stats)) {
                        this.isFirstVisit = false
                        this.$store.dispatch('stat/setStoredStats', stats)
                    } else {
                        this.isFirstVisit = true
                    }
                    return stats
                })
                .finally(()=> {
                    this.$nextTick(()=>
                        this.isLoading = false
                    )
                })
        },

        methods: {
            // TODO: CR 2020-Feb-16 - Build out this functionality.  It's only been implemented here,
            // but we want to have the fields auto-populate after a user's first visit.
            // Since this isn't wired up to a backend at this time, it makes the most sense to use localForage
            // because of its built-in `indexedDB -> localStorage -> webSQL or whatever -> in-memory`
            // fallback chain (so to speak).  Ie. It handles the browser-support, we just need it... implemented =D
            getStoredStats() {
                return db.getItem('stats')
            },

            setStoredStats(stats) {
                return db.setItem('stats', toPojo(stats))
            }
        }
    }

    export default PredictiveOutcomes
</script>