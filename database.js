var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'kanjisama'
})

// var connection = mysql.createConnection({
//   host: 'ositadb.cydtura4yorj.ap-northeast-1.rds.amazonaws.com',
//   user: '',
//   password: '',
//   database: 'kanjisama'
// })

module.exports = connection;