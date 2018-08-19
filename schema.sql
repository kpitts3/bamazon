DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

use bamazonDB;

CREATE TABLE products (
	item_id INTEGER NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    primary key (item_id)
);

use bamazonDB;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox360", "Video Games", 200.00, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Recliner", "Furniture", 500.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Iphone6", "Cell Phone", 179.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Samsung S9", "Video Games", 799.99, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("PS4", "Video Games", 200.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Rings", "Jewelry", 169.99, 100);