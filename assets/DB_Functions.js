const mysql = ("../mysql");

function DB (db_settings){
    this.host = db_settings.db.host
    this.port = db_settings.db.port,
    this.user = db_settings.db.user,
    this.pass = db_settings.db.pass
    this.database = db_settings.db.database

};

DB.prototype.getAllProducts = function(){
    return query = "SELECT * FROM products";
};

DB.prototype.getProductByProductName = function(productSelected){

    return query = `SELECT * FROM products WHERE product_name = "${productSelected}"`;
};

DB.prototype.updateInventoryById = function(id, newQuantity){
    //console.log(newQuantity);
    return query = `UPDATE products SET stock_quantity = "${newQuantity}" WHERE item_id = "${id}"`;

}

DB.prototype.addProducts = function(product_name, department, price, qty){
    return query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${product_name}", "${department}", "${price}", "${qty}")`;

}



module.exports = DB;