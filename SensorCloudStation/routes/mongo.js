/**
 * Created by Jayesh on 4/24/2016.
 */

var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */

exports.connect = function(url, callback){
    mongoClient.connect(url, function(err, _db){
        //assert.equal(null, err);
        if (err) { throw new Error('Could not connect: ' + err); }
        db = _db;
        connected = true;
        //console.log(connected + " is connected!");
        callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
// exports.collection = function(name){
//     if (!connected) {
//         throw new Error('Must connect to Mongo before calling "collection"');
//     }
//     return db.collection(name);
//
// };
