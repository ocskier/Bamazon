DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE stock (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Item VARCHAR(30) not NULL,
  Description VARCHAR(45) null,
  Price DECIMAL(10,2) NULL,
  Quantity INT NULL
);

INSERT INTO stock (Item, Description, Price,Quantity)
VALUES ("stereo", "Panasonic 200W",450.99, 6),("speakers", 'Panasonic 6.5" Two-Way 100W ',65.59, 12),
("tv", 'Sony 52" 1080P HDTV',795.99, 5),("ipod", "80GB Ipod Video 6th Gen",100.99, 2),
("iphone", "Iphone 6S Plus 64GB",545.89, 10),("hard drive", "Samsung 1TB SSD",219.95, 8),
("video card", 'Nvidia GeForce 1080Ti',679.99, 8),("sound card", "SoundBlaster Audigy 2",97.99,11),
("soundbar", 'Sony 100W All-in-One Surround',195.99, 6),("game console", "XBox One S 1 TB",321.99, 18);


