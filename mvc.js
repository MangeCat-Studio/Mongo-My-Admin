var express = require('express');
var path = require('path'); //core module 
var databaseUrl = "localhost:27017/DB"; // default env
var bodyParser = require('body-parser');

// All possible mongo db objects 
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');

//configure app
var app = express(); 

// store all html files in views 
app.use(express.static(__dirname + '/views'));
// parses recived json input 
app.use(bodyParser.json());
// store all js in Scripts folder
app.use(express.static(__dirname + '/scripts'));


// Technology not needed but good practice, especailly when serval people are working on it 
app.get('/', function (req, res) {
	res.sendFile('index.html');
}); 

// listen for contactlist get request, aka transfers the contacklist in mongo to client
app.get('/databases', function (req, res) {
	// Default server is set to DB
	var db = new Db('DB', new Server('localhost', 27017));
	console.log("-- recived GET request --"); 
	db.open(function(err, db) {

	  // Use the admin database for the operation
	  var adminDb = db.admin();

	  // List all the available databases
	  adminDb.listDatabases(function(err, dbs) {
	    assert.equal(null, err);
	    assert.ok(dbs.databases.length > 0);
	    console.log(dbs);
	    res.json(dbs); 
	    db.close();
	  });
	});
}); 

// listen for contactlist get request
app.post('/collection', function (req, res) {
	console.log("-- recived collection post request --"); 
	var databaseName = req.body.contactItem ; 
	console.log('req contackItem: ' + databaseName);

	var db = new Db(databaseName, new Server('localhost', 27017));
	db.open(function(err, db) {
        // Grab a collection without a callback no safe mode
        // If collection does not exist, create collection 
        //var col1 = db.collection('DB');
        //col1.insertOne({"adress":{'street':'603 college','zipcode':'60525'}}); 
        // Wont create collection until first insert method 
        // col1('test', function(err, collection) {});
        // Check if the collection exists 
        // col1('test', {strict:true}, function(err, collection) {});
		db.listCollections().toArray(function(err, collections){
			for(var collection  of collections) {
			    console.log(collection); 
			}
			res.json(collections);
		})
    });
}); 

// listen for contactlist get request
app.post('/viewcollection', function (req, res) {
	console.log("-- recived viewcollection post request --"); 
	var databaseName = req.body.DB , collection = req.body.contactItem ; 
	var db = new Db(databaseName, new Server('localhost', 27017));

	db.open(function(err, db) {
	console.log(databaseName+": opened");
	var cursor = db.collection(collection).find();
		var array = [] ; 
		cursor.each(function(err, doc) {
			var isempty = false ; 
			// fix null item errors 
	    	assert.equal(err, null);
	    	if (!isempty && doc != null) {
	         console.log(doc);
	         array.push(doc); 
	    	}  
	    	else{
	    		isempty = true;
	    	}
	    	//fix race error
	    	if(isempty){
				res.json(array); 
	    	}
	   }); 
	}); 

});

	

// Implement a web server to listen to requests 
app.listen(4444, function(){
	console.log('ready on port 4444'); 
}); 

