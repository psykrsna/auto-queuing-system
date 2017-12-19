var { graphql, buildSchema } = require('graphql');
var db = require('../db');

var schema = buildSchema(`
  type Query {
    test: String!
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
  }
};

module.exports = {
  schema: schema,
  root: root
};