import React, { Component } from 'react';
import axios from 'axios';
import config from '../config';
import { timeDuration } from '../utils/main';
import io from 'socket.io-client';

// initializing socket
const socketRoot = localStorage.getItem('apiRoot');
const socket = io(socketRoot);


class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state = {
      requests: []
    };
  }

  componentDidMount = () =>{
    let comp = this;
    this.getRides();
    // reloads list of requests if there's new data
    socket.on('RELOAD', (data) => {
      comp.getRides();
		});
  }

  // makes API call to get current list of requests
  getRides = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query { \n requests { id customer createdAt status driver } \n }",
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then( response => {
      comp.setState({
        requests: response.data.data.requests
      });
    }).catch( error => {
      alert('There was an error retrieving the requests.');
      console.log(error);
    });
  }

  // converts status integer to relevant human friendly text
  getStatusText = (status) => {
    if(status === config.STATUS.WAITING){
      return 'Waiting';
    }
    else if(status === config.STATUS.ONGOING){
      return 'Ongoing';
    }
    else if(status === config.STATUS.COMPLETE){
      return 'Complete';
    }
  }

  render() {
    let RequestList = [];

    for(var request of this.state.requests){
      let timeSince = timeDuration(request.createdAt);
      let status = this.getStatusText(request.status);
      let item = (
        <tr>
          <td>{request.id}</td>
          <td>{request.customer}</td>
          <td title={request.createdAt}>{timeSince}</td>
          <td>{status}</td>
          <td>{request.driver}</td>
        </tr>
      );
      RequestList.push(item);
    }
    return (
      <div className="dashboard">
        <div>
          <h1>Dashboard</h1>
          <div>
          <table>
            <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer ID</th>
              <th>Time Elapsed</th>
              <th>Status</th>
              <th>Driver</th>
            </tr>
            </thead>

            <tbody>
            {RequestList}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
