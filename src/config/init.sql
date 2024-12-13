-- Active: 1730134174619@@127.0.0.1@5432@joyas
CREATE DATABASE joyas;

\c joyas;

CREATE TABLE inventario (id SERIAL, nombre VARCHAR(50), categoria
VARCHAR(50), metal VARCHAR(50), precio INT, stock INT);

INSERT INTO inventario values
(DEFAULT, 'Collar Heart', 'collar', 'oro', 20000 , 2),
(DEFAULT, 'Collar History', 'collar', 'plata', 15000 , 5),
(DEFAULT, 'Aros Berry', 'aros', 'oro', 12000 , 10),
(DEFAULT, 'Aros Hook Blue', 'aros', 'oro', 25000 , 4),
(DEFAULT, 'Anillo Wish', 'aros', 'plata', 30000 , 4),
(DEFAULT, 'Anillo Cuarzo Greece', 'anillo', 'oro', 40000 , 2);

DROP TABLE inventario;
SELECT * FROM inventario;