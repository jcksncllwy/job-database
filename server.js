"use strict"
let express = require('express')

let app = express()

app.use(express.static('static'))

app.listen(3000, function () {
  console.log('Job Database app listening on port 3000!')
})