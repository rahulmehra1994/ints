var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var compression = require('compression')
var express = require('express')
var app = new express()
var port = 3000

app.use(compression())
app.use(express.static('dist'))

var compiler = webpack(config)
app.use(
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  })
)
app.use(webpackHotMiddleware(compiler))

app.use(function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info(
      '==>   Listening on port %s. Open up http://localhost:%s/ in your browser.',
      port,
      port
    )
  }
})
