/**
 * @module request - Provides a 'fetch' interface w/ a slightly more friendly API,
 * and is pre-configured with our CSRF token.
 * 
 * fetchData also helps mitigate header[Content-Type] headaches that like to pop
 * up when you're trying to send a FormData instance vs. JSON.
 */
import { isNil, mergeDeepRight, prop } from 'ramda'
import { isString } from './utils'


const FetchConfig = {
    method: 'GET',
    // mode: 'same-origin',
    mode: 'cors',
    credentials: 'include',
    headers: {
        'X-CSRFToken': window.CSRF,
        'X-csrf-token': window.CSRF,
        'X-REQUESTED-WITH': 'XMLHttpRequest'
    },
    cache: 'no-cache'
}


const isForm = x => x instanceof FormData


export const fetchData = (url, data=false)=> {
    let config = Object.assign({}, FetchConfig)
    if (data) {
        config = mergeDeepRight(config, data)
        const body = prop('body', data)

        if (body) {
            if ( isNil(prop('headers', data)) && !isForm(body) ) {
                config.headers['Content-Type'] = 'application/json; charset=utf-8'
            } else if (isForm(body)) {
                delete config.headers['Content-Type']
            }
            
            config.body = isForm(body)
                ? body
                : isString(body)
                    ? body
                    : JSON.stringify(body)
        }
    }

    return fetch(url, config)
        .then((response)=> {
            if (response.status < 200 || response.status > 299) {
                throw response
            }
            return response
        })
        .then((resp)=> resp.json())
}

export default fetchData

window.fetchData = fetchData

