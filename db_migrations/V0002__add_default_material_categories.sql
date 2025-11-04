-- Добавление категорий материалов по умолчанию
INSERT INTO material_categories (name) VALUES 
('Металлы'),
('Пластики'),
('Древесина'),
('Расходники'),
('Инструменты')
ON CONFLICT DO NOTHING;