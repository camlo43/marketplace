-- S-- =======================================================
--  BASE DE DATOS MARKETPLACE (MySQL 9 COMPATIBLE)
-- =======================================================

DROP DATABASE IF EXISTS marketplace_db;
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marketplace_db;

-- =======================================================
--  TABLA: Usuarios
-- =======================================================

CREATE TABLE Usuarios (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(100) NOT NULL,
  Apellidos VARCHAR(150) NOT NULL,
  Pais VARCHAR(100),
  Ciudad VARCHAR(100),
  Celular VARCHAR(20),
  correo VARCHAR(255) UNIQUE,
  vendedor TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =======================================================
--  TABLA: Productos
-- =======================================================

CREATE TABLE Productos (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Vendedor INT NOT NULL,
  Nombre VARCHAR(255) NOT NULL,
  Descripcion TEXT,
  Estado VARCHAR(255),
  Categoria VARCHAR(100),
  Especificacion TEXT,
  Marca TEXT,
  Uso TEXT,
  Divisa VARCHAR(10) DEFAULT 'USD',
  Precio INT NOT NULL,
  Cantidad INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (Vendedor) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

-- =======================================================
--  TABLA: FotosProducto
-- =======================================================

CREATE TABLE FotosProducto (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  ProductoID INT NOT NULL,
  Ruta VARCHAR(1024) NOT NULL,
  Orden INT DEFAULT 0,
  FOREIGN KEY (ProductoID) REFERENCES Productos(ID) ON DELETE CASCADE
);

-- =======================================================
--  TABLA: Estadisticas
-- =======================================================

CREATE TABLE Estadisticas (
  VendedorID INT PRIMARY KEY,
  Ventas INT NOT NULL DEFAULT 0,
  CalificacionPromedio DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  CalificacionesCount INT NOT NULL DEFAULT 0,
  FOREIGN KEY (VendedorID) REFERENCES Usuarios(ID) ON DELETE CASCADE
);

-- =======================================================
--  TABLA: ProductReviews
-- =======================================================

CREATE TABLE ProductReviews (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  ProductoID INT NOT NULL,
  UsuarioID INT,
  Calificacion TINYINT CHECK (Calificacion BETWEEN 1 AND 5),
  Comentario TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductoID) REFERENCES Productos(ID) ON DELETE CASCADE,
  FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID) ON DELETE SET NULL
);

-- =======================================================
--  TABLA: SellerReviews
-- =======================================================

CREATE TABLE SellerReviews (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  VendedorID INT NOT NULL,
  UsuarioID INT,
  Calificacion TINYINT CHECK (Calificacion BETWEEN 1 AND 5),
  Comentario TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (VendedorID) REFERENCES Usuarios(ID) ON DELETE CASCADE,
  FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID) ON DELETE SET NULL
);

-- =======================================================
--  TABLA: Reservas
-- =======================================================

CREATE TABLE Reservas (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  ProductoID INT NOT NULL,
  UsuarioID INT,
  Cantidad INT NOT NULL DEFAULT 1,
  Estado ENUM('reserved','cancelled','completed') DEFAULT 'reserved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
  FOREIGN KEY (ProductoID) REFERENCES Productos(ID) ON DELETE CASCADE,
  FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID) ON DELETE SET NULL
);

-- =======================================================
--  TRIGGERS (MODO CORRECTO PARA MYSQL 9)
-- =======================================================

DELIMITER $$

CREATE TRIGGER trg_seller_review_insert
AFTER INSERT ON SellerReviews
FOR EACH ROW
BEGIN
  UPDATE Estadisticas SET
    CalificacionPromedio = (
      SELECT AVG(Calificacion) FROM SellerReviews WHERE VendedorID = NEW.VendedorID
    ),
    CalificacionesCount = (
      SELECT COUNT(*) FROM SellerReviews WHERE VendedorID = NEW.VendedorID
    )
  WHERE VendedorID = NEW.VendedorID;

  INSERT IGNORE INTO Estadisticas (VendedorID) VALUES (NEW.VendedorID);
END$$

-- =======================================================

CREATE TRIGGER trg_product_review_insert
AFTER INSERT ON ProductReviews
FOR EACH ROW
BEGIN
  DECLARE seller_id INT;

  SELECT Vendedor INTO seller_id FROM Productos WHERE ID = NEW.ProductoID;

  INSERT IGNORE INTO Estadisticas (VendedorID) VALUES (seller_id);

  UPDATE Estadisticas SET
    CalificacionPromedio = (
      SELECT AVG(r.Calificacion)
      FROM ProductReviews r
      JOIN Productos p ON r.ProductoID = p.ID
      WHERE p.Vendedor = seller_id
    ),
    CalificacionesCount = (
      SELECT COUNT(r.ID)
      FROM ProductReviews r
      JOIN Productos p ON r.ProductoID = p.ID
      WHERE p.Vendedor = seller_id
    )
  WHERE VendedorID = seller_id;
END$$

DELIMITER ;

-- =======================================================
--  PROCEDIMIENTOS AL 100%
-- =======================================================

DELIMITER $$

CREATE PROCEDURE CrearUsuario(
  IN n VARCHAR(100), a VARCHAR(150),
  IN pa VARCHAR(100), ci VARCHAR(100),
  IN ce VARCHAR(20), co VARCHAR(255)
)
BEGIN
  INSERT INTO Usuarios (Nombre,Apellidos,Pais,Ciudad,Celular,correo)
  VALUES (n,a,pa,ci,ce,co);
  SELECT LAST_INSERT_ID() AS NuevoUsuarioID;
END$$

CREATE PROCEDURE SerVendedor(IN uid INT)
BEGIN
  UPDATE Usuarios SET vendedor = 1 WHERE ID = uid;
  INSERT IGNORE INTO Estadisticas (VendedorID) VALUES (uid);
END$$

CREATE PROCEDURE CrearProducto(
  IN v INT, n VARCHAR(255),
  d TEXT, c VARCHAR(100),
  e TEXT, divi VARCHAR(10),
  p INT, cant INT
)
BEGIN
  INSERT INTO Productos (Vendedor,Nombre,Descripcion,Categoria,Especificacion,Divisa,Precio,Cantidad)
  VALUES (v,n,d,c,e,divi,p,cant);
  SELECT LAST_INSERT_ID() AS NuevoProductoID;
END$$

CREATE PROCEDURE ReservarProducto(
  IN pid INT, uid INT, qty INT
)
BEGIN
  DECLARE stock INT;

  SELECT Cantidad INTO stock FROM Productos WHERE ID = pid AND activo = 1;

  IF stock IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto inexistente o inactivo';
  ELSEIF stock < qty THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cantidad insuficiente';
  ELSE
    UPDATE Productos SET Cantidad = Cantidad - qty WHERE ID = pid;
    INSERT INTO Reservas (ProductoID,UsuarioID,Cantidad) VALUES (pid,uid,qty);
    SELECT LAST_INSERT_ID() AS ReservaID;
  END IF;
END$$

DELIMITER ;
