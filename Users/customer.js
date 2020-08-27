const { printTable } = require("console-table-printer");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");
var connectToDB = require("../config/connectFunc");

class Customer {
  async showCustProds(callback) {
    try {
      var data = await connectToDB(
        conn,
        "select id,Description,Price from products"
      );
      console.log(
        colors.bgWhite.black("\nHere are the items currently for sale:\n\n")
      );
      printTable(data);
      console.log("\n");
      this.askCustBuy(callback);
    } catch (err) {
      return err;
    }
  }
  async askCustBuy(callback) {
    try {
      var answers = await inq.prompt([
        {
          name: "choice",
          message: "What item (id) would you like to buy?",
          type: "input",
        },
        {
          name: "number",
          message: "How many would you like to buy?",
          type: "input",
        },
        {
          name: "confirm",
          message: "Are you sure?",
          type: "confirm",
          default: true,
        },
      ]);
      if (answers.confirm) {
        var productData = await connectToDB(
          conn,
          "select Price,Quantity,Product_Sales from products WHERE ?",
          [{ id: answers.choice }]
        );
        if (answers.number <= productData[0].Quantity) {
          var total = (productData[0].Price * answers.number).toFixed(2);
          console.log(
            colors.bgWhite.bold.red(
              "\n  The total for your order is $" + total + "  "
            )
          );
          var updateProdData = connectToDB(
            conn,
            "UPDATE products SET ? WHERE ?",
            [
              {
                Quantity: productData[0].Quantity - answers.number,
                Product_Sales:
                  productData[0].Product_Sales +
                  productData[0].Price * answers.number,
              },
              {
                id: answers.choice,
              },
            ]
          );
          this.showCustProds(callback);
        } else {
          console.log("\nCan't fulfill order! Sorry.\n");
          this.showCustProds(callback);
        }
      } else {
        callback();
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Customer;
