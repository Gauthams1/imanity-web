var express = require('express');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var User = require('../models/user');
var Link = require('../models/link');
var Tags = require('../models/tags');
var Message = require('../models/message');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
// Register
router.get('/register', function(req, res){
	res.render('register');
});

//interaction
router.get('/interaction',ensureAuthenticated, function(req, res){
	res.render('interaction');
 });
 //next
 //tags
router.get('/', function(req, res){
	if(req.query.usr)         //(1)
	{
     User.findOne({username:req.query.usr },function(err,us1){
	   Tags.findOne({ usrid: us1._id,name: req.query.tag},function(err,us2){
       if (req.user) {
         Link.find({usrid:us1._id,type:"upload","details.data":(req.user._id+"#"+req.user.username)},function(err,us3){
           if(us3.length>0)
           res.json({tagsout: us1,info1: us3,info2:us2,act:req.query.tag,layout:'usr2'});
           else {
             res.json({tagsout: us1,act:req.query.tag,layout:'usr2'});
           }
         })

       }
       else {
         res.json({tagsout: us1,act:req.query.tag,layout:'usr2'});
       }

	});});}

   else if(!req.isAuthenticated())    //(2)
   {
	res.redirect('/usersm/login');
  }

   else                          //(3)
   {
   if(req.query.del)
     {
       Tags.findByIdAndRemove({_id:req.query.del},function(err,us){
         var ten=0;
         if(!us)
        { Tags.findOne({data:{$elemMatch: {oid:ObjectID(req.query.del)}}},function(err,us1){
          var temp=us1.data;
          for (var i = 0; i < temp.length; i++) {
            if(temp[i].oid==req.query.del)
            ten=temp[i];
          }
        })
            Tags.update({data:{$elemMatch: {oid:ObjectID(req.query.del)}}},{$pull: {"data":{"data":"hello","tocall":"gauthams1" }}},function(err,us2){})
      }
      });

    }
		  User.findById(req.user._id,function(err,us1){
	   Tags.find({usrid:req.user._id},function(err,us2){
		res.json({tagsout: us2 , tagath: req.user,hst: req.get('host')});
	  });});}});
//login get method
router.get('/login', function(req, res){
	if(req.isAuthenticated())
	res.redirect('/m');
	else {
		res.render('login',{layout:'user-tag'});
	}

});
//logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/usersm/login');
});
//search
router.get('/search', ensureAuthenticated, function(req, res){
	res.render('search');
});
//tags
router.get('/tag', ensureAuthenticated, function(req, res){
  console.log("called");
	Tags.find({usrid: req.user._id},function(err,us1){//same tag can be used again for multiple action in tags
					res.json(us1);
	});

	});
// sent messages
router.get('/smsg', ensureAuthenticated, function(req, res){
	if(req.query.del)
	{
  Message.findByIdAndRemove(req.query.del,function(err,use){
	});
  res.redirect('/usersm/smsg');
	}
	else{
		Message.find( {$or: [ {usrid: req.user._id} , {to: req.user.username} ]},function(err,us1){
  Link.find({usrid:req.user._id , type:"friend"},function(err,us2){
  res.render('sentmsg',{usrs: us1,usrknn: us2});
  	});});}});
//settings
router.get('/setting', ensureAuthenticated, function(req, res){
	res.render('setting',{user:req.user});
	});
  router.post('/rmsg', ensureAuthenticated, function(req, res){

    var pass = req.body.pass;
    var pass2 = req.body.pass2;
    bcrypt.compare(pass,req.user.password,function(err,ismatch){
      if(ismatch)
      {	bcrypt.genSalt(10, function(err, salt) {
      	    bcrypt.hash(pass2, salt, function(err, hash) {
      	       User.findOneAndUpdate({_id:req.user._id},{password:hash},function(){});
      	    });
      	});

      }
      else {

      }
    })

  	res.render('recmsg',{user:req.user});
  	});
//test
router.get('/test', function(req, res){
  // Link.find({usrid:req.user._id , type:"friend"},function(err,us1){
	// 	//res.render('test',{usrv:us1,teststat1:req});
  //
	// })
  res.json({hello:"hello"})
  console.log('\n\n\n\n\n\n\n\n');
  console.log(req.user);
});
// post----------------------------------------------------------------------------------------------------------------------------------------

//[post tag
router.post('/tag',function(req,res){
	var name = req.body.name;
  name=name.trim();
	var type = req.body.type;
	var data = req.body.data;
	var tocall = req.body.tocall||null;
	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('type', 'type is required').notEmpty();
	var errors = req.validationErrors();
 	if(errors){
		res.render('tags',{
			errors:errors
		});}
		else {
      if (type==="rlink") {
        Tags.find({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username, "data.type" : "rlink"},function(err,us1){
          if(us1.length==0)
        Tags.update({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username},{$push: { data: {data:data,type: type,oid:new ObjectID() } }},{upsert:true},function(){})
        else {
          Tags.update({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username, "data.type" : "rlink"},{'data.$.data':data},{upsert:true},function(){})
        }
          ;}) ;
        }
      else
       {
      Tags.find({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username, data:{$elemMatch: {data: data,tocall:tocall,type:type }}},function(err,us1){
        if(us1.length==0){
          Tags.update({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username},{$push: { data: {data:data,type: type,tocall:tocall,oid:new ObjectID()} }},{upsert:true},function(){})
        }
      else {  Tags.update({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username,data:{$elemMatch: {data: data,tocall:tocall,type:type }}},{'data.$.data':data,'data.$.type':type,'data.$.tocall':tocall},{upsert:true},function(){})
      }})}

		}});
//post tagbulk
router.post('/tagbulk',function(req,res){
	var name = req.body.name;
  name=name.trim();
	var type = req.body.type;
	var data = req.body.data;
  var tocall = req.body.tocall||null;
	req.checkBody('name', 'name is required').notEmpty();
	req.checkBody('type', 'type is required').notEmpty();
	var errors = req.validationErrors();
 	if(errors){
		res.render('tags',{
			errors:errors
		});}
		else {
      var data1=JSON.parse(data);
          Tags.find({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username, type : type },function(err,us1){
          Tags.remove({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username, type : type},function(){});
        for (var i = 0; i < data1.length; i++)
    {       Tags.update({name:name,usrid:req.user._id,from:req.user.name,Fromn:req.user.username, type : type},{$push: { data: data1[i] }},{upsert:true},function(){})
    }
  })}
  }
  );
//linkup
router.post('/linkup',function(req,res){
 if(req.body.data)
  {var dataparsed=JSON.parse(req.body.data);
    var name=req.body.name;
    console.log(name);
    Link.find({usrid:ObjectID(req.user._id),data:name},function(err,us1){
    for (var i = 0; i < dataparsed.length; i++) {
      if(us1.length==0)
      {Link.update({usrid:ObjectID(req.user._id),data:name,type:req.body.type},{$push: { details:dataparsed[i] }},{upsert:true},function(){})
      }
      else {Link.update({usrid:ObjectID(req.user._id),data:name,type:req.body.type,details:{$elemMatch: { id: dataparsed[i].id,type:dataparsed[i].type}}},{'details.$.data':dataparsed[i].data,'details.$.type':dataparsed[i].type,'details.$.id':dataparsed[i].id},function(){})
      }
      }
      })
      }

      else if (req.body.del) {
        Link.findOne({usrid:req.user._id,_id:ObjectID(req.body.del)},function(err,us1){
          if(us1)
          Link.remove({usrid:req.user._id,data:us1.data},function(){});
        })

      }
      else if (req.body.pullall) {
        var datapull=JSON.parse(req.body.pullall);
        var name=req.body.name;
        Link.update({usrid:ObjectID(req.user._id),type:req.body.type},{$pull: { details: {data:datapull.data,type:datapull.type}}},function(){})
      }
      else if (req.body.pushall) {
        var datapull=JSON.parse(req.body.pushall);
        var id=req.body.id;
        Link.update({usrid:ObjectID(id),type:req.body.type},{$pull: { details: {data:datapull.data,type:datapull.type}}},function(){console.log("pulled the document");
        Link.update({usrid:ObjectID(id),type:req.body.type},{$push: { details: {data:datapull.data,type:datapull.type,id:datapull.id}}},function(){console.log("pushed the document");})
      })

      }

})
//detailup
router.post('/detailup',function(req,res){
  var data=JSON.parse(req.body.data);
  User.find({_id:ObjectID(req.user._id),details:{$elemMatch: {id:data.id,type:data.type}}},function(err,us1){
    if(us1.length==0)
    {  User.update({_id:ObjectID(req.user._id)},{$push: { details: data }},function(){})
    }
    else { User.update({_id:ObjectID(req.user._id),details:{$elemMatch: {id:data.id,type:data.type}}},{'details.$.data':data.data,'details.$.type':data.type,'details.$.id':data.id},function(){})
    }
  })

})
//phonenumber
router.post('/phoneup',function(req,res){
  var data=JSON.parse(req.body.data);
  console.log(data);
  User.update({_id:ObjectID(req.user._id)},{ph:data},function(err,us1){
    console.log("done");
    })
    res.json({status:"done"})
  })
router.post('/phonefind',function(req,res){
    var data=JSON.parse(req.body.data);
    var temp1=[];
    var temp3=[];
    for (var i = 0; i < data.length; i++) {
      temp1.push({ph:data[i]});
    }
    User.find({$or:temp1},function(err,us1){
      var temp2=[];
      for (var j = 0; j < us1.length; j++) {
        us1[j].password="";
        temp2.push(us1[j]);
        }
        us1.forEach((item) => {
          Link.update({ usrid:req.user._id, type: "friend", data: item.username, Disc: "new friend" },{Disc:"new friend"},{upsert:true},function(err,us2){});
        })
        res.json({status:"done",users:temp2})
      })
    })
//link
router.post('/link',function(req,res){
	 var frnd=req.body.frnd;
		if(frnd)
	{
	Link.find({usrid: req.user._id , data:frnd},function(err,us){
		if(!us.length)
		{var lna = new Link({
		usrid:req.user._id,
		type: "friend",
		data: frnd,
		Disc: "new friend"
	});lna.save(lna);};});	}});
//todo
router.post('/todo',function(req,res){
	var todo = req.body.options;
	});
//searching
router.post('/search',function(req,res){
	    var ser = req.body.search;
	  req.checkBody('search', 'search is required').notEmpty();
		var errors = req.validationErrors();
		User.find({$text: {$search: '/'+ser+'/'}},function(err,user){
          linkoffriends = [];
          for (var i = 0; i < user.length; i++) {
          linkoffriends.push({'Disc': user[i].username,'type':"propic"});
          }
          Link.find({ $or: linkoffriends },function(err,us3){
            res.render('search',{us:user,pp:us3});
          });	});	});
          router.post('/register', function(req, res){
          	var name = req.body.name;
          	var email = req.body.email;
          	var username = req.body.username;
          	var password = req.body.password;
          	var password2 = req.body.password2;

          	// Validation
          	req.checkBody('name', 'Name is required').notEmpty();
          	req.checkBody('email', 'Email is required').notEmpty();
          	req.checkBody('email', 'Email is not valid').isEmail();
          	req.checkBody('username', 'Username is required').notEmpty();
          	req.checkBody('password', 'Password is required').notEmpty();
          	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);



          	var errors = req.validationErrors();

          	if(errors){
          		res.json({
          			errors:errors
          		});
          	} else {
          		var newUser = new User({
          			name: name,
          			email:email,
          			username: username,
          			password: password,
          		});
              User.createUser(newUser, function(err, user){
          			if(err) throw err;
          					});

            		res.json({status:"done"});
          	}
});
//login post
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true})
  );
passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

  passport.serializeUser(function(user, done) {
  done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
  });
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/usersm/login');
	}
  }

module.exports = router;
