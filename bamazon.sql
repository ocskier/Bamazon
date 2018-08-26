DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) not NULL,
  descr VARCHAR(45) null,
  price DECIMAL(10,2) NULL,
  quantity INT NULL
);

INSERT INTO items (name, descr, price,quantity)
VALUES ("stereo", "Panasonic 200W",450.00, 6),("speakers", 'Panasonic 6.5" Two-Way 100W ',65.00, 12),
("tv", 'Sony 52" 1080P HDTV',795.00, 5),("ipod", "80GB Ipod Video 6th Gen",100.00, 2),
("iphone", "Iphone 6S Plus 64GB",545.00, 10),("hard drive", "Samsung 1TB SSD",219.95, 8);


