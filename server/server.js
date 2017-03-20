"use strict"
let express = require('express')
let path = require('path')

let app = express()

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, '../client/static') ))

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})