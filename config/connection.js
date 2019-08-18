var mysql = require("mysql");
require('dotenv').config();

var connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
});

module.exports = connection;
