
module.exports = function(server) {
  var Message = require('../models/message');
  var User = require('../models/user');
  var Link = require('../models/link');
  var Tags = require('../models/tags');
  var GooglePlaces = require('google-places');
  var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDkH0dKcdQO_3flkGri9JA7vJAT2dWYM-8'
  });
  var ObjectID = require('mongodb').ObjectID;
  var places = new GooglePlaces('AIzaSyDkH0dKcdQO_3flkGri9JA7vJAT2dWYM-8');
  const webpush = require('web-push');
  var io = require('socket.io')(server, {
    transports: ['polling', 'websocket'],
    allowUpgrades: true
  });
  users = [];sokt =[];usersp=[];webp=[];
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    "BDZTGzgyvbNav5NOqJR6XXKHd7XqWTjg0vFRFQKbS-aJsEbO7ArWegYDNsaRvOf3MTEMruOLD0pui5R-KOEsMj8",
    "TGqtWm34LGnvkb-lb0qzueHMxs6tpDMmx_0Yr64z_sU"
  );
  webpush.setGCMAPIKey('AIzaSyBFzXEGPlruWvL56H9dIMsCKTBnHfSA0uM');

  io.on('connection', function(socket){

socket.on('directiontestt',function(data){
    googleMapsClient.directions({
    origin:data.ori,
    destination:data.des
   }, function(err, response) {
    if (!err) {
        emid(data.usr,'directiontest',response.json)
    }
   });
  })
  // search for places
socket.on('search1',function(data){var temp1=[];
      User.find( {$and:[{"details.data":{'$regex' : data.search, '$options' : 'i'}},{"details.type":"loc","details.data.lat":{ $gt:(data.lat-1),$lt:(data.lat+1)},"details.data.long":{ $gt:(data.long-1),$lt:(data.long+1)}}]},function(err,us1){

        temp1.push({lat:data.lat,long:data.long,type:"location"})
        if(us1)
      {  for (var i = 0; i < us1.length; i++) {
        temp1.push({_id:us1[i]._id,name:us1[i].name,username:us1[i].username,details:us1[i].details,ph:us1[i].ph,email:us1[i].email,type:"found"})
        }}
          places.search({keyword:data.search,location:[data.lat,data.long],radius:data.dist}, function(err, response) {
        temp1.push({result:response.results,type:"not found"})
      //  emid(data.usr,'search1r',temp1);
        });
        places.search({type:data.search,location:[data.lat,data.long],radius:data.dist}, function(err, response) {
      temp1.push({result:response.results,type:"not found"})
      emid(data.usr,'search1r',temp1);
      });

});
})
//search for files
socket.on('searchinteractiont',function(data){
  queries=JSON.parse(data.query)

  temp1=[],temp2=[];
  temp1.push({"details.data":{'$regex' : data.id+"#"+data.user, '$options' : 'i'}})
  temp2.push({"details.data":{'$regex' : data.user, '$options' : 'i'}})
  for (var i = 0; i < queries.length; i++) {
      temp1.push({"details.data":{'$regex' :   queries[i], '$options' : 'i'}})
      temp2.push({"details.data":{'$regex' :   queries[i], '$options' : 'i'}})
  }
  if(queries.length==0)
  return;
  Link.find( {$or:[{$and:temp1},{$and:temp2}]},function(err,result){
    if(!result)
    {return ;
    }

    emid(data.user,'searchinteraction',result)
  })
})
//personal uploads
socket.on('linktypet',function(data){
      Link.find({usrid:data.id,type:"upload"},function(err,l1){
        emid(data.usr,'linktype',l1);

      })
    })
//shared in interaction
socket.on('sharint',function(data){
        Link.find({"details.type":"#sh1","details.data":data.usn},function(err,l1){
          temp=[];temp2=0;

          for (var i = 0; i < l1.length; i++) {
            temp.push({details:l1[i].details,data:l1[i].data,from:l1[i].usrid,time:parseInt(ObjectID(l1[i]._id).toString().substr(0,8), 16)*1000})
          }emid(data.usn,'shareinter',temp);})})
//find by id and sent back
socket.on('recdett',function(data){
  User.findById(data.id,function(err,us1){
    var tempa={name:us1.name,data:us1.details,ph:us1.ph||"[]"};
      emid(data.username,'recdet',tempa);
  })
})
//push message registration
socket.on("gcmtest",function(data){
                data1=data.subobj;
                data2=data.data;
                    if(funindex(usersp,data2) >= 0)
                      {

                      var ind=funindex(usersp,data2);//usersp.indexOf(data2)
                      usersp.splice(ind, 1);
                      webp.splice(ind, 1);


                      }
                    if(funindex(usersp,data2)==-1)
                        {   usersp.push(data2);
                            webp.push(data1);
                        }

                    })
// push message unsubscribe
socket.on("gcmtestunsub",function(data){

          var ind=funindex(webp,data);
          usersp.splice(ind, 1);
          webp.splice(ind, 1);
          console.log("unsubscribe event goin on "+webp.length);
})
// user registration
socket.on('usrid', function(data){
        users.push(data);
        sokt.push(socket);
        var cutoff = new Date();
        cutoff.setDate(cutoff.getDate()-1);
        console.log(users);
        Message.remove({ crtd : {$lte: cutoff} },function(err,us1){
        }); });
//messaging
socket.on('msg', function(data){
            var notifi=msgnot(usersp,data.to);
            for (var i = 0; i < notifi.length; i++) {//notifi[i]
              var obj=JSON.stringify({from:data.from,data:data.data,pp:data.avatar,usr:usersp,type:data.type,disc:data.disc});
              webpush.sendNotification(webp[notifi[i]],obj).then(function(){});
            }


          var newTag = new Message({
              		to: data.to,
              		data: data.data,
              		Fromn: data.fromn,
              		usrid: data.user,
                  from: data.from,
                  type:data.type,
                  avatar:data.avatar
                  });
                  console.log(newTag);
                  if(users.indexOf(data.to)>=0)
                  emid(data.to,'msg-usr',{data:data.data,uname:data.usrnm,duname:data.fromn,avatar:data.avatar,id:newTag._id,obj:usersp});
            newTag.save();
       });
//video stream
socket.on('video', function(data){
        if(users.indexOf(data.to)>=0)
        emid(data.to,'videor',data.data);
     });
    socket.on('laymsgt',function(data){
      User.findById(data,function(err,us1){if(data){
      linkoffriends = [];
      Link.find( {usrid: data } ,function(err,us2){
      for (var i = 0; i < us2.length; i++) {
        if (us2[i].type=="friend") {
          linkoffriends.push({'Disc': us2[i].data,'type':"propic"});
        }}
        linkoffriends.push({Disc:us1.username,type:"propic"})
        Link.find({ $or: linkoffriends },function(err,us3){
        emid(us1.username,'laymsgr',{us:us2,us1:us3});
      })})}})});
//message for user retreve
socket.on('usermsg',function(data){
      	Message.find( {$or: [ {usrid: data.id} , {to: data.username} ]},function(err,us1){
        Message.find( {to:data.username,stamp:"notread"},function(err,us2){
        emid(data.username,'usermsgr',{u1:us1,u2:us2});
          });});});
//updating read or not read
socket.on('msgviewcurrn',function(data){
       if(data.to&&data.fm)
       {      Message.find({Fromn:data.fm,to:data.to}).limit(1).sort({$natural:-1}).exec(function(err,us1){
        Message.updateMany({Fromn:data.fm , to:data.to },{stamp:"read"},function(err,us2){
        });});}})
//tags sent
socket.on('tagr',function(data){
       Tags.find({usrid:data.id},function(err,us1){
         emid(data.username,'tagt',us1);
       })
     })
//adding link
socket.on('link1',function(data){
       Link.findOne({usrid:data.usrid,type:data.type},function(err,us1){
        if(us1) {  Link.findOneAndUpdate({usrid:data.usrid,type:data.type},{data:data.data,  Disc:data.username},function(){});  }
        else { var newLink = new Link({usrid:data.usrid,
            type:data.type,
            data:data.data,
            Disc:data.username
          }
        );	newLink.save();
        }});
      });
//disconnection
socket.on('disconnect', function() {
        console.log('Got disconnect!');
      var pointer= g(sokt,socket);
      for (var k = pointer.length-1; k>=0; k--) {
        sokt.splice(pointer[k], 1);
        users.splice(pointer[k], 1);
        }
      console.log(users);
      });

});
// returnes indexes
function g(arr, val) {
             var indexes = [], i = -1;
             while ((i = arr.indexOf(val, i+1)) != -1){
                 indexes.push(i);
             }
             return indexes;
      }
// emits to a custom member
function emid(ind,tag,info){
       var count=g(users,ind);
       for(i=0;i<count.length;i++)
       {sokt[count[i]].emit(tag,info);
         }
         console.log(ind+"   "+tag);
     }
// function for stringifing
function funindex(arr1,qur) {
           for (var i = 0; i < arr1.length; i++) {
             if(JSON.stringify(arr1[i]) === JSON.stringify(qur) )
                return i;
         }
           return -1
         }
//  pushing temporary variable
function msgnot(arr,qur){
           var temporaryvariable=[];
           for (var i = 0; i < arr.length; i++) {
             if(arr[i].uname==qur)
             temporaryvariable.push(i);
           }       return temporaryvariable;
}
}
