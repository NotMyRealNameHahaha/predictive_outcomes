import * as R from 'ramda'
import { toPojo } from 'common/utils'


export const diffObj = objA => {
    const props = R.props( Object.keys(objA) )
    return objB => R.symmetricDifference(
        props( toPojo(objB) ),
        props( toPojo(objA) )
    )
}

export default diffObj