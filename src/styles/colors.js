

export const primary =  '#1b2a2f'
export const secondary =  '#dd2c00'
export const error = '#C62828'

export const light = '#ffffff'
export const dark = '#000000'


export const background = '#fbfbfb'
export const surface = '#f5f5f6'


export const textOnDark = '#fbfbfb'

export const textOnLight = dark


// Supplemental colors are usually used for Charts
export const supplementalColors = [
    primary,
    secondary,
    error,
    '#3949AB',
    '#039BE5',
    '#43A047',
    '#E53935',
    '#1E88E5',
    '#FFB300',
    '#D81B60',
    '#8E24AA',
    '#00ACC1',
    '#FDD835',
    '#546E7A',
    '#7CB342',
    '#F4511E',
    '#00897B',
    '#FB8C00',
    '#C0CA33'
]


export const Theme = {
    primary,
    secondary,
    error,
    
    background: {
        background,
        surface,
        light,
        dark
    },

    text: {
        light: textOnDark,
        dark: textOnLight
    },

    supplemental: supplementalColors
}

export default Theme