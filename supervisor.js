const cTable = require("console.table");

var checkProds = {
    seeDeptSales: function(conn,callback) {
        conn.query("select departments.Department_id,departments.Department_name,departments.Overhead_Cost, SUM(products.Product_Sales) AS Product_Sales from products RIGHT JOIN departments ON products.Dept = departments.Department_name group by departments.Department_name ORDER BY departments.Department_id ASC",
            function(err,res) {
                if(err) throw err;
                var itemArray = [];
                for (let i = 0; i < res.length; i++) {
                    res[i].Total_Profit = res[i].Product_Sales-res[i].Overhead_Cost;
                    console.log(res[i]);
                    itemArray.push(res[i]);
                }
                const table = cTable.getTable(itemArray);
                console.log("\nHere are the store results:\n\n"+table);
                callback();
            }
        );
    },
    createDept: function (conn,callback) {
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
    }
};

exports.superFunc = checkProds;