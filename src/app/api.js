var { graphql, buildSchema } = require('graphql');
var db = require('../db');
var { sync } = require('../sync');

var schema = buildSchema(`
  input RequestInput{
    customer: Int!
  }

  input SelectInput{
    id: Int!
    driver: Int!
  }

  type Request{
    id: Int!
    customer: Int!
    createdAt: String!
    selectedAt: String
    completedAt: String
    status: Int!
    driver: Int
  }

  type Query {
    test: String!
    requests(status: Int, driver: Int): [Request]
  }

  type Mutation {
    createRequest(input: RequestInput): Boolean
    selectRequest(input: SelectInput): Boolean
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
      if(data.status !== undefined){
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
  },

  selectRequest: (data) => {
    return sync().then( result => {
      let sql1 = 'select count(*) as count from request where status=1 and driver='+data.input.driver;
      return db.query(sql1).then( result => {
        if(result[0][0].count === 0){

          let sql2 = "UPDATE request SET status=1, driver="+data.input.driver+", selectedAt=NOW() where id="+data.input.id;
          return db.query(sql2).then( result => {
            return true;
          })
          .catch( error => {
            console.log(error);
          })

        }
        else{
          // already has a ride assigned
          return false;
        }
      });
    });
  },

};

module.exports = {
  schema: schema,
  root: root
};