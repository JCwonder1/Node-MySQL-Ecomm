const mysql = ("../mysql");

function DB (db_settings){
    this.host = db_settings.db.host
    this.port = db_settings.db.port,
    this.user = db_settings.db.user,
    this.pass = db_settings.db.pass
    this.database = db_settings.db.database

};

DB.prototype.getAllProducts = function(connection){
    return query = "SELECT * FROM products";
}






module.exports = DB;