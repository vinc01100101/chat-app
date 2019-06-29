


module.exports = io=>{
  let usersCount = 0;
  let connectedSockets = {};
  let connectedUsers = [];
  
  io.on('connection',socket=>{
    console.log('USER: ' + JSON.stringify(socket.request.user))
    
    
    ++usersCount;
    const nameOfUser = socket.request.user.name;
    connectedSockets[nameOfUser] = socket;
    connectedUsers.push(nameOfUser)
    
    console.log(nameOfUser + ' has connected. Number of users: ' + usersCount);
    
    io.emit('user',{
      name: nameOfUser,
      online: true,
      usersCount,
      connectedUsers
    })
    
    socket.on('chat message',data=>{
      console.log("RECEIVED")
      if(data.target === 'Public'){
        io.emit('chat message',{
          name: nameOfUser,
          message: data.message,
          target: data.target
        })
      }else{
        if(connectedSockets[data.target]){
          connectedSockets[data.target].emit('chat message',{
            name: nameOfUser,
            message: data.message,
            target: nameOfUser
          })
          socket.emit('chat message',{
            name: nameOfUser,
            message: data.message,
            target: data.target
          })
        }else{
          socket.emit('chat message',{
            name: 'System',
            message: 'User is offline',
            target: data.target
          })
        }
        
      }
      
    })
    
    socket.on('disconnect',()=>{
      --usersCount;
      delete connectedSockets[nameOfUser];
      connectedUsers.splice(connectedUsers.indexOf(nameOfUser),1)
      io.emit('user',{
        name: nameOfUser,
        online: false,
        usersCount,
        connectedUsers
      })
    })
  })
  
  

}