const cTable = require("console.table");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");
var connectToDB = require("../config/connectFunc");

var showProds = {
  showCustProds: function(callback) {
    connectToDB(conn, "select id,Description,Price from products").then(
      (data, err) => {
        var itemArray = [];
        for (let i = 0; i < data.length; i++) {
          itemArray.push(data[i]);
        }
        const table = cTable.getTable(itemArray);
        console.log(
          colors.bgWhite.black("\nHere are the items currently for sale:\n\n")
        );
        console.log(table);
        // showProds.askCustBuy(callback);
      }
    );
  },
  askCustBuy: function(callback) {
    inq
      .prompt([
        {
          name: "choice",
          message: "What item (id) would you like to buy?",
          type: "input"
        },
        {
          name: "number",
          message: "How many would you like to buy?",
          type: "input"
        },
        {
          name: "confirm",
          message: "Are you sure?",
          type: "confirm",
          default: true
        }
      ])
      .then(value => {
        if (value.confirm) {
          connectToDB(
            conn,
            "select Price,Quantity,Product_Sales from products WHERE ?",
            [{ id: value.choice }]
          ).then((data, err) => {
            if (value.number <= data[0].Quantity) {
              var total = (data[0].Price * value.number).toFixed(2);
              console.log(
                colors.bgWhite.bold.red(
                  "\n  The total for your order is $" + total + "  "
                )
              );
              connectToDB(conn, "UPDATE products SET ? WHERE ?", [
                {
                  Quantity: data[0].Quantity - value.number,
                  Product_Sales:
                    data[0].Product_Sales + data[0].Price * value.number
                },
                {
                  id: value.choice
                }
              ]).then((data, err) => {
                showProds.showCustProds(callback);
              });
            } else {
              console.log("\nCan't fulfill order! Sorry.\n");
              callback();
            }
          });
        } else {
          callback();
        }
      })
      .catch(err => console.log(err));
  }
};

exports.custFunc = showProds;
