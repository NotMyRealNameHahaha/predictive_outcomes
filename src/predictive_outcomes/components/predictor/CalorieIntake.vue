<template>
    <PredictorSlider
        @update="onUpdate"
        :value="calories"
        :sliderOptions="{
            interval: interval,
            min: min,
            max: max,
            contained: true   
        }"
        title="Intake"
        suffix="Calories / day"
        class="calorie-form"
        help
    >
        <template v-slot:help>
            <span>
                If you're not sure, <a href="https://www.webmd.com/diet/healthtool-food-calorie-counter" target="_blank"> <u>this WebMD tool can steer you in the right direction</u></a>
            </span>
        </template>
    </PredictorSlider>
</template>
<script>
    import PredictorSlider from '../shared/PredictorSlider.vue'
    import {
        getPal,
        WORKOUT_MIN,
        WORKOUT_MAX,
        WORKOUT_STEP
    } from '../../measurement/activity_level'

    const INTAKE_MIN = 1000
    const INTAKE_MAX = INTAKE_MIN * 7.5
    const INTAKE_INTERVAL = 100
    

    export const CalorieIntake = {
        name: 'calorie-intake',
        components: {
            PredictorSlider
        },

        data() {
            return {
                calories: INTAKE_MIN * 2.5,
                min: INTAKE_MIN,
                max: INTAKE_MAX,
                interval: INTAKE_INTERVAL
            }
        },

        methods: {
            onUpdate(value) {
                this.calories = value
                this.$store.commit('stat/setProp', {
                    value,
                    key: 'calorieIntake'
                })

                this.$emit('update', value)
                return value
            }
        },

        mounted() {
            this.$nextTick(()=>
                this.onUpdate(this.$store.state.stat.calorieIntake)
            )
        }
    }
    export default CalorieIntake
</script>
<style lang="scss">

</style>