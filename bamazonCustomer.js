require("dotenv").config();
const keys = require("./keys");
const inquirer = require("inquirer");
const db_functions = require("./assets/DB_Functions");
const mysql = require("mysql");
const chalk = require('chalk');

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

        displayProduct(promptChoices);

        })


    };

    


function displayProduct(productArray){
    productArray.push("Leave Store");
    inquirer.prompt([{
    type: "list",
    message: "Please select a product",
    choices: productArray,
    name: "userSelection"
    }]).then(function (res){
        productSelected(res.userSelection);
    })
}

function productSelected(productSelected){
    if (productSelected === "Leave Store") {
        connection.end();
        process.exit();
    }
    let query = db.getProductByProductName(productSelected);
    
    connection.query(query, (err, res)=>{
        if (err) throw err;
        console.log("\nYou've selected " + chalk.green(res[0].product_name));
        if(res[0].stock_quantity !== 0){
        console.log("\nWe have "+ res[0].stock_quantity + " available");
        quantitySelected(res[0]);
        }else{
            console.log("Out of Stock.  Please select another product \n");
            welcomeScreen();
        }
    })


}

function quantitySelected(productInfo){
    inquirer.prompt([{
        type: "input",
        message: "How many items would you like to order? \n",
        validate: function (input){
            if(input <= productInfo.stock_quantity){  
                return true
             } else{
                return chalk.red("Insufficent Stock \n");
             }
        },
        name: "qty"
    }]).then((res)=>{
        orderConfirmation(productInfo, res.qty);
    })
}

function orderConfirmation(product, qty){
    let newQuantity = product.stock_quantity - qty;
    let query = db.updateInventoryById(product.item_id, newQuantity);
    connection.query(query, (err, data)=>{
        if (err) throw err;
        console.log(chalk.yellow("\nConfirmation of Checkout:\n"));
        console.log("You ordered " + qty + " " + product.product_name);
        console.log("Your total is: $" + chalk.green(product.price * qty));
        console.log("\nOrder will be shipped today with NEXT DAY AIR");
        connection.end();

    })
    
    
}