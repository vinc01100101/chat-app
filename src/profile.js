const React = require('react');
const ReactDOM = require('react-dom');
//const clientEmits = require('./clientEmits');
let socket;


class NewTabPrototype {
  constructor(btnName,setActive,activeState){
    this.jsx = (
      <button key={btnName} className = {btnName == activeState ? 'tabBtn activeBtn' : 'tabBtn'} onClick={(e)=>{setActive(btnName)}}>
        {btnName}
      </button>
    )
  }
}



class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ActiveBtn: "Public",
      Tabs: ["Public"],
      ArrayUsers: [],
      UsersCount: 0,
      ChatEntries: {"Public": []},
      UserInput: ''
    }
    
    this.handleUsersClick = this.handleUsersClick.bind(this);
    this.setActive = this.setActive.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.generateTabs = this.generateTabs.bind(this);
  }
  
  componentDidMount(){
    /*global io*/
    socket = io();
    
    socket.on('user',data=>{
      let message = '';
      if(data.online){
        message = 'connected';
      }else{
        message = 'disconnected'
      }
      this.setState({
        ArrayUsers: data.connectedUsers,
        UsersCount: data.usersCount,
        ChatEntries: $.extend(true,this.state.ChatEntries,{"Public": this.state.ChatEntries.Public.concat('Log: ' + data.name + " has " + message)})
      })
    })
    socket.on('chat message',data=>{
      this.setState({
        ChatEntries: $.extend(true,this.state.ChatEntries,{[data.target]: (this.state.ChatEntries[data.target] ? this.state.ChatEntries[data.target].concat([data.name + ': ' + data.message]) : [data.name + ': ' + data.message])})
      })
      
      
    })
  }
  
  componentDidUpdate(){
    
  }
  
  handleUsersClick(e,name){
    const tabsTemp = this.state.Tabs,
          me = document.getElementById('me').innerHTML;
    
    if(tabsTemp.indexOf(name) < 0 && name !== me){
      this.setState({
        Tabs: this.state.Tabs.concat([name])
      })
      this.setActive(name)
    }
    
  }
  
  setActive(name){
    console.log("CLICKED!!")
    this.setState({
      ActiveBtn: name
    })
    
  }
  
  sendMessage(){
    const message = this.state.UserInput;
    socket.emit('chat message',{
      target: this.state.ActiveBtn,
      message: message
    })
    
    this.setState({
      UserInput: ''
    })
  }
  
  handleInputChange(e){
    this.setState({
      UserInput: e.target.value
    })
  }
  
  generateTabs(){
    return this.state.Tabs.map(name=>{
      return new NewTabPrototype(name,this.setActive,this.state.ActiveBtn).jsx
    })
  }
  
  render(){
    return (
      <div>
        <a href='/logout' onClick={()=>{socket.disconnect()}}>Logout</a>
        <h4>Online users: {this.state.UsersCount}</h4>
        <ul className='usersList'>
          {this.state.ArrayUsers.map((user,i)=><li key={i} onClick={()=>{this.handleUsersClick(event,user)}}>{user}</li>)}
        </ul>
        <div className='tabsContainer'>
          {this.generateTabs()}
        </div>
        
        <h4>Chat with: {this.state.ActiveBtn}</h4>
        <div id='chatBox'>
          <ul>
            {this.state.ChatEntries[this.state.ActiveBtn] ?
              this.state.ChatEntries[this.state.ActiveBtn].map(
                (d,i)=>
                  <li
                    key={i}
                    style={{color: (()=>{
                    let ret = '';
                    switch(d.split(' ')[0]){
                      case 'System:': ret = 'red';
                        break;
                      case 'Log:': ret = 'blue';
                        break;
                      default: ret = 'black'
                    }
                    return ret;
                  })()}}>{d}</li>) : ''}
          </ul>
        </div>
        
        <textarea id='chatInput' onChange={this.handleInputChange} value={this.state.UserInput}></textarea>
        <button onClick={this.sendMessage}>Send</button>
        
        
        
      </div>
      
    )
  }
}

const node = document.getElementById('root');

ReactDOM.render(<Main />, node)
//clientEmits();