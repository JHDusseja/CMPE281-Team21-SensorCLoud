var express = require('express');
var router = express.Router();
var login = require('./login');
var users = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.username)
    res.render('index', { title: 'Express', username: req.session.username});
  else
    res.render('index', { title: 'Express' });
});

router.get('/login',function(req, res, next){
  // res.send('hello');
  res.render('login', { title: 'Login' });
});

router.post('/checklogin', login.checkLogin);

router.get('/dashboard', users.dashboard);

router.get('/subscribedsensors', users.subscribedSensors);

router.get('/sensors', users.sensors);

router.get('/providesensorslist', users.providesensorslist);

router.get('/mysensors', users.mySensors);

router.post('/addSensor', users.addSensor);

module.exports = router;
