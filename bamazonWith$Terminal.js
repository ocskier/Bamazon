var inq = require("inquirer");

var customer=require("./Users/customer");
var manager=require("./Users/manager");
var supervisor=require("./Users/supervisor");

var connection = require("./config/connection");


function shop(cliInput) {
        const reply = {
            msg: "",
            data: []
        };

        switch(cliInput.toLowerCase()) {
                case "run bamazon":
                    reply.msg = "What is your role at Bamazon?";
                    return reply
                    break;
                case "customer":
                    reply.msg =  "Hi how are you doing today?";
                    reply.data = customer.custFunc.showCustProds((a)=>{return a});
                    return reply
                    break;

                case "manager":     

                    manager.managerFunc.askManager(this.getJob);
                    break;
                    
                case "supervisor":
                    
                    supervisor.superFunc.askSup(this.getJob);
                    break;

                default:
                    // this.getJob();
            }
}
        // else {
        //     connection.end();
        //     console.log("Thanks for using Bamazon!");
        // }

module.exports = shop;