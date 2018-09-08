var inq = require("inquirer");

var customer=require("./customer.js");
var manager=require("./manager.js");
var supervisor=require("./supervisor.js");

var connection = require("./config/connection");

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
                customer.custFunc.showCustProds(getJob);
                break;

            case "manager":     

                manager.managerFunc.askManager(getJob);
                break;
                
            case "supervisor":
                
                supervisor.superFunc.askSup(getJob);
                break;

            default:
                getJob();
        }
    }
    else {
        connection.end();
        console.log("Thanks for using Bamazon!");
    }
  });
}

getJob();