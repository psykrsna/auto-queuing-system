import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
const socketRoot = localStorage.getItem('apiRoot');
const socket = io(socketRoot);


class Customer extends Component {

  constructor(props){
    super(props);
    this.state = {
      customer: ''
    };
  }

  handleCustomerChange = (event) => {
    this.setState({ customer: event.target.value });
  }

  submitRequest = () => {
    var comp = this;
    var apiRoot = localStorage.getItem('apiRoot');
    var data = {
        query: "mutation createRequest($input: RequestInput) { \n createRequest(input: $input) \n }",
        variables: {
          input: {
            customer: this.state.customer
          }
        }
    };

    axios({
      method: 'post',
      url: apiRoot+'/api',
      data: data
    }).then( response => {
      if(response.data.data.createRequest === true){
        alert('Request successfully received. A ride will be allotted shortly!');
        comp.setState({
          customer: ''
        });
        socket.emit('NEW REQUEST', {load: true});
      }
    }).catch( error => {
      alert('There was an error submitting the request');
      console.log(error);
    });

  }

  render() {
    return (
      <div className="customer-app">
        <div>
          <h1>Hire A Ride</h1>
        </div>
        <div>  
          <label> 
            Customer ID: 
            <input 
              type="number" 
              value={this.state.customer} 
              onChange={this.handleCustomerChange}
            />
          </label>
        </div>
        <br/>
        <div>
          <button onClick={this.submitRequest} >Ride Now</button>
        </div>
      </div>
    );
  }
}

export default Customer;
