import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './app.css';
import Customer from './Customer';
import Dashboard from './Dashboard';
import Driver from './Driver';
import config from './config';

if(config.DEBUG){
  localStorage.setItem('apiRoot', 'http://localhost:5000');
}
else{
  localStorage.setItem('apiRoot', 'http://auto-q.herokuapp.com');
}

class Routes extends React.Component{
  render() {
    return (
      <Router>
        <div className="pseudo-root">
          <Route exact path="/customer" component={Customer} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/driver" component={Driver} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);
