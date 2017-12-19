import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './app.css';
import Customer from './Customer';
import config from './config';

if(config.DEBUG){
  localStorage.setItem('apiRoot', 'http://localhost:5000');
}
else{
  localStorage.setItem('apiRoot', 'http://server.herokuapp.com');
}

class Routes extends React.Component{
  render() {
    return (
      <Router>
          <Route exact path="/customerapp" component={Customer} />
      </Router>
    );
  }
}

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
