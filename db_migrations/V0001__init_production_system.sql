-- Пользователи системы
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'director', 'manager', 'worker')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Разделы материалов
CREATE TABLE IF NOT EXISTS material_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Цвета для материалов
CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Материалы
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES material_categories(id),
    name VARCHAR(255) NOT NULL,
    color_id INTEGER REFERENCES colors(id),
    auto_deduct BOOLEAN DEFAULT false,
    manual_deduct BOOLEAN DEFAULT false,
    defect BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Остатки материалов
CREATE TABLE IF NOT EXISTS material_stock (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    added_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заявки
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Позиции заявок
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    material_id INTEGER REFERENCES materials(id),
    color_id INTEGER REFERENCES colors(id),
    quantity_required INTEGER NOT NULL,
    quantity_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- График рабочего времени
CREATE TABLE IF NOT EXISTS work_schedule (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    work_date DATE NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, work_date)
);

-- Вставка администратора по умолчанию
INSERT INTO users (login, password, full_name, role, status) 
VALUES ('admin', 'adminik', 'Администратор', 'admin', 'active')
ON CONFLICT (login) DO NOTHING;

-- Добавление демо-данных для цветов
INSERT INTO colors (name, hex_code) VALUES 
('Красный', '#ef4444'),
('Синий', '#3b82f6'),
('Зелёный', '#22c55e'),
('Жёлтый', '#eab308'),
('Чёрный', '#000000'),
('Белый', '#ffffff')
ON CONFLICT DO NOTHING;