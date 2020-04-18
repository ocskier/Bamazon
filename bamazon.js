var inq = require("inquirer");

var Customer = require("./Users/customer");
var Manager = require("./Users/manager");
var supervisor = require("./Users/supervisor");

var connection = require("./config/connection");

var customer = new Customer();
var manager = new Manager();

const shop = {
  getJob: function () {
    inq
      .prompt([
        {
          name: "job",
          message:
            "What is your role at Bamazon? (Customer,Manager,Supervisor)",
          type: "input",
        },
        {
          name: "confirm",
          message: "Are you sure?",
          type: "confirm",
          default: true,
        },
      ])
      .then((value) => {
        if (value.confirm) {
          switch (value.job.toLowerCase()) {
            case "customer":
              console.log("\nHi how are you doing today?");
              customer.showCustProds(shop.getJob);
              break;

            case "manager":
              manager.askManager(shop.getJob);
              break;

            case "supervisor":
              supervisor.superFunc.askSup(shop.getJob);
              break;

            default:
              this.getJob();
          }
        } else {
          connection.end();
          console.log("Thanks for using Bamazon!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

shop.getJob();

module.exports = shop;
