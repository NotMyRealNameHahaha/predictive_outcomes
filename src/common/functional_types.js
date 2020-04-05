const identity = x => x

export class Monad {
    constructor(value) {
        this._value = value
    }

    static get [Symbol.species]() {
        return this
    }

    static of(value) {
        const Cls = this[Symbol.species]
        return new Cls(value)
    }

    cls() {
        return this.constructor[Symbol.species]
    }

    ctor(value) {
        return this.cls().of(value)
    }

    value() {
        return this._value
    }

    copy() {
        return this.ctor(this.value())
    }

    map(fn=identity) {
        return this.ctor(
            fn(this.value())
        )
    }

    flatMap(fn=identity) {
        const value = this.value()
        return value && value.map
            ? this.ctor( value.map(fn) )
            : this.map(fn)
    }
    
    chain(fn) {
        return fn(this.value())
    }
}

export default Monad