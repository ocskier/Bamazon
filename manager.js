console.log('\nthis is loaded');

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon_DB"
});

var updateProds = function(selItem,newQuantity,callback) {
    connection.connect(function(err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        var query = connection.query(
            "UPDATE stock SET ? WHERE ?",
            [ {
                Quantity: newQuantity
            },
            {
                Item: selItem
            }
            ], function(err,res) {
            if(err) throw err;
            // logs the actual query being run
            console.log(query.sql);
            connection.end();
            callback();
        });
    });
};

exports.managerFunc = updateProds;