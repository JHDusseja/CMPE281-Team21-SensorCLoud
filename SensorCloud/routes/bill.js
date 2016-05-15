/**
 * Created by Nrsimha on 5/12/16.
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/SensorCloud";
//var requestsensors = require('request');



var sample = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){

        db.collection('stations').find({"sensors.subscribers":{$elemMatch: {userid:userId}}}).toArray(function(err,docs){
            console.dir(docs[0].sensors[0].subscribers);
            console.log(userId);
            res.render('bill',{userStations : docs, userid : userId});

        });
    });
    //res.render('subscribedsensors');
}
var pointer = function(req,res){
    var userId = req.session.userid;
    var results = new Array();
    mongo.connect(mongoURL, function(db){

        db.collection('stations').find().toArray(function(err,docs){

            var data = docs;
            for(var j=0;j<docs.length;j++){
                results.push({longitude: data[j].longitude, latitude: data[j].latitude, name: data[j].stationname, id: data[j]._id});

            }
            json_response = {
                "statusCode" : 200,
                "results" : results
            };
            res.send(json_response);
        });


    });
}
var send = function(req,res){
    var userId = req.session.userid;
    mongo.connect(mongoURL, function(db){
        db.collection('stations').find({"sensors.subscribers":{$elemMatch: {userid:userId}}}).toArray(function(err,docs){
            console.dir(docs[0].sensors[0].subscribers);
            console.log(userId);
            var total = 0;
            for(var i =0; i < docs.length; i++) {
                for (var j = 0; j < docs[i].sensors.length; j++) {
                    if (typeof (docs[i].sensors[j].subscribers) != 'undefined') {
                        for (var k = 0; k < docs[i].sensors[j].subscribers.length; k++) {
                            if (docs[i].sensors[j].subscribers[k].userid == userId) {
                                var h = (Math.abs(new Date() - docs[i].sensors[j].subscribers[k].timestamp) / 36e5).toFixed(2);
                                var x = docs[i].sensors[j].subscribers[k].api * .05;
                                total += (h * .6) + x;
                            }
                        }
                    }
                }
            }
            json_response = {
                "statusCode" : 200,
                "results" : total
            };
            res.send(json_response);

        });
    });
    //res.render('subscribedsensors');
}

module.exports.sample = sample;
module.exports.pointer = pointer;
module.exports.send = send;