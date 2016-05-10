var express = require('express');
var router = express.Router();
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/SensorCloudStation";
var requestsensors = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getSensorsData', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    console.log(req.body.sensors);
    mongo.connect(mongoURL, function(db){
        db.collection('sensors').find().toArray(function(err,docs){
            for(var i in req.body.sensors){
                for(var j in docs[0].sensors){
                    if(docs[0].sensors[j].sensorid == req.body.sensors[i].sensorid){
                        requestsensors(
                            'http://erddap.axiomdatascience.com/erddap/tabledap/cencoos_sensor_service.json?time,station,parameter,unit,value&time>=2016-05-08T16:50:00Z&station=%22'+docs[0].sensors[j].sensorurl+'%22&parameter=%22Wind%20Speed%22&unit=%22knot%22',
                            function (error, response, body) {
                                if (!error) {
                                    console.log(body)
                                }
                                else
                                    console.log(error);
                            }
                        );
                    }
                }
            }
        });
    });
});

module.exports = router;
