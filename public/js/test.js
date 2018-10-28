function userid(){
socket.emit('usrid',"{{user.username}}");
socket.emit('laymsgt',"{{user._id}}");
}
