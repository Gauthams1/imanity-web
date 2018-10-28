var CACHE_NAME = 'v2';
var urlsToCache = [
  "/css/bootstrap.min.css",
  "/css/style.css",
  "/css/bootstrap.css",
  "/js/client.js",
  "/css/codemdl.css",
  "/css/style1.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "/socket.io/socket.io.js",
  "/js/bootstrap.min.js",
  "/images/prj57-48x48.png",
  "/fonts/glyphicons-halflings-regular.woff2",
  "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
  "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"

];

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log("[serviceworker] install");
  event.waitUntil(  caches.open(CACHE_NAME).then(function(cache){
    //console.log(urlsToCache);
      return cache.addAll(urlsToCache);
    }));


});
self.addEventListener('activate', function(event) {
  // Perform install steps
  //console.log("[serviceworker] activate");
  event.waitUntil(
    caches.keys().then(function(name){
      return Promise.all(name.map(function(cname){
      if(cname!==CACHE_NAME)
      return caches.delete(cname);
      }))
    })
  )


});


self.addEventListener('fetch', function(event) {
  // Perform install steps

  event.respondWith(
caches.match(event.request).then(function(response){
  if (response)
  {//console.log("[serviceworker]respond found for "+event.request.url);
    return response;
  }
//  console.log("[serviceworker] respond not found for "+event.request.url);
  return fetch(event.request);

})
  )

});
self.addEventListener('push', function(event) {
  var text =event.data.json();
  var title = text.from;
  var body = text.data;
  var icon = text.pp;
  var type = text.type;
  //console.log("the text ");
  //console.log(text);
  const myFirstPromise = new Promise((resolve, reject) => {
    //console.log(type);
    if(type=="loc"){
  //    console.log("location sticker");
      self.registration.showNotification(title, {
        icon:icon,
        body:text.disc.kl,
        image:text.disc.lnk,
          badge:"images/prj57-48x48.png"
      })
    }
    else if(type=="din")
    {
      self.registration.showNotification(title, {
        body: body,
        icon:icon,
        badge:"images/prj57-48x48.png"
        })
    }
    else if(type=="clreq")
    {
      self.registration.showNotification(title, {
        body:"call"+body,
        icon:icon,
        tag:"call",
          badge:"images/prj57-48x48.png"
        })
    }
    else {
      self.registration.showNotification(title, {
        body: body,
        icon:icon,
          badge:"images/prj57-48x48.png"
        })
    }
  })
  event.waitUntil(myFirstPromise);
});

self.onnotificationclick = function(event) {
//  console.log('On notification click: ', event.notification);
  event.notification.close();

const notcl = new Promise((resolve, reject) => {

  if(event.notification.image!="")
  {
    return clients.openWindow(event.notification.image);

  }
   else if (event.notification.tag=="call")
  {
    return clients.openWindow("tel:"+event.notification.body);

  }
  else {
    clients.matchAll({
      type: "window"
    }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow('/');
    })
  }


})

  event.waitUntil(notcl);
};


function disp(lat,long,zoom="18")
{
var cen="http://maps.google.com/maps/api/staticmap?sensor=false&center=" + lat + "," + long +   "&zoom="+zoom+"&size=512x512&markers=color:green|label:X|" + lat+ ',' + long;
return '<image width="100%" src="'+cen+'"></image>';

}
