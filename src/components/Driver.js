import React, { Component } from 'react';
import axios from 'axios';
import config from '../config';
import { timeDuration } from '../utils/main';
import io from 'socket.io-client';

// initializing socket
const socketRoot = localStorage.getItem('apiRoot');
const socket = io(socketRoot);


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
    let comp = this;
    this.getRides();
    // reloads list of requests if there's new data
    socket.on('RELOAD', (data) => {
      comp.getRides();
		});
  }

  // makes API call to get list of rides
  getRides = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');

    // GraphQL allows us to get all the 3 lists - waiting, ongoing and complete together
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

  // makes API call and allots request to driver if available
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
        socket.emit('SELECTED RIDE', {request: requestId});
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

  // constructs relevant HTML for every request
  createItem = (request) => {
    let bottomContent = null;
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
    let [ waitingRequests, ongoingRequests, completeRequests ] = [ [], [], [] ];
    for(let request of this.state.requestsWaiting){
      waitingRequests.push( this.createItem(request) );
    }
    for(let request of this.state.requestsOngoing){
      ongoingRequests.push( this.createItem(request) );
    }
    for(let request of this.state.requestsComplete){
      completeRequests.push( this.createItem(request) );
    }

    return (
      <div className="driver-app">
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
