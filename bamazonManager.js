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
                "Add New Product", 
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
                let nothingLowTrigger = true;
                res.forEach(element => {
                    if(element.stock_quantity <= 2){
                    nothingLowTrigger = false
                    console.log(`ID: ${element.item_id} || Product Name: ${element.product_name} || Price: ${element.price} || Stock Qty: ${element.stock_quantity}`);
                    }

                });
                if(nothingLowTrigger){
                    console.log("No low inventory.")
                }
                welcomeMessage();
            })
        break;
        case"Add to Inventory":
        
        addToInventory();
            
        break;
        case"Add New Product":
            addNewProduct();
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
        validate: function(input){
            if (input <= 0) {
                console.log("\n Please enter a number higher than 0");    
            }else{
                return true;
            }
        },
        name: "qtyToAdd"
    }]).then(res=>{
        let parsedQty = parseInt(res.qtyToAdd);
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

function addNewProduct(){
    console.log("In Function Add New Product");
    inquirer.prompt([{
        type: "input",
        message: "Please enter the product title:",
        name: "product_name"
    },
    {
        type: "input",
        message: "What department does this product belong in?",
        name: "department"
    },
    {
        type: "input",
        message: "What is the price?",
        name: "price"
    },
    {
        type: "input",
        message: "How many quantities do you want to check into stock?",
        name: "stock_quantity"
    }
]).then(res=>{
    let query = db.addProducts(res.product_name, res.department, res.price, res.stock_quantity);
    process.exit;
    connection.query(query, (err, data)=>{
        if (err) throw err;
        console.log(`Added ${data.affectedRows} new product`);
        welcomeMessage();
    })
})



}

welcomeMessage();