const { printTable } = require("console-table-printer");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");
var connectToDB = require("../config/connectFunc");

class Supervisor {
  async seeDeptSales(callback) {
    try {
      var data = await connectToDB(
        conn,
        "Select departments.Department_id,departments.Department_name,departments.Overhead_Cost, SUM(products.Product_Sales) AS Product_Sales from products RIGHT JOIN departments ON products.Dept = departments.Department_name group by departments.Department_id,departments.Department_name ORDER BY departments.Department_id ASC"
      );
      var itemArray = [];
      for (let i = 0; i < data.length; i++) {
        data[i].Total_Profit = parseInt(
          data[i].Product_Sales - data[i].Overhead_Cost
        );
        !data[i].Product_Sales ? (data[i].Product_Sales = 0) : null;
        itemArray.push(data[i]);
      }
      console.log(colors.bgWhite.black("\nHere are the store results:\n\n"));
      printTable(itemArray);
      this.askSup(callback);
    } catch (err) {
      if (err) throw err;
    }
  }
  async askSup(callback) {
    try {
      var answers = await inq.prompt([
        {
          type: "list",
          message: "What would you like to do?\n\n",
          choices: [
            "Product Sales by Department",
            "Create New Department",
            "Exit",
          ],
          name: "action",
        },
        {
          name: "confirm",
          message: "Are you sure?",
          type: "confirm",
          default: true,
        },
      ]);
      if (answers.confirm) {
        switch (answers.action) {
          case "Product Sales by Department":
            this.seeDeptSales(callback);
            break;

          case "Create New Department":
            console.log("\n");
            var newDeptAnswers = await inq.prompt([
              {
                name: "newSupDept",
                message: "What is the product department?",
                type: "input",
              },
              {
                name: "newCost",
                message: "What is the overhead cost?",
                type: "input",
              },
            ]);
            var insertData = await connectToDB(
              conn,
              "INSERT INTO departments SET ?",
              {
                Department_name: newDeptAnswers.newSupDept,
                Overhead_Cost: newDeptAnswers.newCost,
              }
            );
            // logs the actual query being run
            console.log(colors.red("Department added!"));
            this.seeDeptSales(callback);
            break;

          default:
            callback();
        }
      } else {
        this.askSup(callback);
      }
    } catch (err) {
      if (err) throw err;
    }
  }
}

module.exports = Supervisor;
