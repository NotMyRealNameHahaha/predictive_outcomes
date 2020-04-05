import * as R from 'ramda'

/**
 * @typedef {function} Lens - A lens bound to a getter & setter
 * @example
 * const myLens = R.lens(
 *      x => x.myKey,
 *      myValue => myObject => R.assoc('myKey', myValue, myObject)
 * )
 */

const eq = R.curry((a, b)=> R.equals(a, b))

//-- Lens utility functions to save some keystrokes =D

export const lensEq = lens => value => obj => eq(value, R.view(lens, obj))


export const eqLenses = lens => a => b => eq(R.view(lens, a),  R.view(lens, b))


/**
 * @func mapLens - Like `R.over`, but the modifier function accepts the
 * entire Object/Array/Anything (not just the focused value)
 * 
 */
export const mapLens = lens => fn => obj =>
    R.set(
        lens,
        fn(
            R.view(lens, obj),
            obj
        ),
        obj
    )


export const uniqByLens = lens => R.uniqBy( R.view(lens) )


export const findByLens = lens => value =>
    R.find( lensEq(lens)(value) )


export const filterByLens = lens => value =>
    R.filter( lensEq(lens)(value) )


export const sortByLens = lens =>
    R.sortBy( R.view(lens) )



//-- Common Lenses (id, name, etc)
export const idLens = R.lensPath(['id'])


export const viewId = R.view(idLens)


export const uniqById = uniqByLens(idLens)


export const findById = id => findByLens(idLens)(id)


export const nameLens = R.lensPath(['name'])

export const viewName = R.view(nameLens)


export const sortOrderLens = R.lensPath(['sortOrder'])
