const React = require('react');
const ReactDOM = require('react-dom');
const clientEmits = require('./clientEmits');



class Profile extends React.Component{
  constructor(props){
    super(props);
    
    //this.handleSubmit = this.handleSubmit.bind(this);
    
  }
  // handleSubmit(e){
  //   const message = e.target[0].value;
  //   alert(message)
  //   e.preventDefault();
  // }
  render(){
    return(
      <div>
        <div id="chatbox">
          <ul id="chatlist">
            
          </ul>
        </div>
        <form id='form'>
          <textarea id='userInput' name='userInput'></textarea>
          <button type='submit'>Send</button>
        </form>
      </div>
    )
  }
}

const node = document.getElementById('root');

ReactDOM.render(<Profile />, node)
clientEmits();