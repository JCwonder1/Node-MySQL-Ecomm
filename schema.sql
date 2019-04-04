DROP database IF exists bamazon;
Create database bamazon;

USE bamazon;

CREATE TABLE products(
	item_id integer(11) AUTO_INCREMENT NOT NULL primary key,
    product_name VARCHAR(225),
    department_name VARCHAR(40),
    price decimal(10,2),
    stock_quantity int(10)

);
