'use strict';

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true
};

var c=document.getElementById("dispcan");
  var ctx=c.getContext("2d");
  c.height=600;
  c.width=600;
  var video = document.querySelector('video');


setInterval(function(){
ctx.drawImage(video,0,0,c.width,c.height);
//console.log(c.toDataURL('image/jpeg'),0.1);
socket.emit('video',{to: {{usrid}},data: c.toDataURL('image/jpeg')});

}, 70);







function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
