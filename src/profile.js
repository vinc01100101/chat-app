const React = require('react');
const ReactDOM = require('react-dom');

class Profile extends React.Component{
  constructor(props){
    super(props);
    
  }
  
  render(){
    return(
      <div>
        WELCOME
      </div>
    )
  }
}

const node = document.getElementById('root');

ReactDOM.render(<Profile />, node)