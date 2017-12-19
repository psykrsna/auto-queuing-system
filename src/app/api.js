var { graphql, buildSchema } = require('graphql');
var db = require('../db');

var schema = buildSchema(`
  input RequestInput{
    customer: Int!
  }

  type Request{
    id: Int!
    customer: Int!
    createdAt: String!
    status: Int!
    driver: Int
  }

  type Query {
    test: String!
    requests(status: Int, driver: Int): [Request]
  }

  type Mutation {
    createRequest(input: RequestInput): Boolean
}
`);

var root = {

  test: () => {
    let sql = "select 'Hello World!' as test";
    return db.query(sql).then( result => {
      return result[0][0].test;
    })
    .catch( error => {
      console.log(error);
    })
  },

  createRequest: (data) => {
    let customerId = db.escape(data.input.customer);
    let sql = "INSERT INTO request (customer) VALUES ("+customerId+")";
    return db.query(sql).then( result => {
      return true;
    })
    .catch( error => {
      console.log(error);
    })
  },

  requests: (data) => {
    let whereClause = '';
    if(data){
      if(data.status){
        whereClause = 'WHERE status='+db.escape(data.status);
      } 
      if(data.driver){
        if(whereClause === ''){
          whereClause = 'WHERE ';
        }
        else{
          whereClause += ' AND ';
        }
        whereClause += 'driver='+db.escape(data.driver);
      }
    }
    let sql = "SELECT * FROM request "+whereClause+" ORDER BY id DESC";

    return db.query(sql).then( result => {
      return result[0];
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