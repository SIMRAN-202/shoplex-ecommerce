const mysql = require('mysql')

var connection = mysql.createPool({
    host : "localhost",
    user:"root",
    password : "",
    database:"thrift_shop",
    multipleStatements:true
})

module.exports=connection