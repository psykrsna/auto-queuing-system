var db = require('./db');

function sync(){
  let sql = "update request set completedAt = DATE_ADD( request.selectedAt, INTERVAL 5 MINUTE), status =2 where status = 1 and selectedAt < DATE_SUB( NOW(), INTERVAL 5 MINUTE)";
  return db.query(sql);
}

module.exports.sync = sync;