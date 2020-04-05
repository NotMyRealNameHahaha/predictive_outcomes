/**
 * @func makeListFit - Shrink a list to fit into `max` number
 * of items.
 * 
 * NOTE: Do not use this if you need the list to be EXACTLY `max`
 * 
 * This function takes a Honey Badger approach to making the list under `max` length.
 * As in, it doesn't care about your data.  It doesn't give a shit at all.
 * It will gladly leave stuff out to fit it within the max constraint as fast as possible.
 */
export const makeListFit = max => list => {
    const len = list.length
    if (len <= max) {
        return list
    }
    const delta = Math.ceil(len / max) || 2
    let temp = []
    let i = 0
    while (i < len) {
        temp.push(list[i])
        i = i + delta
    }
    return temp
}

export default makeListFit