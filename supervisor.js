
var checkProds = function(selItem,newPrice,conn,callback) {
    var query = conn.query(
        "UPDATE products SET ? WHERE ?",
        [ {
            Price: newPrice
        },
        {
            Item: selItem
        }
        ], function(err,res) {
        if(err) throw err;
        // logs the actual query being run
        console.log("\n"+query.sql+"\n");
        callback();
    });
};

exports.superFunc = checkProds;