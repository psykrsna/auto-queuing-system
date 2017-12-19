import React, { Component } from 'react';
import axios from 'axios';
import config from './config';
import { timeDuration } from './utils/main';

class Driver extends Component {

  constructor(props){
    super(props);
    const params = new URLSearchParams(props.location.search); 
    const driver = params.get('id');
    this.state = {
      requestsWaiting: [],
      requestsOngoing: [],
      requestsComplete: [],
      driver: driver
    };
  }

  componentDidMount = () =>{
    this.getRides();
  }

  getRides = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "query ($driver: Int!) { \n waiting: requests(status: 0) { id customer createdAt status driver } \n ongoing: requests(status: 1, driver: $driver) { id customer createdAt selectedAt status driver } \n complete: requests(status: 2, driver: $driver) { id customer createdAt selectedAt completedAt status driver } \n }",
        variables: {
          driver: this.state.driver
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then( response => {
      comp.setState({
        requestsWaiting: response.data.data.waiting,
        requestsOngoing: response.data.data.ongoing,
        requestsComplete: response.data.data.complete
      });
    }).catch( error => {
      alert('There was an error retrieving the requests.');
      console.log(error);
    });
  }

  selectRide = (requestId) => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "mutation selectRequest($input: SelectInput) { \n selectRequest(input: $input) \n }",
        variables: {
          input: {
            driver: this.state.driver,
            id: requestId
          }
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then( response => {
      if(response.data.data.selectRequest){
        comp.getRides();
        alert('Ride successfully selected!');
      }
      else{
        alert('Cannot select ride as you are already allotted!');
      }
    }).catch( error => {
      alert('There was an error selecting the ride.');
      console.log(error);
    });
  }

  getItem = (request) => {
    let bottomContent = null;
    console.log(request.status === config.STATUS.WAITING);
    if(request.status === config.STATUS.WAITING){
      bottomContent = (
        <div>
          <div>{timeDuration(request.createdAt)} ago</div>
          <div><button onClick={ () => this.selectRide(request.id) }>Select</button></div>
        </div>
      );
    }
    else if( request.status === config.STATUS.ONGOING ){
      bottomContent = (
        <div>
          <div>Request: {timeDuration(request.createdAt)} ago</div>
          <div>Picked up: {timeDuration(request.selectedAt)} ago</div>
        </div>
      );
    }
    else if( request.status === config.STATUS.COMPLETE ){
      bottomContent = (
        <div>
          <div>Request: {timeDuration(request.createdAt)} ago</div>
          <div>Picked up: {timeDuration(request.selectedAt)} ago</div>
          <div>Completed: {timeDuration(request.completedAt)} ago</div>
        </div>
      );
    }
    let item = (
      <div>
        <div>Req. ID: {request.id} &nbsp;&nbsp; Cust. ID: {request.customer}</div>
        {bottomContent}
        <br/>
      </div>
    );
    return item;
  }

  render() {
    let waitingRequests = [];
    let ongoingRequests = [];
    let completeRequests = [];
    for(let request of this.state.requestsWaiting){
      waitingRequests.push( this.getItem(request) );
    }
    for(let request of this.state.requestsOngoing){
      ongoingRequests.push( this.getItem(request) );
    }
    for(let request of this.state.requestsComplete){
      completeRequests.push( this.getItem(request) );
    }

    return (
      <div className="dashboard">
        <div>
          <h1>Driver App</h1>
          <div>
          <table>
            <thead>
            <tr>
              <th>Waiting</th>
              <th>Ongoing</th>
              <th>Complete</th>
            </tr>
            </thead>

            <tbody>
            <tr>
              <td>{waitingRequests}</td>
              <td>{ongoingRequests}</td>
              <td>{completeRequests}</td>
            </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Driver;
