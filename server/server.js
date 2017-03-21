"use strict"
let express = require('express')
let bodyParser = require('body-parser')
let path = require('path')

let MongoClient = require('mongodb').MongoClient
let mongoURI = "mongodb://test:test@ds059145.mlab.com:59145/job-database"
let peopleCollection = "people"

let app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.json())

if(process.env.NODE_ENV=='development'){
	var webpackDevMiddleware = require("webpack-dev-middleware"),
		webpack = require("webpack"),
		webpackConfig = require("../webpack.config.js")

	var compiler = webpack(webpackConfig)

	app = app.use(webpackDevMiddleware(compiler, {
	  publicPath: webpackConfig.output.publicPath,
	  watchOptions: {
	      poll: 1000
	  }
	}))
}

/*
This line for the static file server needs to come after
the webpack-dev-middleware setup
*/
app.use(express.static(path.join(__dirname, '../client/static') ))

app.get('/api/data', function(req, res){
	console.log('API ENDPOINT CALLED: /api/data ')
	MongoClient.connect(mongoURI, function(err, db) {
		if(err){
			res.send(err)
		}		
		console.log("*	Connected correctly to MongoDB server")
		let coll = db.collection(peopleCollection)
		coll.find({}).toArray(function(err, docs) {
			console.log("*	Found "+ docs.length + " matching records")			
			res.send(docs)
			db.close()
		})
	})

})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})