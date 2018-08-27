DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Dept VARCHAR(30) not NULL,
  Description VARCHAR(45) null,
  Price DECIMAL(10,2) NULL,
  Quantity INT NULL,
  Product_Sales DECIMAL(10,2) default 0.00 
);

CREATE TABLE departments (
  Department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Department_name VARCHAR(30) not NULL,
  Overhead_cost INT (10) default 0
);


INSERT INTO products (Dept, Description, Price,Quantity)
VALUES ("Audio", "Panasonic 200W 6.1CH Receiver",450.99, 6),("Audio", 'Panasonic 6.5" Two-Way 100W Speakers',65.59, 12),
("Video", 'Sony 52" 1080P HDTV',795.99, 5),("Portable", "80GB Ipod Video 6th Gen",100.99, 2),
("Mobile", "Iphone 6S Plus 64GB Phone",545.89, 10),("Hardware", "Samsung 1TB SSD Hard Drive",219.95, 8),
("Hardware", 'Nvidia GeForce 1080Ti Video Card',679.99, 8),("Hardware", "SoundBlaster Audigy 2 Sound Card",97.99,11),
("Audio", 'Sony 100W All-in-One Surround',195.99, 6),("Gaming", "XBox One S 1 TB",321.99, 18);

INSERT INTO departments (Department_name,Overhead_Cost)
VALUES ("Audio",36000),("Video",24000),("Portable",8000),("Mobile",28000),("Hardware",18000),("Gaming",32000);
