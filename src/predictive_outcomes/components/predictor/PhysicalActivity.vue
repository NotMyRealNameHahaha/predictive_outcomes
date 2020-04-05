<template>
    <PredictorSlider
        @update="onUpdate"
        :value="workouts"
        v-model="workouts"
        :sliderOptions="{
            interval,
            max,
            min,
            contained: true,
            inline: true,
            marks: true,
        }"
        title="Exercise"
        suffix="Hours/Week"
        class="activity-form"
    />
</template>
<script>
    import PredictorSlider from '../shared/PredictorSlider.vue'
    import {
        getPal,
        WORKOUT_MIN,
        WORKOUT_MAX,
        WORKOUT_STEP
    } from '../../measurement/activity_level'
    

    export const PhysicalActivity = {
        name: 'physical-activity',
        components: {
            PredictorSlider
        },

        data() {
            return {
                workouts: 0,
                activityLevelLabel: 'Sedentary',
                min: WORKOUT_MIN,
                max: WORKOUT_MAX,
                interval: WORKOUT_STEP
            }
        },

        methods: {
            onUpdate(workouts) {
                const { value, name } = getPal(workouts)
                this.workouts = value
                this.$store.commit('stat/setProp', {
                    value,
                    key: 'activityLevel'
                })

                this.activityLevelLabel = name
                this.$emit('update', value)
            }
        }
    }
    export default PhysicalActivity
</script>
<style lang="scss">
    .activity-form {
        .predictors-component--header {
            padding-bottom: 0.75rem;
        }
    }
</style>