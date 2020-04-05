import * as R from 'ramda'


// Utils
/*  One-liners
 *============================*/
export const isString = R.is(String)

export const isNumber = R.tryCatch(
    R.both(
        R.complement(isNaN),
        R.is(Number)
    ),
    R.F
)


export const isBoolean = R.is(Boolean)

export const isArray = R.is(Array)

export const isFunction = R.is(Function)

export const isTrue = x => !!x

export const isFalse = x => !x

export const propIsFunction = (prop, obj)=> isFunction( R.prop(prop, obj) )


/* Function Utils
 *============================*/


//-- Decorators
export const genericDebounce = (wait=setTimeout, cancel=clearTimeout)=> (fn, delay)=> {
    let delayRef

    return function(...args) {
        const functionCall = ()=> fn.apply(this, args)
        
        cancel(delayRef)
    
        delayRef = wait(functionCall, delay)
        return delayRef
    }
}


export const debounce = genericDebounce(setTimeout, clearTimeout)


export const debounceFrame = genericDebounce(window.requestAnimationFrame, window.cancelAnimationFrame)


/**
 * @source https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca#gistcomment-2230205
 */
export function throttle(callback, delay) {
    let isThrottled = false,
        args, context

    function wrapper() {
        if (isThrottled) {
            args = arguments
            context = this
            return
        }

        isThrottled = true
        callback.apply(this, arguments)

        setTimeout(() => {
            isThrottled = false
            if (args) {
                wrapper.apply(context, args)
                args = context = null
            }
        }, delay)
    }

    return wrapper
}



/**
 * @func cyclicIndex - Get `index` from array.  If `index` > `arr`.length,
 * it will get the index from the array as if the array repeated until
 * we were able to get the index.
 * 
 * @example
 * var myArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * myArr.length //=> 11
 * cyclicIndex(myArr, 12) //=> 1
 * cyclicIndex(myArr, 13) //=> 2
 * cyclicIndex(myArr, 14) //=> 3
 */
export const cyclicIndex = (arr, index)=> {
    const len = arr.length
    return index < len ? arr[index] : arr[index % len]
}



/* Object Utils
*============================*/


export const toPojo = x => R.tryCatch(
    R.compose(
        JSON.parse,
        JSON.stringify
    ),
    ()=> x
)(x)

export const tryToJson = x => R.tryCatch(
    JSON.stringify,
    ()=> x
)



/* String Utils
*=================================*/

export function uuid() {
    let _uuid = ""
    let i = 0
    let random
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            _uuid += "-"
        }
        _uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16)
    }
    return _uuid
}

