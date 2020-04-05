import * as R from 'ramda'
import { isNumber } from 'common/utils'


const Nothing = R.always(null)


export const numbersOnly = R.tryCatch(
    R.compose(
        R.ifElse(
            isNumber,
            R.identity,
            Nothing
        ),
        parseInt,
        R.replace(
            /[^0-9]/g,
            ''
        )
    ),
    Nothing
)
