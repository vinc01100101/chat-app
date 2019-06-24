


module.exports = io=>{
  let currentUsers = 0;
  
  io.on('connection',socket=>{
    console.log(JSON.stringify(socket.request.user))
    ++currentUsers;
    const nameOfUser = socket.request.user.name;
    console.log(nameOfUser + ' has connected. Number of users: ' + currentUsers);
    
    io.emit('user',{
      name: nameOfUser,
      online: true,
      currentUsers
    })
    
    socket.on('chat message',data=>{
      console.log("RECEIVED")
      io.emit('chat message',{
        name: nameOfUser,
        message: data
      })
    })
    
    socket.on('disconnect',()=>{
      --currentUsers;
      io.emit('user',{
        name: nameOfUser,
        online: false,
        currentUsers
      })
    })
  })
  
  

}