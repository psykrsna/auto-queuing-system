import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import config from './config';


class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state = {
      requests: []
    };
  }

  componentDidMount = () =>{
    this.getRides();
  }

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

  timeSince = (duration) => {
    let minutes = duration.minutes();
    let hours = duration.hours();
    let days = duration.days();
    let seconds = duration.seconds();
    let timeSince = '';
    if(parseInt(hours, 10) < 1){
      timeSince = minutes+' min '+seconds+' sec';
    }
    else if(parseInt(hours, 10) < 24){
      timeSince = hours+' hr '+minutes+' min';
    }
    else{
      timeSince = days+' days ';
    }
    return timeSince;
  }

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
    let now = moment(new Date());

    for(var request of this.state.requests){
      let start = moment(request.createdAt);
      let duration = moment.duration(now.diff(start));
      let timeSince = this.timeSince(duration);
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
            <tr>
              <th>Request ID</th>
              <th>Customer ID</th>
              <th>Time Elapsed</th>
              <th>Status</th>
              <th>Driver</th>
            </tr>
            {RequestList}
          </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
