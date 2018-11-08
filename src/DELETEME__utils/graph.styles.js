import { zip } from 'ramda'

export const injectGraphStyles = ()=> {

    self.addEventListener('load', function onDocLoad(event) {
        const colorTemplate = (letter, color)=> `
        .ct-series-${letter} .ct-area,
        .ct-series-${letter} .ct-slice-donut-solid,
        .ct-series-${letter} .ct-slice-pie {
            fill: ${color};
        }
        .ct-series-${letter} .ct-bar,
        .ct-series-${letter} .ct-line,
        .ct-series-${letter} .ct-point,
        .ct-series-${letter} .ct-slice-donut {
            stroke: ${color};
        }
        `

        const letterChoices = [
            'a', 'b', 'c', 'd', 'e',
            'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o'
        ]

        const colorChoices = [
            '#107dc1',
            '#009c00',
            '#002e5c',
            '#ff9400',
            '#cc171b',
            '#0C5478',
            '#FF5722',
            '#00294b',
            '#1e1e1e',
            '#eacf7d',
            '#ad1417',
            'rgb(240,245,255)',
            '#263238',
            '#37474f',
            '#E34700'
        ]

        const joinChoices = zip(letterChoices, colorChoices)

        const colorCss = joinChoices.map((c)=> colorTemplate(...c)).join('')

        const styleHtml = `<style>${colorCss}</style>`

        document.body.insertAdjacentHTML('afterbegin', styleHtml)

        event.currentTarget.removeEventListener(event.type, onDocLoad)
    })
}