var express = require('express')
var serveStatic = require('serve-static')
const path = require('path')
var app = express()
app.use(serveStatic(path.resolve(__dirname) + '/dist'))

var port = process.env.PORT || 5000
app.listen(port)
