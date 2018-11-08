import { Observable } from '../Observable.js';

class AppDebugger_ {
    constructor(app) {
        this.app = app
        if (app.DEBUG === true) {
            window._AppDebugger = this
        }
    }

    logger(val) {
        try {
            console.log(JSON.stringify(val, null, 4));
        } catch(err) {
            console.log(val);
        }
    }

    errorHandler(err, context=false) {
        const err_string = err.toString()
        let ctx = context || {}
        console.warn(`
        Warning: Caught ${err_string}.
        ${JSON.stringify(ctx)}`)
    }
}

export class App {

    constructor(state, events) {
        this.state = Object.assign({}, state) || {} // Copy the state object or use an empty object
        this.observable = new Observable(events)
        this.components = new Map();
        this.DEBUG = true;
        if (this.DEBUG) {
            this.debugger = new AppDebugger_(this)
        }
    }

    getState() {
        return this.state;
    }

    setState(data) {
        this.state = data;
        return this.getState();
    }

    register(component) {
        this.components.set(component.name, component)
        if (component.mount) {
            component.mount(this);
        }
        return this;
    }

    unRegister(component) {
        this.component.delete(component.name)
        if (component.unMount) {
            component.unMount(this);
        }
        return this;
    }

    dispatch(component_name, event_name, data) {
        const comp = this.components.get(component_name)
        if (comp && comp.hasOwnProperty('observable')) {
            comp.observable.dispatch(event_name, data)
        }
        return this
    }

    logger(val) {
        if (this.DEBUG) {
            this.debugger.logger(val)
        }
    }
    
    errorHandler(err, context) {
        if (this.DEBUG) {
            this.debugger.errorHandler(err, context)
        }
    }
}


const FetchConfig = {
    mode: 'same-origin',
    credentials: 'include',
    headers: {
        'X-CSRFToken': window.CSRF,
        'X-REQUESTED-WITH': 'XMLHttpRequest'
    },
    cache: 'no-cache'
};


const fetchData = (url, data=false)=> {
    let config = FetchConfig;
    if (data) {
        config = merge(config, data);
    }

    return fetch(url, config);
};

/* Get a FormData representation of an Object
* @param obj {Object}
* @return {FormData}
*/
const objToForm = (obj)=> {
    const f = new FormData()

    for (let x in obj) {
        f.set(x, obj[x])
    }
    return f
}


export class Router {
    constructor(url=BASE_URL) {
        this.url = url;
    }

    getUrl(id=false, param_object=false) {
        let url = `${this.url}`;
        if (url[url.length -1] !== '/') {
            url += '/'
        }
        if (id) {
            let last_letter = this.url[this.url.length - 1];
            url += `${id}/`

        }
        if (param_object) {
            url += '?_foo=0';
            let query_string = Object.entries(param_object).reduce((accum, item)=> {
                return String(accum + `&${item[0]}=${item[1]}`);
            }, '');

            url += query_string;
        }
        return url;
    }

    read(id=false, param_object=false) {
        return fetchData(this.getUrl(id, param_object)
            ).then( response => response.json());
    }

    post(form_data, make_form=false) {
        /* @param form_data {FormData}
        *  @return {Fetch -> response}
        */
        let url = this.getUrl();
        let data = {
            body: make_form ? objToForm(form_data) : form_data,
            method: 'POST'
        };
        return fetchData(url, data).then(response => response.json());
    }

    put(id, item_data) {
        /* Make a (JSON) PUT request,
        *  @param id {Number}
        *  @param item_data {Object}: Gets converted to JSON
        *  @return {Fetch -> JSON parsed object}
        */
        let body = {
            body: JSON.stringify(item_data),
            method: 'PUT'
        };
        return fetchData(this.getUrl(id), body).then(response => response.json());
    }

    patch(id, item_data) {
        /* Make a (JSON) PATCH request,
        *  @param id {Number}
        *  @param item_data {Object}: Gets converted to JSON
        *  @return {Fetch -> JSON parsed object}
        */
        let body = {
            body: JSON.stringify(item_data),
            method: 'PATCH'
        };
        return fetchData(this.getUrl(id), body).then(response => response.json());
    }

    delete(id, item_data=false) {
        /* Make a (JSON) DELETE request,
        *  @param id {Number}
        *  @param item_data {Object}: Optional - Gets converted to JSON if you pass in a value
        *  @return {Fetch -> JSON parsed object}
        */
        let body = {
            method: 'DELETE'
        };
        if (item_data) {
            body.body = JSON.stringify(item_data);
        }

        return fetchData(this.getUrl(id), body).then(response => response.json());
    }

}
