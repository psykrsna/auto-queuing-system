var { graphql, buildSchema } = require('graphql');
var db = require('../db');

var schema = buildSchema(`
  input RequestInput{
    customer: Int!
  }

  type Query {
    test: String!
  }

  type Mutation {
    createRequest(input: RequestInput): Boolean
}
`);

var root = {

  test: () => {
    let sql = "select 'Hello World!' as test;";
    return db.query(sql).then( result => {
      return result[0][0].test;
    })
    .catch( error => {
      console.log(error);
    })
  },

  createRequest: (data, request) => {
    let customerId = db.escape(data.input.customer);
    let sql = "INSERT INTO request (customerId) VALUES ("+customerId+");";
    return db.query(sql).then( result => {
      return true;
    })
    .catch( error => {
      console.log(error);
    })
  }

};

module.exports = {
  schema: schema,
  root: root
};