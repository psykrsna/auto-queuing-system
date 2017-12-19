const express = require('express');
const path = require('path');
const app = express();
const graphqlHTTP = require('express-graphql');
const API = require('./src/app/api');

// To make requests on different ports on the localhost
var cors = require('cors');
app.use(cors())

// Serves static assets
app.use(express.static(path.join(__dirname, 'build')));

// Serves GraphQL API
app.use('/api', graphqlHTTP({
  schema: API.schema,
  rootValue: API.root,
  graphiql: true,
}));

// Serves React's build
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Serve
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});