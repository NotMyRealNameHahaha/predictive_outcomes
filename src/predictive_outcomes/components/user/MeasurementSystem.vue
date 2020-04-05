<template>
    <PredictorField title="Measurement System">
        <template v-slot:default>
            <div class="md-layout md-gutter md-alignment-space-between-center width--100">
                <!-- imperial -->
                <div class="md-layout-item md-size-50 md-small-size-100 i-flex flex--justify-center flex--align-center pad--v-10">
                    <div class="width--100 pad--v-10 i-flex flex--justify-center flex--align-center ">
                        <md-chip
                            @click="onClick(false)"
                            :class="['ms-chip', 'ms-chip--metric', isImperial ? '' : activeClass]"
                            md-clickable
                        >
                            <i class="ms-chip--icon mdi mdi-weight-kilogram"></i>
                            <span class="ms-chip--text">
                                Metric
                            </span>
                        </md-chip>
                    </div>
                </div>

                <!-- metric -->
                <div class="md-layout-item md-size-50 md-small-size-100">
                    <div class="width--100 pad--v-10 i-flex flex--justify-center flex--align-center ">
                        <md-chip
                            @click="onClick(true)"
                            :class="['ms-chip', 'ms-chip--imperial', isImperial ? activeClass : '']"
                            md-clickable
                        >
                            <i class="ms-chip--icon mdi mdi-weight-pound"></i>
                            <span class="ms-chip--text">
                                Imperial
                            </span>
                        </md-chip>
                    </div>

                </div>
            </div>
        </template>
    </PredictorField>
</template>
<script>
    import * as R from 'ramda'
    import PredictorField from '../shared/PredictorField.vue'
    import { MEASUREMENT_SYSTEMS } from '../../measurement/measurement_system'


    export default {
        name: 'measurement-system',
        components: {
            PredictorField
        },

        props: {
            // measurementSystem.id
            // @see MEASUREMENT_SYSTEMS
            value: {
                type: Number,
                default: MEASUREMENT_SYSTEMS.imperial
            }
        },

        data() {
            return {
                activeClass: 'ms-chip--active'
            }
        },

        computed: {
            isImperial() {
                const isImperial = this.value === MEASUREMENT_SYSTEMS.imperial
                return isImperial
            }
        },

        methods: {
            onClick(isImperial) {
                console.log(isImperial)
                const value = isImperial
                    ? MEASUREMENT_SYSTEMS.imperial
                    : MEASUREMENT_SYSTEMS.metric

                this.$store.commit('stat/setProp', {
                    value,
                    key: 'measurementSystem'
                })
                this.$emit('update', value)
            }
        }
    }    
</script>
<style lang="scss">
    @import 'styles/colors';
    @import 'styles/luminance';
    
    $metric: $primary-light;
    $imperial: $secondary-light;


    .ms-chip.md-chip {
        &.ms-chip--active {
            &.ms-chip--metric {
                @include text-contrast($metric);
                background: $metric;
            }

            &.ms-chip--imperial {
                @include text-contrast($imperial);
                background: $imperial;
            }
        }
    }
</style>