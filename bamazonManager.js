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
});


function welcomeMessage(){
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
};

function productSelected(productSelected) {
    switch(productSelected){
        case "View Products for Sale":
            connection.query(db.getAllProducts(), (err, res)=>{
                if (err) throw err;
                res.forEach(element => {
                    console.log(`ID: ${element.item_id} || Product Name: ${element.product_name} || Price: ${element.price} || Stock Qty: ${element.stock_quantity}`);

                });
                welcomeMessage();
            })
        break;
        case "View Low Inventory":
            connection.query(db.getAllProducts(), (err, res) => {
                if (err) throw err;
                console.log("Low Inventory:")
                res.forEach(element => {
                    if(element.stock_quantity <= 2){
                    console.log(`ID: ${element.item_id} || Product Name: ${element.product_name} || Price: ${element.price} || Stock Qty: ${element.stock_quantity}`);
                    }

                });
                welcomeMessage();
            })
        break;
        case("Add to Inventory"):
        console.log("In Add Inventoyr");
        addToInventory();
            
        break;
        case productSelected === "Add New Produce":
            console.log("Add New Produce")
        break;
        case "Exit":
            process.exit();
        break;
    }

};


function addToInventory(){
    let query = db.getAllProducts();
  
    connection.query(query, (err, data) => {
        if (err) throw err;
        let promptChoices = [];
        data.forEach(element => {
            promptChoices.push(element.product_name);
            
        });
        
        selectProduct(promptChoices);

    })

};

function selectProduct(promptChoices){
    
    inquirer.prompt([{
        type: "list",
        message: "Which product would you like to add inventory to?",
        choices: promptChoices,
        name: "userSelection"
    }]).then(res=>{
        
        addQtyInput(res.userSelection);
    })
};

function addQtyInput(productName){
    inquirer.prompt([{
        type: "input",
        message: "How many would you like to add?",
        name: "qtyToAdd"
    }]).then(res=>{
        let query = db.getProductByProductName(productName);
        connection.query(query, (err, data)=>{
            if (err) throw err;
            let newQuantity = parseInt(data[0].stock_quantity) + parseInt(res.qtyToAdd);
            let query = db.updateInventoryById(data[0].item_id, newQuantity);
            connection.query(query, (err, data)=>{
                if (err) throw err;
                console.log("Qunatity Updated");
                welcomeMessage();
            });
        });
    });
};

welcomeMessage();