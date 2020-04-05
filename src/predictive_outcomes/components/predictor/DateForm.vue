<template>
    <div class="date-form width--100 flex flex--justify-start flex--align-center">
        <div class="date-form--block date-form--block-label">
            From
        </div>
        <div class="date-form--block">
            <md-datepicker
                v-model="startDate"
                :mdDisabledDates="dateIsNotToday"
                disabled
            />
        </div>
        <div class="date-form--block date-form--block-label">
            To
        </div>
        <div class="date-form--block">
            <md-datepicker
                v-model="internalValue"
                :mdDisabledDates="dateNotInRange"
            />
        </div>
    </div>
</template>

<script>
    import * as R from 'ramda'
    import moment from 'moment'
    import PredictorField from '../shared/PredictorField.vue'

    const min = 30
    const max = (365 * 2) + 1
    const interval = 15

    const minMoment = moment().toDate()
    const maxMoment = moment().add(max, 'day').toDate()

    const minMomentNumeric = Number(minMoment)
    const maxMomentNumeric = Number(maxMoment)

    const dateInRange = date => {
        const ms = Number(moment(date).toDate())
        return ms >= minMomentNumeric
            && ms <= maxMomentNumeric
    }


    const dateStr = d => moment(d).format('YYYY-MM-D')


    const datesEq = a => b =>
        dateStr(a) === dateStr(b)


    const isToday = d => datesEq(minMoment)(d)



    // Date -> {Number} (# of days between `date` and today)
    /**
     * @func dateToDuration - Get the (absolute value of the) # of days betweeen `date` and today
     * @param {Date} date
     * @returns {Number}
     */
    const dateToDuration = date => Math.abs(
        moment().diff(
            moment(date),
            'days'
        )
    )


    export const DateForm = {
        name: 'date-form',
        components: {
            PredictorField
        },


        data() {
            return {
                internalValue: moment().add(interval, 'day').toDate()
            }
        },

        computed: {
            startDate: {
                get() {
                    return moment().toDate()
                },

                set(value) {
                    // Do nothing =D
                }
            }
        },

        watch: {
            internalValue(value) {
                this.onUpdate(value)
            }
        },

        methods: {
            onUpdate(value) {
                const duration = dateToDuration(value)
                this.$store.dispatch('prediction/setDuration', duration)
                this.$emit('update', duration)
            },

            dateIsNotToday(date) {
                return !isToday(date)
            },

            dateNotInRange(date) {
                return !dateInRange(date)
            }
        }
    }    
    export default DateForm
</script>
<style lang="scss">
    .date-form {
        .predictors-component--header {
            display: none;
        }

        .predictors-component--title,
        .predictors-component--sub {
            width: auto;
        }

        .predictors-component--title {
            white-space: nowrap;
        }

        .date-form--block {
            padding: 0 1rem;
        }
    }
</style>