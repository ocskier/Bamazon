const cTable = require("console.table");

var updateProds = {
    seeProds: function(conn,callback) {
        conn.query("select * from products", function(err,res) {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < res.length; i++) {
                itemArray.push(res[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log("\nHere are the items currently for sale:\n\n"+table);
            callback();
        });
    },
    viewLowInv: function (conn,callback) {
        conn.query("select * from products where Quantity<5", function(err,res) {
            if(err) throw err;
            var itemArray = [];
            for (let i = 0; i < res.length; i++) {
                itemArray.push(res[i]);
            }
            const table = cTable.getTable(itemArray);
            console.log("\nHere are the items low on inventory:\n\n"+table);
            callback();
        });
    },
    addInv: function(selItem,newQuantity,conn,callback) {
        var query = conn.query(
            "UPDATE products SET ? WHERE ?",
            [ {
                Quantity: newQuantity
            },
            {
                id: selItem
            }
            ], function(err) {
            if(err) throw err;
            // logs the actual query being run
            console.log(query.sql);
            console.log(newQuantity+" added!");
            callback();
            }
        );
    }
};

exports.managerFunc = updateProds;