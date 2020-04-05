<template>
    <div class="outcome-chart--container">
        <TrendChart
            v-bind="chartMetaProps"
            :labels="labels"
            :datasets="dataSets"
            :grid="{
                horizontalLines: true,   
                verticalLines: true,
            }"
            @mouse-move="onMouseMove"
            interactive
            id="outcome-chart"
            class="outcome-chart"
        />
        <div
            id="pop"
            role="tooltip"
            ref="tooltip"
            class="tooltip"
            :class="{'is-active': tooltipData}"
        >
            <div v-if="tooltipData" class="tooltip-container">
                <strong>{{ labels.xLabels[tooltipData.index] }}</strong>
                <div class="tooltip-data">
                    <div class="tooltip-data-item tooltip-data-item--1">
                        {{ tooltipTitle }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import * as R from 'ramda'
    import Vue from 'vue'
    import moment from 'moment'
    import { mapState } from 'vuex'
    import { debounce, toPojo } from 'common/utils'
    import { dateRangeList, RangeFilter } from './date_range'
    import { makeListFit } from '../shared/sample'
    import { chartConfig, mapPredictionData } from './chart_config'
    import { Weight } from '../../measurement/measurement_system'
    import { TooltipMixin } from './tooltip_mixin'


    const PHI = 1.61803


    const formatDate_ = date => moment(date).format('D MMM')

    const formatDate = R.tryCatch(
        formatDate_,
        ()=> moment().format('D MMM YY')
    )


    const humanizeNumber = n => Number(parseInt(n))


    const mapChartParams = nodes => {
        const mappedData = nodes.reduce(
            ({ labels, dataSets }, { date, weight })=> ({
                labels: labels.concat( formatDate(date) ),
                dataSets: dataSets.concat( Math.round(weight) || 0)
            }),
            {
                labels: [],
                dataSets: []
            }
        )

        return {
            dataSets: [{
                data: mappedData.dataSets,
                smooth: true,
                showPoints: true,
                fill: true,
                className: 'outcome--delta'
            }],

            labels: {
                xLabels: mappedData.labels,
                yLabels: 5
            }
        }
    }


    const sampleChartData = makeListFit(15)


    export const OutcomeChart = {
        name: 'outcome-chart',
        mixins: [
            TooltipMixin
        ],

        props: {
            measurementSystem: {
                type: Number,
                required: false
            }
        },

        data() {
            return {
                labels: {},
                dataSets: [],
                chartMetaProps: {
                    min: 0,
                    max: 200
                }
            }
        },

        computed: {
            ...mapState('prediction', [
                'dateRange',
                'predictions'
            ]),

            chartData() {
                return sampleChartData(this.predictions.nodes)
            },

            tooltipTitle() {
                if (this.tooltipData) {
                    const bodyweight = this.tooltipData.data[0]
                    return Weight.displayWeight(this.measurementSystem)(bodyweight)
                }
                return ''
            }
        },

        watch: {
            predictions: {
                deep: true,
                handler() {
                    this.reDraw()
                }
            },

            dateRange: {
                deep: true,
                handler() {
                    this.reDraw()
                }
            },

            measurementSystem() {
                this.reDraw()
            },

            chartData() {
                this.reDraw()
            }
        },

        methods: {
            setChartMetaProps() {
                const highlights = this.predictions.highlights
                    .reduce(
                        (left, right)=> R.mergeDeepRight(left, toPojo(right)),
                        {}
                    )

                const { min, max, startWeight, endWeight } = highlights
                const chartMin = min * 0.95
                const chartMax = max > (min * 1.1)
                    ? max * 1.05
                    : min * 1.1
                
                this.chartMetaProps = {
                    ...this.chartMetaProps,
                    min: humanizeNumber(chartMin),
                    max: humanizeNumber(chartMax)
                }
            },

            _draw() {
                return this.$nextTick(()=> {
                    const { dataSets, labels } = mapChartParams(this.chartData)
                    this.dataSets = dataSets

                    this.labels = {
                        ...this.labels,
                        ...labels,
                        yLabelsTextFormatter: Weight.displayWeight(this.measurementSystem)
                    }

                    this.setChartMetaProps()
                    this.initPopper()
                })
            }
        },

        created() {
            this.reDraw = debounce(()=> this._draw(), 200)
            this.onMouseMove = debounce(this._onMouseMove, 50)
            // this.onMouseMove = this._onMouseMove
        },

        mounted() {
            window.outcomeChart = this
            this.$nextTick(()=> this.reDraw())
        }
    }
    export default OutcomeChart
</script>
<style lang="scss">
    @import '../../../styles/colors';

    .outcome-chart--container {
        width: 100%;
        max-width: 100%;
        position: relative;

        .outcome-chart {
            // height: calc(100vh / 1.619);
            height: 400px;
            max-height: 100%;
            position: relative;
        }


        .point {
            stroke-width: 2;
            transition: stroke-width 0.2s;
        }
        .point.is-active {
            stroke-width: 5;
        }

        .outcome--delta {
            .stroke {
                stroke: $secondary-light;
                stroke-width: 2;
            }
            .fill {
                fill: $secondary-light;
                opacity: 0.05;
            }
            .point {
                fill: $secondary-light;
                stroke: $secondary-light;
            }
        }

        .outcome--min {
            .stroke {
                stroke: $primary-light;
                stroke-width: 2;
            }
            .fill {
                fill: $primary-light;
                opacity: 0.05;
            }
            .point {
                fill: $primary-light;
                stroke: $primary-light;
            }
        }

        .tooltip {
            &:not(.is-active) {
                display: none;
            }
            padding: 10px;
            background: #fff;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            pointer-events: none;
            &-data {
                display: flex;
                &-item {
                    display: flex;
                    align-items: center;
                    &:not(:first-child) {
                        margin-left: 20px;
                    }
                    &:before {
                        content: "";
                        display: block;
                        width: 15px;
                        height: 15px;
                        margin-right: 5px;
                    }
                    &--1:before {
                        background: $secondary-light;
                    }
                    &--2:before {
                        background: #fbe1b6;
                    }
                    &--3:before {
                        background: #7fdfd4;
                    }
                }
            }
        }
    }
</style>