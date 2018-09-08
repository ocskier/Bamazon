const cTable = require("console.table");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");

var updateProds = {
    seeProds: function(callback) {
        conn.query("select * from products", function(err,res) {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < res.length; i++) {
                itemArray.push(res[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log(colors.bgWhite.black("\nHere are the items currently for sale:\n\n"));
            console.log(table);
            updateProds.askManager(callback);
        });
    },
    viewLowInv: function (callback) {
        conn.query("select * from products where Quantity<5", function(err,res) {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < res.length; i++) {
                itemArray.push(res[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log("\nHere are the items low on inventory:\n\n"+table);
            updateProds.askManager(callback);
        });
    },
    addInv: function(selItem,newQuantity,callback) {
        conn.query(
            "UPDATE products SET ? WHERE ?",
            [ {
                Quantity: newQuantity
            },
            {
                id: selItem
            }
            ], function(err) {
            if(err) throw err;

            console.log(colors.bgYellow.red("The updated inventory is "+newQuantity+" of iD: "+selItem));
            updateProds.seeProds(callback);
            }
        );
    },
    askManager: function (callback) {
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
                        updateProds.seeProds(callback);
                        break;
                    case "View Low Inventory":
                        updateProds.viewLowInv(callback);
                        break;
                    case "Add to Inventory":
                        conn.query("select * from products", function(err,res) {
                            if(err) throw err;
                            var itemArray = [];
                            for (let i = 0; i < res.length; i++) {
                                itemArray.push(res[i]);
                            }
                            const table = cTable.getTable(itemArray);
                            console.log(colors.bgWhite.black("\nHere are the items currently for sale:\n\n"));
                            console.log(table);
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
                                if (isNaN(value.quantity)) {
                                    console.log("\nYou did not enter a valid amount!\n");
                                    updateProds.askManager(callback);
                                }
                                else {
                                    conn.query(
                                        "select Quantity from products WHERE ?",
                                        [{
                                            id: value.choice
                                        }], function(err,res) {
                                        if(err) throw err;
                                        updateProds.addInv(value.choice,parseInt(value.quantity)+res[0].Quantity,callback);
                                    });
                                }
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
                            },
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
                            conn.query(
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
                                    updateProds.seeProds(callback);
                                }
                            )
                        });
                        break;
                        
                    case "Exit":
                        callback();
                }
            }
            else {
                updateProds.askManager(callback);
            }
        });
    }
};

exports.managerFunc = updateProds;