import * as R from 'ramda'
import * as moment from 'moment'
import { supplementalColors } from 'styles/colors'



const formatXAxisLabel = v => {
    console.log(`formatXAxisLabel -> ${v}`)
    return moment(v).format('MMM D')
}


const xIsSeries = 1

export const chartConfig = {
    title: 'Bodyweight Change',
    type: 'line',
    height: 500,
    colors: supplementalColors,
    axisOptions: {
        xIsSeries
    },
    xIsSeries
}

export default chartConfig


export const mapSeriesData = ({ userStats, date })=> ({
    label: Number(date),
    value: Number(userStats.weight).toFixed(1)
})


/**
 * @func mapSeries - Map a list of Predictions to a chartist-friendly
 * format
 * @param {{ userStats: Object, date: Date }[]} predictions
 * @returns {Object}
 */
export const mapSeries = R.compose(
    R.sortBy(R.prop('label')),
    R.map(mapSeriesData)
)


export const mapPredictionData = predictions => {
    const dataPairs = predictions.map(mapSeriesData)
    return {
        labels: dataPairs.map(R.prop('label')),
        data: [{
            name: 'Bodyweight',
            values: dataPairs.map(R.prop('value'))
        }]
    }
}