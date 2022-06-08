CREATE DATABASE IF NOT EXISTS dockerapp;

USE dockerapp;

CREATE TABLE `dockerapp`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`));

CREATE TABLE `dockerapp`.`s`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `timestamp` VARCHAR(45) DEFAULT NULL,
  `hash` INT DEFAULT NULL, 
  PRIMARY KEY (`id`),
  FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE CASCADE);
  
  CREATE TABLE `dockerapp`.`a`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `hashEnviado` INT DEFAULT NULL,
  `timestamp` VARCHAR(45) DEFAULT NULL,
  `respuesta` VARCHAR(45) DEFAULT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE CASCADE);
