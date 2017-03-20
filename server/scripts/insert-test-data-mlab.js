let testData = require('../test-data.js')
let MongoClient = require('mongodb').MongoClient
let mongoURI = "mongodb://test:test@ds059145.mlab.com:59145/job-database"
let peopleCollection = "people"

MongoClient.connect(mongoURI, function(err, db) {
	if(err){
		return console.log(err)
	}
	console.log("Connected correctly to server")
	let coll = db.collection(peopleCollection)
	coll.insertMany(testData, function(err, result) {
		if(err){
			return console.log(err)
		}
		console.log("Inserted the following records")
		console.dir(testData)
		coll.find({}).toArray(function(err, docs) {
			console.log("Found the following records")
			console.dir(docs)
			db.close()
		});	
	});
})