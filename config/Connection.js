const mysql= require('mysql');
let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'11111',
    database:'blog'
});
module.exports= connection