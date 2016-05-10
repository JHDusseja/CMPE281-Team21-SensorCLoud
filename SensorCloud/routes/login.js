/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/SensorCloud";

exports.checkLogin = function(req,res){
	// These two variables come from the form on
	// the views/login.hbs page
	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	console.log(password +" is the object");
	var json_responses;

	mongo.connect(mongoURL, function(db){
		console.log('Connected to mongo at: ' + mongoURL);
		var col = db.collection('users');
		// col.find({limit:1})
		col.find({username : username, password : password}).limit(1).toArray(function(err, user){
			if (user.length > 0) {
				// This way subsequent requests will know the user is logged in.
				console.log(user);
				req.session.userid = user[0]._id;
				req.session.username = user[0].username;
				req.session.usertype = user[0].usertype;
				console.log(req.session.username +" is the session");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
};

//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

