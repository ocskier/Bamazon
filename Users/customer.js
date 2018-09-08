const cTable = require("console.table");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");

var showProds = {
    showCustProds: function (callback) {
        conn.query("select id,Description,Price from products", function(err,res) {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < res.length; i++) {
                itemArray.push(res[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log(colors.bgWhite.black("\nHere are the items currently for sale:\n\n"));
            console.log(table);
            showProds.askCustBuy(callback);
        });
    },
    askCustBuy: function (callback) {
        inq.prompt([
            {
                name: "choice",
                message: "What item (id) would you like to buy?",
                type: "input"
            }   
            ,
            {
                name: "number",
                message: "How many would you like to buy?",
                type: "input"
            },
            {
                name: "confirm",
                message: "Are you sure?",
                type: "confirm",
                default:true
            }
        ]).then((value) => {
            if(value.confirm) {
                conn.query(
                    "select Price,Quantity,Product_Sales from products WHERE ?",
                    [{
                        id: value.choice
                    }], function(err,res) {
                        if(err) throw err;
                        if (value.number<=res[0].Quantity) {
                            var total = (res[0].Price*value.number).toFixed(2);
                            console.log(colors.bgWhite.bold.red('\n  The total for your order is $'+total+"  "));
                            conn.query(
                                "UPDATE products SET ? WHERE ?",
                                [ {
                                    Quantity: res[0].Quantity-value.number,
                                    Product_Sales: res[0].Product_Sales+res[0].Price*value.number
                                },
                                {
                                    id: value.choice
                                }
                                ], function(err,res) {
                                if(err) throw err;
                                // logs the actual query being run
                                showProds.showCustProds(callback);
                            });
                        }
                        else {
                            console.log("\nCan't fulfill order! Sorry.\n");
                            callback();
                        }
                    }
                );
            }
            else {
                callback();
            }
        });
    }
}

exports.custFunc = showProds;