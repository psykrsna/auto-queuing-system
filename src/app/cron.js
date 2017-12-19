// Run using Heroku Scheduler

var { sync } = require('./sync');

sync().then(response => {
  console.log('Updated successfully');
  process.exit();
}).catch( error => {
  console.log(error);
  process.exit();
});