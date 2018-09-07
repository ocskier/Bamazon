var inq = require("inquirer");
var mysql = require("mysql");
var colors = require("colors/safe");

var manager=require("./manager.js");
var supervisor=require("./supervisor.js");

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
                showCustProds(function() {
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
                        }
                    ]).then((value) => {
                        connection.query(
                            "select Price,Quantity,Product_Sales from products WHERE ?",
                            [{
                                id: value.choice
                            }], function(err,res) {
                                if(err) throw err;
                                if (value.number<=res[0].Quantity) {
                                    var total = (res[0].Price*value.number).toFixed(2);
                                    console.log(colors.bgWhite.bold.red('\n  The total for your order is $'+total+"  "));
                                    connection.query(
                                        "UPDATE products SET ? WHERE ?",
                                        [ {
                                            Quantity: res[0].Quantity-value.number,
                                            Product_Sales: res[0].Product_Sales+total
                                        },
                                        {
                                            id: value.choice
                                        }
                                        ], function(err,res) {
                                        if(err) throw err;
                                        // logs the actual query being run
                                        showCustProds(getJob);
                                    });
                                }
                                else {
                                    console.log("\nCan't fulfill order! Sorry.\n");
                                    getJob();
                                }
                            }
                        );
                    });
                });
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

function showCustProds(callback) {
    connection.query("select id,Description,Price from products", function(err,res) {
        if(err) throw err;
        var itemArray = [];
        for (let i = 0; i < res.length; i++) {
            itemArray.push(res[i]);
        }
        const table = cTable.getTable(itemArray);
        console.log(colors.bgWhite.black("\nHere are the items currently for sale:\n\n"));
        console.log(table);
        callback();
    });
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    getJob();
});