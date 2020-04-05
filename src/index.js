/**
 * SPA entry-point
 * We insert the absolute minimum amount of HTML required to encapsulate & kick-off the
 * Vue app & insert the stylesheets for external fonts/icons here
 * @see predictive_outcomes for details on the actual Vue application
 */

document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="app">
        <predictive-outcomes></predictive-outcomes>
    </div>
    `
)

import('./predictive_outcomes/app')


const insertStyleSheet = href =>
    document.head.appendChild(
        liftStyleSheet(href)
    )


const liftStyleSheet = href => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    return link
}


const externalStyleSheets = [
    'https://fonts.googleapis.com/css?family=Revalia&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
    'https://fonts.googleapis.com/css?family=Roboto+Mono:300,400,500',
    'https://cdn.materialdesignicons.com/4.7.95/css/materialdesignicons.min.css'
]

externalStyleSheets.forEach(insertStyleSheet)
