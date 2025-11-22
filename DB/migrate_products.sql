-- Script para migrar productos mock a MySQL
-- Ejecutar: mysql -u root -p1042849815 < DB/migrate_products.sql

USE marketplace_db;

-- Insertar los primeros 25 productos mock
-- Vendedor ID = 1 (camilo chaves)

INSERT INTO Productos (Vendedor, Nombre, Descripcion, Estado, Categoria, Especificacion, Marca, Uso, Divisa, Precio, Cantidad) VALUES
(1, 'Pastillas de Freno Delanteras Brembo', 'Pastillas de freno de alto rendimiento diseñadas para conducción diaria y deportiva. Cuenta con un compuesto cerámico para bajo ruido y vida útil extendida del rotor.', 'Nuevo', 'Frenos', 'Honda Civic 2016-2021, Honda Accord 2018-2022', 'Brembo', 'Sistema de frenado delantero. Proporciona una potencia de frenado superior y reduce el polvo de los frenos.', 'COP', 183960, 10),

(1, 'Filtro de Aceite Bosch', 'Filtro de aceite premium con 99.9% de eficiencia. La exclusiva tecnología de medios FILTECH filtra más contaminantes dañinos para una mayor protección del motor.', 'Nuevo', 'Filtros', 'Toyota Corolla 2010-2019, Toyota Camry 2012-2017', 'Bosch', 'Filtración de aceite del motor. Elimina contaminantes para proteger los componentes del motor.', 'COP', 50000, 15),

(1, 'Llanta Michelin Pilot Sport 4S', 'El referente para llantas de verano de máximo rendimiento. Ofrece un agarre excepcional, precisión en la dirección y rendimiento de frenado en mojado/seco.', 'Nuevo', 'Llantas', 'Universal (Verificar tamaño de llanta 245/40R19)', 'Michelin', 'Llanta de verano de alto rendimiento para autos deportivos y vehículos de lujo.', 'COP', 980000, 8),

(1, 'Bujías de Iridio NGK (Juego de 4)', 'Las bujías Laser Iridium proporcionan una ignición superior y una larga vida útil. El diámetro de punta más pequeño disponible asegura una tasa de desgaste lenta y un ralentí estable.', 'Nuevo', 'Encendido', 'Subaru WRX 2015-2020, Subaru Forester 2014-2018', 'NGK', 'Sistema de encendido del motor. Entrega una chispa consistente para una combustión óptima.', 'COP', 152000, 20),

(1, 'Aceite de Motor Castrol GTX 5W-30', 'La fórmula de doble acción limpia los sedimentos viejos y protege contra la formación de nuevos sedimentos mejor que los estándares de la industria.', 'Nuevo', 'Fluidos', 'Universal (Verificar manual del propietario para viscosidad)', 'Castrol', 'Lubricación del motor. Protege contra sedimentos y desgaste.', 'COP', 99960, 25),

(1, 'Bombillo de Faro Philips H7', 'Bombillo de reemplazo halógeno estándar. Cumple con DOT y proporciona una iluminación confiable para una conducción nocturna segura.', 'Nuevo', 'Iluminación', 'Universal (Verificar tipo de bombillo H7)', 'Philips', 'Reemplazo de luz baja/alta del faro.', 'COP', 75960, 30),

(1, 'Receptor Estéreo para Auto Pioneer', 'Conectividad Bluetooth, puerto USB y entrada AUX. Usado pero en excelentes condiciones con desgaste cosmético menor.', 'Usado', 'Audio', 'Universal Single DIN', 'Pioneer', 'Sistema de entretenimiento de audio en el tablero.', 'COP', 480000, 3),

(1, 'Filtro de Aire de Alto Rendimiento K&N', 'Filtro de aire lavable y reutilizable. Diseñado para aumentar la potencia y la aceleración mientras proporciona una excelente filtración.', 'Nuevo', 'Filtros', 'Ford F-150 2015-2020, Ford Expedition 2018-2021', 'K&N', 'Admisión de aire del motor. Aumenta la potencia y la aceleración.', 'COP', 220000, 12),

(1, 'Amortiguador Monroe', 'Los amortiguadores OESpectrum proporcionan un nivel excepcional de precisión y control de manejo mientras filtran el ruido, la vibración y la dureza.', 'Nuevo', 'Suspensión', 'Chevrolet Silverado 2007-2013, GMC Sierra 2007-2013', 'Monroe', 'Amortiguación de la suspensión. Mejora la comodidad de conducción y el manejo.', 'COP', 168000, 8),

(1, 'Cámara de Tablero Garmin Mini 2', 'Cámara de tablero pequeña y confiable que graba incidentes automáticamente. El control por voz le permite guardar video, iniciar/detener la grabación de audio y más.', 'Nuevo', 'Electrónica', 'Universal', 'Garmin', 'Grabación de video de eventos de conducción.', 'COP', 519960, 5),

(1, 'Tapetes WeatherTech', 'Medido con láser para un ajuste perfecto. Los materiales del núcleo de alta densidad proporcionan una fricción superficial avanzada a la alfombra, manteniendo el tapete en su lugar.', 'Nuevo', 'Interior', 'Jeep Grand Cherokee 2016-2021', 'WeatherTech', 'Protección del piso contra suciedad, lodo y derrames.', 'COP', 759600, 10),

(1, 'Batería Optima RedTop', 'Batería AGM de alto rendimiento. Entrega la ráfaga de arranque de 5 segundos más fuerte. Hasta 3 veces más vida útil que las baterías estándar.', 'Nuevo', 'Eléctrico', 'Universal (Grupo 35)', 'Optima', 'Potencia de arranque del vehículo.', 'COP', 999960, 6),

(1, 'Sistema de Portaequipajes Thule', 'Sistema completo de portaequipajes que incluye pies, barras y kit de ajuste. Usado por una temporada, excelente condición.', 'Usado', 'Exterior', 'Toyota RAV4 2019-2023', 'Thule', 'Transporte de carga, bicicletas o kayaks en el techo.', 'COP', 1800000, 2),

(1, 'Cera y Lavado Meguiar''s Ultimate', 'Tecnología híbrida de carnauba/polímero sintético para dejar un brillo profundo mientras lavas.', 'Nuevo', 'Cuidado del Auto', 'Universal', 'Meguiar''s', 'Limpieza y protección exterior del vehículo.', 'COP', 59960, 40),

(1, 'Líneas de Freno de Acero Inoxidable StopTech', 'Las líneas de freno de acero inoxidable trenzado reducen la conformidad del sistema y mejoran la sensación y modulación del pedal de freno.', 'Nuevo', 'Frenos', 'BMW Serie 3 (E90) 2006-2011', 'StopTech', 'Mejora la sensación y respuesta del pedal de freno.', 'COP', 340000, 7),

(1, 'Filtro de Aceite Mobil 1 Extended Performance', 'Diseñado para retener más suciedad que los filtros estándar. Protege los motores hasta por 20,000 millas o un año.', 'Nuevo', 'Filtros', 'Honda CR-V 2017-2022, Honda Civic 2016-2021', 'Mobil 1', 'Filtración de aceite del motor para intervalos de cambio extendidos.', 'COP', 59960, 18),

(1, 'Bombillos de Faro Sylvania SilverStar Ultra (Par)', 'El faro más brillante de Sylvania. Luz más blanca para mejor claridad y visión nocturna.', 'Nuevo', 'Iluminación', 'Universal (Verificar tipo de bombillo 9006)', 'Sylvania', 'Reemplazo de faros de alto rendimiento.', 'COP', 199960, 15),

(1, 'Jabón de Lavado de Autos Chemical Guys Mr. Pink', 'Limpiador de superficie superior que elimina suciedad, mugre y escombros sin quitar cera o selladores.', 'Nuevo', 'Cuidado del Auto', 'Universal', 'Chemical Guys', 'Jabón suave para lavado de autos.', 'COP', 39960, 50),

(1, 'Sensor de Oxígeno Denso', 'Diseñado para detectar la cantidad de oxígeno en el flujo de escape. Construido con materiales de alta calidad para durabilidad.', 'Nuevo', 'Motor', 'Toyota Tacoma 2005-2015', 'Denso', 'Monitorea los niveles de oxígeno en los gases de escape.', 'COP', 260000, 9),

(1, 'Amortiguador de Rendimiento Bilstein B6', 'Ideal para vehículos que necesitan un manejo y estabilidad mejorados sin sacrificar la comodidad de conducción. Tecnología de presión de gas monotubo.', 'Nuevo', 'Suspensión', 'BMW Serie 3 (E46) 1999-2005', 'Bilstein', 'Mejora de suspensión de rendimiento.', 'COP', 440000, 6),

(1, 'Subwoofer Kicker de 12 pulgadas', 'Entrega bajos profundos y potentes. Cuenta con un cono rígido moldeado por inyección y refuerzo trasero de 360 grados.', 'Nuevo', 'Audio', 'Universal', 'Kicker', 'Bajos mejorados para sistemas de audio de automóviles.', 'COP', 599960, 8),

(1, 'Limpiaparabrisas Rain-X Latitude', 'Limpiaparabrisas 2 en 1 que limpia y repele el agua. Diseño de hoja de viga contorneada para una distribución uniforme de la presión.', 'Nuevo', 'Exterior', 'Universal (Verificar tamaño 22 pulgadas)', 'Rain-X', 'Limpieza de parabrisas y repelencia al agua.', 'COP', 67960, 25),

(1, 'Rótula Moog', 'Tecnología de rodamiento gusher Problem Solver. Perno tratado térmicamente para resistencia y durabilidad.', 'Nuevo', 'Suspensión', 'Ford Explorer 2002-2010', 'Moog', 'Reemplazo del punto de pivote de la suspensión.', 'COP', 140000, 12),

(1, 'Transmisor FM Bluetooth Anker Roav', 'Conexión estable y sonido claro. Cuenta con puertos USB duales para cargar dispositivos mientras conduces.', 'Nuevo', 'Electrónica', 'Universal (Requiere toma de encendedor)', 'Anker', 'Transmisión de audio Bluetooth al estéreo del auto.', 'COP', 91960, 20),

(1, 'Protector Solar Personalizado Covercraft', 'Patrón personalizado para un ajuste perfecto. La construcción de triple laminado proporciona aislamiento y protección contra los rayos UV.', 'Nuevo', 'Interior', 'Ford Mustang 2015-2023', 'Covercraft', 'Protección solar del parabrisas.', 'COP', 220000, 10);

-- Verificar productos insertados
SELECT COUNT(*) as total_productos FROM Productos;
SELECT ID, Nombre, Marca, Precio FROM Productos ORDER BY ID DESC LIMIT 10;
