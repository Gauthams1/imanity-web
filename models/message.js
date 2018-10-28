var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// link schema
var msgschma = mongoose.Schema({
	usrid: {
		type: String
	},
	to: {
		type: String
	},
  type:{
		type: String
	},
	data: {
		type: String
	},
	Fromn: {
		type: String
	},
	stamp: {
		type: String,
    default: "notread"
	},
	crtd: {
		type: Date,
		default: Date.now()
},
from: {
	type: String
},
avatar:{
  type:String
}
});

var Link = module.exports=mongoose.model('msg', msgschma);
