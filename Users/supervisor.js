const cTable = require("console.table");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");
var connectToDB = require("../config/connectFunc");

function seeDeptSales (callback) {
    connectToDB(conn, "Select departments.Department_id,departments.Department_name,departments.Overhead_Cost, SUM(products.Product_Sales) AS Product_Sales from products RIGHT JOIN departments ON products.Dept = departments.Department_name group by departments.Department_id,departments.Department_name ORDER BY departments.Department_id ASC")
        .then((data, err) => {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < data.length; i++) {
                data[i].Total_Profit = parseInt(data[i].Product_Sales-data[i].Overhead_Cost);
                !data[i].Product_Sales ? data[i].Product_Sales = 0 : null;
                itemArray.push(data[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log(colors.bgWhite.black("\nHere are the store results:\n\n"));
            console.log(table);
            checkProds.askSup(callback);
        });
}

var checkProds = {

    askSup: function (callback) {
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
                        seeDeptSales(callback);                        
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
                            connectToDB(
                                conn, 
                                "INSERT INTO departments SET ?", 
                                {
                                    Department_name: value.newSupDept,
                                    Overhead_Cost: value.newCost
                                },
                            ).then((data, err) => {
                                if(err) throw err;
                                // logs the actual query being run
                                console.log(colors.red("Department added!"));
                                seeDeptSales(callback);
                            });
                        });
                        break;

                    default:
                        callback();
                }
            }
            else{
                checkProds.askSup(callback);
            }
        });
    }
};

exports.superFunc = checkProds;