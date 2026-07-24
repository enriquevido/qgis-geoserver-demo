CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS lotes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('ocupado', 'disponible')),
    fecha_registro DATE,
    geom GEOMETRY(POLYGON, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lotes_geom ON lotes USING GIST (geom);

-- Grid de tumbas en el Panteón de Dolores, CDMX
-- Cada tumba mide ~4m × 7m (0.00004° × 0.00007° en 4326)
-- Separación horizontal ~3m, vertical ~4m (pasillos)

INSERT INTO lotes (nombre, estado, fecha_registro, geom) VALUES

-- Fila A (5 tumbas)
('Tumba-A1', 'ocupado',    '2020-03-15',
 ST_GeomFromText('POLYGON((-99.19370 19.42044, -99.19366 19.42044, -99.19366 19.42051, -99.19370 19.42051, -99.19370 19.42044))', 4326)),

('Tumba-A2', 'disponible', NULL,
 ST_GeomFromText('POLYGON((-99.19363 19.42044, -99.19359 19.42044, -99.19359 19.42051, -99.19363 19.42051, -99.19363 19.42044))', 4326)),

('Tumba-A3', 'ocupado',    '2021-07-22',
 ST_GeomFromText('POLYGON((-99.19356 19.42044, -99.19352 19.42044, -99.19352 19.42051, -99.19356 19.42051, -99.19356 19.42044))', 4326)),

('Tumba-A4', 'disponible', NULL,
 ST_GeomFromText('POLYGON((-99.19349 19.42044, -99.19345 19.42044, -99.19345 19.42051, -99.19349 19.42051, -99.19349 19.42044))', 4326)),

('Tumba-A5', 'ocupado',    '2022-01-10',
 ST_GeomFromText('POLYGON((-99.19342 19.42044, -99.19338 19.42044, -99.19338 19.42051, -99.19342 19.42051, -99.19342 19.42044))', 4326)),

-- Fila B (5 tumbas)
('Tumba-B1', 'ocupado',    '2023-05-18',
 ST_GeomFromText('POLYGON((-99.19370 19.42055, -99.19366 19.42055, -99.19366 19.42062, -99.19370 19.42062, -99.19370 19.42055))', 4326)),

('Tumba-B2', 'disponible', NULL,
 ST_GeomFromText('POLYGON((-99.19363 19.42055, -99.19359 19.42055, -99.19359 19.42062, -99.19363 19.42062, -99.19363 19.42055))', 4326)),

('Tumba-B3', 'ocupado',    '2024-11-30',
 ST_GeomFromText('POLYGON((-99.19356 19.42055, -99.19352 19.42055, -99.19352 19.42062, -99.19356 19.42062, -99.19356 19.42055))', 4326)),

('Tumba-B4', 'disponible', NULL,
 ST_GeomFromText('POLYGON((-99.19349 19.42055, -99.19345 19.42055, -99.19345 19.42062, -99.19349 19.42062, -99.19349 19.42055))', 4326)),

('Tumba-B5', 'ocupado',    '2025-02-14',
 ST_GeomFromText('POLYGON((-99.19342 19.42055, -99.19338 19.42055, -99.19338 19.42062, -99.19342 19.42062, -99.19342 19.42055))', 4326));
