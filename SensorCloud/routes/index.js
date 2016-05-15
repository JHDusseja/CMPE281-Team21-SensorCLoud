var express = require('express');
var router = express.Router();
var login = require('./login');
var users = require('./users');
var bill  = require('./bill');
var alarm = require('./alarm');
var register = require('./register');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.username)
    res.render('index', { title: 'Express', username: req.session.username});
  else
    res.render('index', { title: 'Express' });
});

router.get('/login',function(req, res, next){
  res.render('login', { title: 'Login' });
});

router.post('/checklogin', login.checkLogin);

router.get('/dashboard', users.dashboard);

router.get('/subscribedsensors', users.subscribedSensors);

router.get('/sensors', users.sensors);

router.get('/providesensorslist', users.providesensorslist);

router.get('/mysensors', users.mySensors);

router.post('/addSensor', users.addSensor);

router.get('/bill', bill.sample);

router.get('/total', bill.send);

router.get('/alarms',alarm.alarms);

router.get('/map', function(req,res){
  res.render('map');
});
router.get('/logout',login.logout);

router.get('/stationAdd', function(req,res){
  res.render('register');
});

router.post('/addHub', register.hubAdd);
router.get('/del',register.delHub);
router.get('/getPointer', bill.pointer);

module.exports = router;
