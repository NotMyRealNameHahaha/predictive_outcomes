<template>
   <div id="predictors-component--container" class="predictors-component--container flex as jc pad--top-20 pad--bottom-40">
        <div class="width--100 md-layout">
            <!-- Calorie Intake -->
            <div class="md-layout-item md-size-50 md-small-size-100">
                <CalorieIntake @update="recalculate"/>
            </div>

            <!-- Physical Activity Level -->
            <div class="md-layout-item md-size-50 md-small-size-100">
                <PhysicalActivity @update="recalculate"/>
            </div>
        </div>
    </div>
</template>

<script>
    import CalorieIntake from './CalorieIntake.vue'
    import PhysicalActivity from './PhysicalActivity.vue'


    export const PredictorForm = {
        name: 'predictor-form',
    
        components: {
            CalorieIntake,
            PhysicalActivity
        },

        methods: {
            recalculate() {
                this.$emit('update', {})
            }
        }
    }

    export default PredictorForm
</script>