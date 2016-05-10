// var express = require('express');
// var router = express.Router();

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/SensorCloud";
var requeststations = require('request');

// var objectid = require('mongodb').ObjectID;
// mongo.BSONPure = require('bson').BSONPure;


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/foo', function(req, res, next) {
//   res.send('from users foo');
// });


var subscribedSensors = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){
        // var cursor = db.collection('stations').find({"sensors.subscribers":userid});
        // cursor.each(function(err, doc) {
        //     //assert.equal(err, null);
        //     if (doc != null)
        //         console.dir(doc);
        // });
        db.collection('stations').find({"sensors.subscribers":userId}).toArray(function(err,docs){
            console.dir(docs);
            res.render('subscribedsensors',{userStations : docs, userid : userId});
        });
    });
    //res.render('subscribedsensors');
}

var dashboard = function(req,res){
    var myarray = new Array();
    var stationsensors = new Array();
    var stationid, stationurl;
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db) {
        //db.collection('stations').find({"sensors.subscribers": userId}).toArray(function (err, docs) {
        db.collection('stations').find({"sensors.subscribers": 1},{sensors:{$elemMatch:{"subscribers" : 1}},"stationname":1, "stationurl":1}).toArray(function (err, docs) {
            console.dir(docs);
            // for (var i = 0; i < docs.length; i++) {
            //     stationid = docs[i]._id;
            //     stationurl = docs[i].stationurl;
            //     for (var j = 0; j < docs[i].sensors.length; j++) {
            //         if (typeof (docs[i].sensors[j].subscribers) != 'undefined') {
            //             for (var k = 0; k < docs[i].sensors[j].subscribers.length; k++) {
            //                 if (docs[i].sensors[j].subscribers[k] == userId) {
            //                     stationsensors.push(docs[i].sensors[j].sensorid);
            //                     break;
            //                     //myarray.push({"stationid": stationid, "stationurl": stationurl, "sensorid": docs[i].sensors[j].sensorid});
            //                     //myarray.push("hello");
            //                 }
            //             }
            //         }
            //     }
            //     myarray.push({"stationid": stationid, "stationurl": "localhost:9999", "sensors": stationsensors});
            //     stationsensors = new Array();
            // }
            for (var i = 0; i < docs.length; i++) {
                requeststations.post(
                    docs[i].stationurl+'/getSensorsData',
                    { json: { sensors: docs[i].sensors } },
                    function (error, response, body) {
                        if (!error) {
                            console.log(body)
                        }
                        else
                            console.log(error);
                    }
                );
            }
            // console.dir(myarray);
            // for(var x=0; x<myarray.length; x++){
            //
            // }
            res.render('dashboard');
        });
    });
}

var sensors = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){
        db.collection('stations').find().toArray(function(err,docs){
            res.render('sensors',{stations : docs, userid : userId, stationsformatted: JSON.stringify(docs)});
        });
    });
}

var providesensorslist = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){
        db.collection('stations').find().toArray(function(err,docs){
            res.json(docs);
        });
    });
}

var mySensors = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){
        db.collection('stations').find({"sensors.ownerid":userId}).toArray(function(err,docs){
            db.collection('stations').find().toArray(function(err,stations){
                res.render('mysensors',{userSensors : docs, stations: stations, userid : userId});
            });
        });
    });
}

var addSensor = function(req,res){
    var userId = req.session.userid;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var hubid = parseInt(req.body.hubid);
    var sensorurl = req.body.sensorurl;
    var sensortype = req.body.sensortype;
    var sensorstatus = req.body.sensorstatus;
    //var newsensor = new Array();
    //newsensor.push({"sensorid":4, "sensortype":sensortype, "ownerid":userId});
    var newsensor = {"sensorid":5, "sensortype":sensortype, "ownerid":userId};
    //, "subscribers":new Array()
    mongo.connect(mongoURL, function(db){
        console.dir(newsensor);
        console.log(hubid);
        // var obj_id = BSON.ObjectID.createFromHexString(hubid);
        //var hubidd = require('mongodb').ObjectID(hubid);
        // objectId = ObjectID(hubid.toString());
        db.collection('stations').updateOne({"_id": hubid},{ $addToSet: {sensors:  newsensor }}, function(err, results){
            if(!err) {
                console.log(results);
                res.redirect('mysensors');
            }
        });
        // .toArray(function(err,docs){
        //     db.collection('stations').find().toArray(function(err,stations){
        //         res.render('mysensors',{userSensors : docs, stations: stations, userid : userId});
        //     });
        // });
    });
}

// module.exports = router;
module.exports.subscribedSensors = subscribedSensors;
module.exports.sensors = sensors;
module.exports.providesensorslist = providesensorslist;
module.exports.mySensors = mySensors;
module.exports.addSensor = addSensor;
module.exports.dashboard = dashboard;

