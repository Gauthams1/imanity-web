var mongoose = require('mongoose');

// link schema
var tagschma = mongoose.Schema({
	usrid: {
		type: String
	},from:{
    type: String
  },
  Fromn:{
    type: String
  },
	name: {
		type: String
	},
	type: {
		type: String
	},
	data:{
		type: [{}],
    default: [{}]   
	}
  ,
	Disc: {
		type: String
	},
	tocall: {
		type: String
	}
});

var Tags = module.exports=mongoose.model('tag1', tagschma);

module.exports.createTag1 = function(newTag,user,callback){

	        newTag.usrid = user._id;
	        newTag.save(newTag);

}
