

module.exports = ()=>{
  console.log('js loaded!')

  const Utils = function(){
    this.ready = (fn)=>{
      if(typeof(fn)!=='function'){
        return;
      }
      if(document.readyState === 'complete'){
        return fn();
      }
      document.addEventListener('DOMContentLoaded',fn);
    };
  }
  
  const utils = new Utils();

  utils.ready(()=>{

    const form = document.getElementById('form');
    const inputs = document.getElementById('userInput');
    const chatbox = document.getElementById('chatlist');
    const usersCount = document.getElementById('usersCount');
    const logout = document.getElementById('disconnect')
    /*global io*/
    const socket = io();

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      socket.emit('chat message',inputs.value)
      inputs.value = "";
      inputs.focus();
    })
    
    logout.addEventListener('click',()=>{
      socket.disconnect();
      window.location.replace('/logout')
    })
    let status = '';
    socket.on('user',data=>{
      if(data.online){
        status = 'connected.'
      }else{
        status = 'disconnected.'
      }
      usersCount.innerHTML = "Online users: " + data.currentUsers;
      chatbox.innerHTML = chatbox.innerHTML + '<li style="color: blue">' + data.name + " has " + status + "</li>";
    })
    
    socket.on('chat message',(data)=>{
      console.log(data.name)
      chatbox.innerHTML = chatbox.innerHTML +  '<li>' + data.name + ': ' + data.message + '</li>'
    })
    
  })
}
