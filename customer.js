var inq = require("inquirer");
var mysql = require("mysql");
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
                                var total = res[0].Price*value.number;
                                console.log("\nThe total for your order is "+total);
                                var query = connection.query(
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
                                    console.log(query.sql);
                                    showCustProds(getJob);
                                });
                            }
                            else {
                                console.log("\nCan't fulfill order! Sorry.\n");
                                getJob();
                            }
                        });
                    });
                });
                break;

            case "manager":     
                function askManager () {
                    inq.prompt([
                        {
                            type: "list",
                            message: "What would you like to do?\n\n",
                            choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Exit"],
                            name: "action"
                        },
                        {
                            name: "confirm",
                            message: "Are you sure?",
                            type: "confirm",
                            default:true
                        }
                    ]).then((value) => {
                        if (value.confirm) {
                            switch(value.action) {
                                case "View Products for Sale": 
                                    manager.managerFunc.seeProds(connection,askManager);
                                    break;
                                case "View Low Inventory":
                                    manager.managerFunc.viewLowInv(connection,askManager);
                                    break;
                                case "Add to Inventory":
                                    manager.managerFunc.seeProds(connection,function() {
                                        inq.prompt([
                                            {
                                                name: "choice",
                                                message: "What item (id) would you like to add more?",
                                                type: "input"
                                            }   
                                            ,
                                            {
                                                name: "quantity",
                                                message: "How much would you like to add?",
                                                type: "input"
                                            }
                                        ]).then((value) => {
                                            connection.query(
                                                "select Quantity from products WHERE ?",
                                                [{
                                                    id: value.choice
                                                }], function(err,res) {
                                                if(err) throw err;
                                                manager.managerFunc.addInv(value.choice,parseInt(value.quantity)+res[0].Quantity,connection,askManager);
                                            });
                                        });
                                    });
                                    break;
                                
                                case "Add New Product":
                                    console.log("\n");
                                    inq.prompt([
                                        {
                                            name: "newDept",
                                            message: "What is the product department?",
                                            type: "input"
                                        }   
                                        ,
                                        {
                                            name: "newDescr",
                                            message: "Please add an item description?",
                                            type: "input"
                                        },
                                        {
                                            name: "newPrice",
                                            message: "What is the sale price?",
                                            type: "input"
                                        },
                                        {
                                            name: "newQuant",
                                            message: "How much inventory to add?",
                                            type: "input"
                                        }
                                    ]).then((value) => {
                                        connection.query(
                                            "INSERT INTO products SET ?", 
                                            {
                                                Dept: value.newDept,
                                                Description: value.newDescr,
                                                Price: value.newPrice,
                                                Quantity: value.newQuant    
                                            },
                                            function(err) {
                                                if(err) throw err;
                                                // logs the actual query being run
                                                console.log("Item added!");
                                                manager.managerFunc.seeProds(connection,askManager);
                                            }
                                        )
                                    });
                                    break;
                                    
                                case "Exit":
                                    getJob();
                                    break;
                            }
                        }
                        else {
                            connection.end();
                        }
                    });
                }
                askManager();
                break;
                
            case "supervisor":
                console.log("You are the supervisor!!");
                function askSup () {
                    inq.prompt([
                        {
                            type: "list",
                            message: "What would you like to do?\n\n",
                            choices:["Product Sales by Department","Create New Department","Exit"],
                            name: "action"
                        },
                        {
                            name: "confirm",
                            message: "Are you sure?",
                            type: "confirm",
                            default:true
                        }
                    ]).then((value) => {
                        if (value.confirm) {
                            switch(value.action) {
                                case "Product Sales by Department": 
                                    supervisor.superFunc.seeDeptSales(connection,askSup);                                    
                                    break;
                                case "Create New Department":
                                    console.log("\n");
                                    inq.prompt([
                                        {
                                            name: "newSupDept",
                                            message: "What is the product department?",
                                            type: "input"
                                        }   
                                        ,
                                        {
                                            name: "newCost",
                                            message: "What is the overhead cost?",
                                            type: "input"
                                        }
                                    ]).then((value) => {
                                        connection.query(
                                            "INSERT INTO departments SET ?", 
                                            {
                                                Department_name: value.newSupDept,
                                                Overhead_Cost: newCost
                                            },
                                            function(err) {
                                                if(err) throw err;
                                                // logs the actual query being run
                                            console.log("Department added!");
                                            supervisor.superFunc.createDept(connection,askSup);
                                            }
                                        );
                                    });
                                    break;
                                default:
                                    getJob();
                            }
                        }
                    });
                }
                askSup();
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
        console.log("\nHere are the items currently for sale:\n\n"+table);
        callback();
    });
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    getJob();
});