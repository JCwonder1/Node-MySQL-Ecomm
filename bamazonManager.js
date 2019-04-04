require("dotenv").config();
const keys = require("./keys");
const inquirer = require("inquirer");
const db_functions = require("./assets/DB_Functions");
const mysql = require("mysql");
const chalk = require('chalk');

const db = new db_functions(keys);

const connection = mysql.createConnection({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.pass,
    database: db.database
})



inquirer.prompt([{
    type: "list",
    message: "Please select a product",
    choices: [  "View Products for Sale", 
                "View Low Inventory", 
                "Add to Inventory", 
                "Add New Produce", 
                "Exit"],
    name: "userSelection"
}]).then(function (res) {
    productSelected(res.userSelection);
});


function productSelected(productSelected) {
    switch(productSelected){
        case productSelected === "View Products for Sale":
            console.log("View Products")
        break;
        case productSelected === "View Low Inventory":
            console.log("View Low Inventory")
        break;
        case productSelected === "Add to Inventory":
            console.log("Add to Inventory")
        break;
        case productSelected === "Add New Produce":
            console.log("Add New Produce")
        break;
        case productSelected === "Exit":
            console.log("Exit")
        break;
    }

}