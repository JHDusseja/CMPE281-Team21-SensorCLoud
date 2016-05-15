/**
 * Created by ASHIK'S PC on 5/13/2016.
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/SensorCloud";
var requeststations = require('request');


var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var alarms = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){
        // var cursor = db.collection('stations').find({"sensors.subscribers":userid});
        // cursor.each(function(err, doc) {
        //     //assert.equal(err, null);
        //     if (doc != null)
        //         console.dir(doc);
        // });
        db.collection('users').find({"_id":userId}).toArray(function(err,docs){
            console.dir(docs);
            res.render('alarms',{users : docs, userid : userId});
        });
    });
    //res.render('subscribedsensors');
}
module.exports.alarms = alarms;