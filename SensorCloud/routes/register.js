var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/SensorCloud";
//var requestsensors = require('request');



var hubAdd = function(req,res){
    var userId = req.session.userid;
    var name = req.body.name;
    var id = parseInt(req.body.id);
    var lon = req.body.lon;
    var lat = req.body.lat;
    var url = req.body.url;

    mongo.connect(mongoURL, function(db){

        // db.collection('stations').find({"sensors.subscribers":{$elemMatch: {userid:userId}}}).toArray(function(err,docs){
        //     console.dir(docs[0].sensors[0].subscribers);
        //     console.log(userId);
        //     res.render('bill',{userStations : docs, userid : userId});
        //
        // });

        db.collection('stations').insert({_id: id, stationname:name, stationurl: url, sensors:1,longitude: lon, latitude: lat}, function(err, doc){
                console.log("inserted");

            res.render("map");

            });

        });

    //res.render('subscribedsensors');
}
var delHub = function(req,res){

    var id = parseInt(req.query.id);
    console.log(id);
    mongo.connect(mongoURL, function(db){

        // db.collection('stations').find({"sensors.subscribers":{$elemMatch: {userid:userId}}}).toArray(function(err,docs){
        //     console.dir(docs[0].sensors[0].subscribers);
        //     console.log(userId);
        //     res.render('bill',{userStations : docs, userid : userId});
        //
        // });

        db.collection('stations').remove({_id: id}, function(err, doc){
            console.log("inserted");

            res.render("map");

        });

    });

    //res.render('subscribedsensors');
}

module.exports.hubAdd = hubAdd;
module.exports.delHub = delHub;


/**
 * Created by Nrsimha on 5/13/16.
 */
