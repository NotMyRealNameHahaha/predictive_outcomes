const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

// Serve the files on port 3000.
app.listen(3000, '0.0.0.0', function () {
    console.log('Predictive Outcomes app listening on port 3000!\n')
})

app.get('/index/', function(req, res) {
    res.sendFile(
        path.join(__dirname, 'dist', 'index.html')
    )
})