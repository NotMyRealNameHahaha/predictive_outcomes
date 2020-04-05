import localforage from 'localforage'


const VERSION = window.__APP_VERSION__ || 3.1


localforage.config({
    name: `CAC__${VERSION}`
})


window.__DB__ = db


export const db = localforage

export default db

