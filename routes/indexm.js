var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', function(req, res){
res.json({user:req.user});
if(req.user)
console.log("available");
	});

//post from the home
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
			return next();
	} else {

		res.redirect('/usersm/login');

	}
}

module.exports = router;
