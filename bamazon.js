var inq = require("inquirer");
var mysql = require("mysql");

var customer=require("./customer.js");
var manager=require("./manager.js");
var supervisor=require("./supervisor.js");

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

function getJob() {
  inq.prompt([
    {
        name: "job",
        message: "What is your role at Bamazon? (Customer,Manager,Supervisor)",
        type: "input"
    },
    {
        name: "confirm",
        message: "Are you sure?",
        type: "confirm",
        default:true
    }
  ]).then((value) => {
    if (value.confirm) {
        switch(value.job.toLowerCase()) {
            
            case "customer":
                console.log("\nHi how are you doing today?");
                customer.custFunc.showCustProds(connection,getJob);
                break;

            case "manager":     

                manager.managerFunc.askManager(connection,getJob);
                break;
                
            case "supervisor":
                
                supervisor.superFunc.askSup(connection,getJob);
                break;

            default:
                getJob();
        }
    }
    else {
        connection.end();
    }
  });
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    getJob();
});