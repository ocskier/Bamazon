const { printTable } = require("console-table-printer");

var colors = require("colors");
var inq = require("inquirer");
var conn = require("../config/connection");
var connectToDB = require("../config/connectFunc");

class Manager {
  async seeProds(callback) {
    try {
      var data = await connectToDB(conn, "select * from products");
      console.log(
        colors.bgWhite.black("\nHere are the items currently for sale:\n\n")
      );
      printTable(data);
      this.askManager(callback);
    } catch (err) {
      if (err) throw err;
    }
  }
  async viewLowInv(callback) {
    try {
      var data = await connectToDB(
        conn,
        "select * from products where Quantity<5"
      );
      data.length &&
        console.log(
          "\nHere are the items low on inventory:\n\n" + printTable(data)
        );
      !data.length && console.log("\nEverything is good!\n");
      this.askManager(callback);
    } catch (err) {
      if (err) throw err;
    }
  }
  async addInv(selItem, newQuantity, callback) {
    try {
      var data = connectToDB(conn, "UPDATE products SET ? WHERE ?", [
        {
          Quantity: newQuantity,
        },
        {
          id: selItem,
        },
      ]);
      console.log(
        colors.bgYellow.red(
          "The updated inventory is " + newQuantity + " of iD: " + selItem
        )
      );
      this.seeProds(callback);
    } catch (err) {
      if (err) throw err;
    }
  }
  async askManager(callback) {
    try {
      const answers = await inq.prompt([
        {
          type: "list",
          message: "What would you like to do?\n\n",
          choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
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
          case "View Products for Sale":
            this.seeProds(callback);
            break;
          case "View Low Inventory":
            this.viewLowInv(callback);
            break;
          case "Add to Inventory":
            try {
              var productsData = await connectToDB(
                conn,
                "select * from products"
              );
              console.log(
                colors.bgWhite.black(
                  "\nHere are the items currently for sale:\n\n"
                )
              );
              printTable(productsData);
              var invAnswers = await inq.prompt([
                {
                  name: "choice",
                  message: "What item (id) would you like to add more?",
                  type: "input",
                },
                {
                  name: "quantity",
                  message: "How much would you like to add?",
                  type: "input",
                },
              ]);
              if (isNaN(invAnswers.quantity)) {
                console.log("\nYou did not enter a valid amount!\n");
                this.askManager(callback);
              } else {
                var updateProdsData = await connectToDB(
                  conn,
                  "select Quantity from products WHERE ?",
                  [
                    {
                      id: invAnswers.choice,
                    },
                  ]
                );
                this.addInv(
                  invAnswers.choice,
                  parseInt(invAnswers.quantity) + updateProdsData[0].Quantity,
                  callback
                );
              }
            } catch (err) {
              if (err) throw err;
            }
            break;

          case "Add New Product":
            console.log("\n");
            try {
              var newProdAnswers = await inq.prompt([
                {
                  name: "newDept",
                  message: "What is the product department?",
                  type: "input",
                },
                {
                  name: "newDescr",
                  message: "Please add an item description?",
                  type: "input",
                },
                {
                  name: "newPrice",
                  message: "What is the sale price?",
                  type: "input",
                },
                {
                  name: "newQuant",
                  message: "How much inventory to add?",
                  type: "input",
                },
              ]);
              var newProdData = await connectToDB(
                conn,
                "INSERT INTO products SET ?",
                {
                  Dept: newProdAnswers.newDept,
                  Description: newProdAnswers.newDescr,
                  Price: newProdAnswers.newPrice,
                  Quantity: newProdAnswers.newQuant,
                }
              );
              // logs the actual query being run
              console.log("Item added!");
              this.seeProds(callback);
            } catch (err) {
              if (err) throw err;
            }
            break;

          default:
            callback();
        }
      } else {
        this.askManager(callback);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Manager;
