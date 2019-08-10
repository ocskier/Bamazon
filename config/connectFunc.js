module.exports = function connectToDB (conn, queryStr, queryPar) {
    return new Promise (( resolve, reject) => {
        conn.query(queryStr,queryPar,(err, res) => {
            if(err) return reject(err);
            return resolve(res)
        });
    });
}
