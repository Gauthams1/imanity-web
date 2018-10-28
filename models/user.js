var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String
			},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
  date: {
    type: Date,
		default: Date.now()
  },
  ph: {
		type: [{}],
    
	},
  details:{
		type: [{}],

	}
});
UserSchema.index({'$**': 'text'});
//UserSchema.createIndex( { "$**": "text" } );

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(newUser);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

    	if(err) throw err;
    	callback(null, isMatch);
	});
}
