var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// link schema
var Linkschma = mongoose.Schema({
	usrid: {
		type: String
	},
	type: {
		type: String
	},
	data: {
		type: String
	},
	Disc: {
		type: String
	},
  details:{
		type: []
	},

});
// Linkschma.index({'$**': 'text'});
Linkschma.index( { usrid: 1, data: 1 }, { unique: true } )
var Link = module.exports=mongoose.model('link1', Linkschma);

module.exports.createLink = function(newLink,newuser, callback){

	        newLink.usrid = newuser._id;
	        newLink.Disc="starter of the link ,everything else will follow this ";
	        newLink.type="starter";
	        newLink.save(newLink);

}
module.exports.addLink = function(aLinkm,idn, callback){
	console.log(idn);
	        aLinkm.usrid = idn;
	        var query = { usrid: idn ,nxtid:null};
	        Link.findOne(query, callback);
	       //aLinkm.save()

}
module.exports.addFriend = function(aLinkm,idusr,idfrnd, callback){
		    aLinkm.usrid = idn;
		    aLinkm.data = idfrnd;
	        aLinkm.Disc ="new friend added ";
	       //aLinkm.save()

}
