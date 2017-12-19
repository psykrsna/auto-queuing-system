import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './css/app.css';
import Customer from './components/Customer';
import Dashboard from './components/Dashboard';
import Driver from './components/Driver';
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
