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

var server = require('http').Server(app);
var io = require('socket.io')(server);

// Serve
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

io.on('connection', function (socket) {
  socket.on('NEW REQUEST', function (data) {
    io.emit('RELOAD', {load: true});
  });
  socket.on('SELECTED RIDE', function (data) {
    io.emit('RELOAD', {load: true});
  });
});
   