-- Script: create_database_and_tables.sql
-- Crea la base de datos `marketplace_db` y la tabla `Usuarios`.
-- Notas: `Celular` se guarda como VARCHAR por compatibilidad con formatos internacionales.

CREATE DATABASE IF NOT EXISTS `marketplace_db`
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;

USE `marketplace_db`;

CREATE TABLE IF NOT EXISTS `Usuarios` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Apellidos` VARCHAR(150) NOT NULL,
  `Pais` VARCHAR(100) DEFAULT NULL,
  `Ciudad` VARCHAR(100) DEFAULT NULL,
  `Celular` VARCHAR(20) DEFAULT NULL,
  `correo` VARCHAR(255) DEFAULT NULL,
  `vendedor` TINYINT(1) NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `uniq_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Opcional: ejemplo para crear un usuario y otorgar permisos (descomentar y ajustar contraseña si quieres usarlo)
-- CREATE USER 'market_user'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
-- GRANT ALL PRIVILEGES ON `marketplace_db`.* TO 'market_user'@'localhost';
-- FLUSH PRIVILEGES;


-- Tabla: Productos
CREATE TABLE IF NOT EXISTS `Productos` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Vendedor` INT NOT NULL,
  `Nombre` VARCHAR(255) NOT NULL,
  `Descripcion` TEXT DEFAULT NULL,
  `Estado` VARCHAR(255) DEFAULT NULL,
  `Categoria` VARCHAR(100) DEFAULT NULL,
  `Especificacion` TEXT DEFAULT NULL,
  `Marca` TEXT DEFAULT NULL,
  `Uso` TEXT DEFAULT NULL,
  `Divisa` VARCHAR(10) DEFAULT 'USD',
  `Precio` INT NOT NULL,
  `Cantidad` INT NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `idx_vendedor` (`Vendedor`),
  CONSTRAINT `fk_product_vendedor` FOREIGN KEY (`Vendedor`) REFERENCES `Usuarios`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: FotosProducto (almacena rutas/URLs de las imágenes)
CREATE TABLE IF NOT EXISTS `FotosProducto` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `ProductoID` INT NOT NULL,
  `Ruta` VARCHAR(1024) NOT NULL,
  `Orden` INT DEFAULT 0,
  PRIMARY KEY (`ID`),
  KEY `idx_producto` (`ProductoID`),
  CONSTRAINT `fk_fotos_producto` FOREIGN KEY (`ProductoID`) REFERENCES `Productos`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Estadisticas (estadísticas por vendedor)
CREATE TABLE IF NOT EXISTS `Estadisticas` (
  `VendedorID` INT NOT NULL,
  `Ventas` INT NOT NULL DEFAULT 0,
  `CalificacionPromedio` DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  `CalificacionesCount` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`VendedorID`),
  CONSTRAINT `fk_estadisticas_vendedor` FOREIGN KEY (`VendedorID`) REFERENCES `Usuarios`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tabla: Reseñas de Producto
CREATE TABLE IF NOT EXISTS `ProductReviews` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `ProductoID` INT NOT NULL,
  `UsuarioID` INT NOT NULL,
  `Calificacion` TINYINT NOT NULL CHECK (`Calificacion` BETWEEN 1 AND 5),
  `Comentario` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_pr_producto` (`ProductoID`),
  CONSTRAINT `fk_pr_producto` FOREIGN KEY (`ProductoID`) REFERENCES `Productos`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pr_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `Usuarios`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Reseñas de Vendedor
CREATE TABLE IF NOT EXISTS `SellerReviews` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `VendedorID` INT NOT NULL,
  `UsuarioID` INT NOT NULL,
  `Calificacion` TINYINT NOT NULL CHECK (`Calificacion` BETWEEN 1 AND 5),
  `Comentario` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_sr_vendedor` (`VendedorID`),
  CONSTRAINT `fk_sr_vendedor` FOREIGN KEY (`VendedorID`) REFERENCES `Usuarios`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sr_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `Usuarios`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Reservas (reservas temporales de productos)
CREATE TABLE IF NOT EXISTS `Reservas` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `ProductoID` INT NOT NULL,
  `UsuarioID` INT NOT NULL,
  `Cantidad` INT NOT NULL DEFAULT 1,
  `Estado` ENUM('reserved','cancelled','completed') NOT NULL DEFAULT 'reserved',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
  PRIMARY KEY (`ID`),
  KEY `idx_res_producto` (`ProductoID`),
  CONSTRAINT `fk_res_producto` FOREIGN KEY (`ProductoID`) REFERENCES `Productos`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_res_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `Usuarios`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- TRIGGER: actualizar estadísticas del vendedor al insertar una reseña de vendedor
DROP TRIGGER IF EXISTS `after_sr_insert`;
DELIMITER $$
CREATE TRIGGER `after_sr_insert` AFTER INSERT ON `SellerReviews`
FOR EACH ROW
BEGIN
  DECLARE avg_val DECIMAL(5,2);
  SELECT IFNULL(AVG(`Calificacion`),0) INTO avg_val FROM `SellerReviews` WHERE `VendedorID` = NEW.`VendedorID`;
  INSERT INTO `Estadisticas` (`VendedorID`,`Ventas`,`CalificacionPromedio`,`CalificacionesCount`)
    VALUES (NEW.`VendedorID`, 0, avg_val, (SELECT COUNT(*) FROM `SellerReviews` WHERE `VendedorID` = NEW.`VendedorID`))
  ON DUPLICATE KEY UPDATE
    `CalificacionPromedio` = avg_val,
    `CalificacionesCount` = (SELECT COUNT(*) FROM `SellerReviews` WHERE `VendedorID` = NEW.`VendedorID`);
END$$
DELIMITER ;


-- TRIGGERS: actualizar estadísticas del vendedor según reseñas de producto
DROP TRIGGER IF EXISTS `after_pr_insert`;
DROP TRIGGER IF EXISTS `after_pr_update`;
DROP TRIGGER IF EXISTS `after_pr_delete`;
DELIMITER $$
CREATE TRIGGER `after_pr_insert` AFTER INSERT ON `ProductReviews`
FOR EACH ROW
BEGIN
  DECLARE seller_id INT;
  DECLARE avg_val DECIMAL(5,2);
  DECLARE cnt INT;
  SELECT p.Vendedor INTO seller_id FROM `Productos` p WHERE p.ID = NEW.ProductoID;
  IF seller_id IS NOT NULL THEN
    SELECT IFNULL(AVG(r.Calificacion),0), IFNULL(COUNT(r.ID),0) INTO avg_val, cnt
      FROM `ProductReviews` r
      JOIN `Productos` p2 ON r.ProductoID = p2.ID
      WHERE p2.Vendedor = seller_id;
    INSERT INTO `Estadisticas` (`VendedorID`,`Ventas`,`CalificacionPromedio`,`CalificacionesCount`)
      VALUES (seller_id, 0, avg_val, cnt)
    ON DUPLICATE KEY UPDATE
      `CalificacionPromedio` = avg_val,
      `CalificacionesCount` = cnt;
  END IF;
END$$

CREATE TRIGGER `after_pr_update` AFTER UPDATE ON `ProductReviews`
FOR EACH ROW
BEGIN
  DECLARE seller_id INT;
  DECLARE avg_val DECIMAL(5,2);
  DECLARE cnt INT;
  SELECT p.Vendedor INTO seller_id FROM `Productos` p WHERE p.ID = NEW.ProductoID;
  IF seller_id IS NOT NULL THEN
    SELECT IFNULL(AVG(r.Calificacion),0), IFNULL(COUNT(r.ID),0) INTO avg_val, cnt
      FROM `ProductReviews` r
      JOIN `Productos` p2 ON r.ProductoID = p2.ID
      WHERE p2.Vendedor = seller_id;
    INSERT INTO `Estadisticas` (`VendedorID`,`Ventas`,`CalificacionPromedio`,`CalificacionesCount`)
      VALUES (seller_id, 0, avg_val, cnt)
    ON DUPLICATE KEY UPDATE
      `CalificacionPromedio` = avg_val,
      `CalificacionesCount` = cnt;
  END IF;
  IF OLD.ProductoID <> NEW.ProductoID THEN
    DECLARE old_seller INT;
    SELECT p.Vendedor INTO old_seller FROM `Productos` p WHERE p.ID = OLD.ProductoID;
    IF old_seller IS NOT NULL AND old_seller <> seller_id THEN
      SELECT IFNULL(AVG(r.Calificacion),0), IFNULL(COUNT(r.ID),0) INTO avg_val, cnt
        FROM `ProductReviews` r
        JOIN `Productos` p2 ON r.ProductoID = p2.ID
        WHERE p2.Vendedor = old_seller;
      INSERT INTO `Estadisticas` (`VendedorID`,`Ventas`,`CalificacionPromedio`,`CalificacionesCount`)
        VALUES (old_seller, 0, avg_val, cnt)
      ON DUPLICATE KEY UPDATE
        `CalificacionPromedio` = avg_val,
        `CalificacionesCount` = cnt;
    END IF;
  END IF;
END$$

CREATE TRIGGER `after_pr_delete` AFTER DELETE ON `ProductReviews`
FOR EACH ROW
BEGIN
  DECLARE seller_id INT;
  DECLARE avg_val DECIMAL(5,2);
  DECLARE cnt INT;
  SELECT p.Vendedor INTO seller_id FROM `Productos` p WHERE p.ID = OLD.ProductoID;
  IF seller_id IS NOT NULL THEN
    SELECT IFNULL(AVG(r.Calificacion),0), IFNULL(COUNT(r.ID),0) INTO avg_val, cnt
      FROM `ProductReviews` r
      JOIN `Productos` p2 ON r.ProductoID = p2.ID
      WHERE p2.Vendedor = seller_id;
    INSERT INTO `Estadisticas` (`VendedorID`,`Ventas`,`CalificacionPromedio`,`CalificacionesCount`)
      VALUES (seller_id, 0, avg_val, cnt)
    ON DUPLICATE KEY UPDATE
      `CalificacionPromedio` = avg_val,
      `CalificacionesCount` = cnt;
  END IF;
END$$
DELIMITER ;


-- PROCEDIMIENTOS SOLICITADOS
DROP PROCEDURE IF EXISTS `CrearUsuario`;
CREATE PROCEDURE `CrearUsuario` (
  IN p_Nombre VARCHAR(100),
  IN p_Apellidos VARCHAR(150),
  IN p_Pais VARCHAR(100),
  IN p_Ciudad VARCHAR(100),
  IN p_Celular VARCHAR(20),
  IN p_correo VARCHAR(255)
)
BEGIN
  INSERT INTO `Usuarios` (`Nombre`,`Apellidos`,`Pais`,`Ciudad`,`Celular`,`correo`)
  VALUES (p_Nombre,p_Apellidos,p_Pais,p_Ciudad,p_Celular,p_correo);
  SELECT LAST_INSERT_ID() AS NuevoUsuarioID;
END;

DROP PROCEDURE IF EXISTS `BorrarUsuario`;
CREATE PROCEDURE `BorrarUsuario` (IN p_UserID INT)
BEGIN
  -- Soft delete: marcar como inactivo
  UPDATE `Usuarios` SET `activo` = 0 WHERE `ID` = p_UserID;
END;

DROP PROCEDURE IF EXISTS `SerVendedor`;
CREATE PROCEDURE `SerVendedor` (IN p_UserID INT)
BEGIN
  UPDATE `Usuarios` SET `vendedor` = 1 WHERE `ID` = p_UserID;
  -- Asegurar fila en Estadisticas
  INSERT INTO `Estadisticas` (`VendedorID`,`Ventas`,`CalificacionPromedio`,`CalificacionesCount`)
    VALUES (p_UserID, 0, 0.00, 0)
  ON DUPLICATE KEY UPDATE `VendedorID` = p_UserID;
END;

DROP PROCEDURE IF EXISTS `CrearProducto`;
CREATE PROCEDURE `CrearProducto` (
  IN p_Vendedor INT,
  IN p_Nombre VARCHAR(255),
  IN p_Descripcion TEXT,
  IN p_Categoria VARCHAR(100),
  IN p_Especificacion TEXT,
  IN p_Divisa VARCHAR(10),
  IN p_Precio INT,
  IN p_Cantidad INT
)
BEGIN
  INSERT INTO `Productos` (`Vendedor`,`Nombre`,`Descripcion`,`Categoria`,`Especificacion`,`Divisa`,`Precio`,`Cantidad`)
  VALUES (p_Vendedor,p_Nombre,p_Descripcion,p_Categoria,p_Especificacion,p_Divisa,p_Precio,p_Cantidad);
  SELECT LAST_INSERT_ID() AS NuevoProductoID;
END;

DROP PROCEDURE IF EXISTS `ReservarProducto`;
CREATE PROCEDURE `ReservarProducto` (
  IN p_ProductoID INT,
  IN p_UsuarioID INT,
  IN p_Cantidad INT
)
BEGIN
  DECLARE current_qty INT;
  SELECT `Cantidad` INTO current_qty FROM `Productos` WHERE `ID` = p_ProductoID AND `activo` = 1 FOR UPDATE;
  IF current_qty IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto no encontrado o inactivo';
  ELSEIF current_qty < p_Cantidad THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cantidad insuficiente para reservar';
  ELSE
    UPDATE `Productos` SET `Cantidad` = `Cantidad` - p_Cantidad WHERE `ID` = p_ProductoID;
    INSERT INTO `Reservas` (`ProductoID`,`UsuarioID`,`Cantidad`,`Estado`) VALUES (p_ProductoID,p_UsuarioID,p_Cantidad,'reserved');
    SELECT LAST_INSERT_ID() AS ReservaID;
  END IF;
END;

DROP PROCEDURE IF EXISTS `BorrarProducto`;
CREATE PROCEDURE `BorrarProducto` (IN p_ProductoID INT)
BEGIN
  -- Soft delete: marcar producto como inactivo
  UPDATE `Productos` SET `Cantidad` = 0, `activo` = 0 WHERE `ID` = p_ProductoID;
END;
