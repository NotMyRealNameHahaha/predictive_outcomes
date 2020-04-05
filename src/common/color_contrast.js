/**
 * 
 * Based on the W3 document for accessibility
 * @see https://www.w3.org/TR/AERT/
 * """
 * Color brightness is determined by the following formula:
 * ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
 * 
 * ...
 * 
 * The rage [sic] for color brightness difference is 125
 * """
 * Inspired by this Code Pen: https://codepen.io/davidhalford/pen/ywEva
 */
import * as R from 'ramda'


/**
 * Constants
 */

// Half of 255 (roughly). If below threshold, then the color is light, otherwise we consider it dark
export const THRESHOLD = 125

// Color brightness thresholds
const rFactorial = 299

const gFactorial = 587

const bFactorial = 114


// Hex -> RGB character positions
const rPosition = [0, 2]

const gPosition = [2, 4]

const bPosition = [4, 6]


/**
 * Helpers
 */

const splitHex = hex => hex.charAt(0) === '#'
    ? hex.substring(1, 7)
    : hex


const getRgbValue = pair => hex =>
    parseInt(
        splitHex(hex).substring(...pair),
        16
    )


const getRed = getRgbValue(rPosition)

const getGreen = getRgbValue(gPosition)

const getBlue = getRgbValue(bPosition)


const rgbFactorials = hex => [
    (getRed(hex) * rFactorial),
    (getGreen(hex) * gFactorial),
    (getBlue(hex) * bFactorial)
]


/**
 * @func getBrightness - Get the brightness of a color based on W3's
 * @param {String} hex - Color in hex format
 * @returns {Number} - See module doc
 */
export const getBrightness = R.compose(
    R.partialRight(R.divide, [1000]),
    list => list.reduce(R.add, 0),
    rgbFactorials
)


/**
 * @func getTextColor - Function to provide a light color or a dark color depending on a third color (ex. a potential background color)
 * @param {String} lightColor - Color to use on dark backgrounds
 * @param {String} darkColor - Color to use on light backgrounds
 * @returns {function(String): String} - Returns dark color if your color is above the brightness threshold
 */
export const getTextColor = (lightColor='#fff', darkColor='#000')=> yourColor =>
    getBrightness(yourColor) > THRESHOLD
        ? darkColor
        : lightColor


export default getTextColor