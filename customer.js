var inq = require("inquirer");
var mysql = require("mysql");
var manager=require("./manager.js");
var employee=require("./employee.js");

const cTable = require("console.table");

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
        message: "What is your role at Bamazon?",
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
            case "employee": 
                console.log("You are an employee!!");
                employee.employFunc("stereo",595.95,showCustProds);
                break;
            case "manager":
                console.log("You are the manager!!");
                manager.managerFunc("stereo",8,showCustProds);
                break;
            case "customer":
                console.log("Hey how are you doing today?");
                console.log("Here is a list of items for sale:");
                showCustProds();
                break;
            default:
                getJob();
        }
    }
  });
}

function showCustProds() {
    connection.connect(function(err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        connection.query("select * from stock", function(err,res) {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < res.length; i++) {
                itemArray.push(res[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log(table);
            connection.end();
        });
    });
}

getJob();