var inq = require("inquirer");

var customer=require("./Users/customer");
var manager=require("./Users/manager");
var supervisor=require("./Users/supervisor");

var connection = require("./config/connection");

const shop = {
    getJob: function() {
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
                        customer.custFunc.showCustProds(this.getJob);
                        break;

                    case "manager":     

                        manager.managerFunc.askManager(this.getJob);
                        break;
                        
                    case "supervisor":
                        
                        supervisor.superFunc.askSup(this.getJob);
                        break;

                    default:
                        this.getJob();
                }
            }
            else {
                connection.end();
                console.log("Thanks for using Bamazon!");
            }
        });
    }
}

shop.getJob();

module.exports = shop;