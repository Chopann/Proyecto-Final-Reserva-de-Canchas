-- =====================================================
-- SportBook — Base de Datos PostgreSQL
-- NeuroCode Systems S.A.S · 2026
-- Ejecutar en orden: 1) tablas, 2) datos iniciales
-- =====================================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id_rol      SERIAL PRIMARY KEY,
    nombre_rol  VARCHAR(50) NOT NULL UNIQUE
);

-- 2. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario  SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    correo      VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    telefono    VARCHAR(20),
    id_rol      INT NOT NULL,
    CONSTRAINT fk_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- 3. CANCHAS
CREATE TABLE IF NOT EXISTS canchas (
    id_cancha       SERIAL PRIMARY KEY,
    nombre_cancha   VARCHAR(100) NOT NULL,
    tipo_superficie VARCHAR(50),
    precio_hora     DECIMAL(10,2) NOT NULL,
    estado          VARCHAR(20) DEFAULT 'Disponible'
);

-- 4. RESERVAS
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva  SERIAL PRIMARY KEY,
    id_usuario  INT NOT NULL,
    id_cancha   INT NOT NULL,
    fecha       DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin    TIME NOT NULL,
    monto_total DECIMAL(10,2),
    estado_pago VARCHAR(20) DEFAULT 'Pendiente',
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_cancha  FOREIGN KEY (id_cancha)  REFERENCES canchas(id_cancha),
    CONSTRAINT chk_horario CHECK (hora_inicio < hora_fin)
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Roles
INSERT INTO roles (nombre_rol) VALUES
    ('Administrador'),
    ('Cliente')
ON CONFLICT (nombre_rol) DO NOTHING;

-- Usuarios de prueba
-- Contraseñas hasheadas con BCrypt (password: admin123 y cliente123)
INSERT INTO usuarios (nombre, correo, password, telefono, id_rol) VALUES
    ('Carlos Giraldo Mejía',  'admin@sportbook.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3001234567', 1),
    ('Ana Torres',            'ana@sportbook.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3019876543', 2),
    ('Juan Pérez',            'juan@sportbook.com',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3024567890', 2),
    ('Laura Gómez',           'laura@sportbook.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3005557788', 2)
ON CONFLICT (correo) DO NOTHING;

-- Canchas
INSERT INTO canchas (nombre_cancha, tipo_superficie, precio_hora, estado) VALUES
    ('Cancha Fútbol #1',  'Sintética', 40000.00, 'Disponible'),
    ('Cancha Tenis #2',   'Cemento',   50000.00, 'Disponible'),
    ('Cancha Basket #1',  'Grass',     60000.00, 'Mantenimiento'),
    ('Cancha Fútbol #2',  'Sintética', 45000.00, 'Disponible'),
    ('Cancha Tenis #3',   'Cemento',   55000.00, 'Disponible'),
    ('Cancha Multiuso',   'Grass',     70000.00, 'Disponible');

-- Reservas de prueba
INSERT INTO reservas (id_usuario, id_cancha, fecha, hora_inicio, hora_fin, monto_total, estado_pago) VALUES
    (2, 1, '2026-05-12', '18:00', '20:00', 80000.00,  'Pendiente'),
    (2, 2, '2026-05-15', '10:00', '11:00', 50000.00,  'Pagado'),
    (3, 1, '2026-05-14', '15:00', '17:00', 80000.00,  'Cancelado'),
    (4, 6, '2026-05-25', '08:00', '10:00', 140000.00, 'Pendiente');

-- =====================================================
-- CONSULTAS ÚTILES PARA VERIFICAR
-- =====================================================

-- Ver reservas con info de usuario y cancha:
-- SELECT r.id_reserva, u.nombre, c.nombre_cancha, r.fecha,
--        r.hora_inicio, r.hora_fin, r.monto_total, r.estado_pago
-- FROM reservas r
-- JOIN usuarios u ON r.id_usuario = u.id_usuario
-- JOIN canchas c ON r.id_cancha = c.id_cancha
-- ORDER BY r.fecha;
