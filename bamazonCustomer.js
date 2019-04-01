require("dotenv").config();
const keys = require("./keys");
const inquirer = require("inquirer");
const db_functions = require("./assets/DB_Functions");
const mysql = require("mysql");

const db = new db_functions(keys);

const connection  = mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.pass,
    database: db.database
})

connection.connect(function (err) {
    if (err) throw err;
    welcomeScreen();
    
});

function welcomeScreen(){
    let query = db.getAllProducts();
    connection.query(query , (err, data)=>{
        if(err) throw err;
        let promptChoices =[];
        data.forEach(element => {
            promptChoices.push(element.product_name);
            
        });

        
    })

    
}







