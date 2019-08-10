const express = require('express');
const path = require('path');
const runShop = require('./bamazon');

const PORT = 8080;

const app = express();

app.use(express.static('public'));

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, "index.html"));
    // runShop.go();
});

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
