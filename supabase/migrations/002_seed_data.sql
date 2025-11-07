-- =============================================
-- DATOS INICIALES PARA E-COMMERCE
-- =============================================

-- 1. CATEGORÍAS
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Vestidos', 'vestidos', 'Vestidos elegantes para toda ocasión', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8'),
  ('Tops', 'tops', 'Blusas y tops modernos', 'https://images.unsplash.com/photo-1564859228273-274232fdb516'),
  ('Pantalones', 'pantalones', 'Pantalones cómodos y con estilo', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8'),
  ('Faldas', 'faldas', 'Faldas para cualquier estilo', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa'),
  ('Accesorios', 'accesorios', 'Complementa tu outfit', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93'),
  ('Abrigos', 'abrigos', 'Abrigos y chaquetas de temporada', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3')
ON CONFLICT (slug) DO NOTHING;

-- 2. PRODUCTOS DE VESTIDOS
INSERT INTO products (name, description, price, discount_price, category_id, images, sizes, colors, stock, is_featured, rating) VALUES
  (
    'Vestido Floral Primavera',
    'Hermoso vestido con estampado floral perfecto para la primavera. Confeccionado en tela ligera y fresca.',
    89.99,
    69.99,
    (SELECT id FROM categories WHERE slug = 'vestidos'),
    ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['Rosa', 'Azul', 'Blanco'],
    50,
    true,
    4.5
  ),
  (
    'Vestido Negro Elegante',
    'Vestido elegante ideal para eventos formales. Corte clásico y sofisticado.',
    129.99,
    99.99,
    (SELECT id FROM categories WHERE slug = 'vestidos'),
    ARRAY['https://images.unsplash.com/photo-1566174053879-31528523f8ae', 'https://images.unsplash.com/photo-1612622888448-6f37cd4e5bf1'],
    ARRAY['XS', 'S', 'M', 'L'],
    ARRAY['Negro'],
    30,
    true,
    4.8
  ),
  (
    'Vestido Maxi Verano',
    'Vestido largo perfecto para días calurosos. Tela ligera y transpirable.',
    79.99,
    NULL,
    (SELECT id FROM categories WHERE slug = 'vestidos'),
    ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446'],
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Blanco', 'Beige', 'Coral'],
    45,
    false,
    4.3
  );

-- 3. PRODUCTOS DE TOPS
INSERT INTO products (name, description, price, discount_price, category_id, images, sizes, colors, stock, is_featured, rating) VALUES
  (
    'Blusa de Seda Blanca',
    'Blusa elegante de seda natural. Perfecta para la oficina o eventos especiales.',
    59.99,
    49.99,
    (SELECT id FROM categories WHERE slug = 'tops'),
    ARRAY['https://images.unsplash.com/photo-1564859228273-274232fdb516'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['Blanco', 'Negro', 'Nude'],
    60,
    true,
    4.6
  ),
  (
    'Top Casual Rayas',
    'Top casual con rayas horizontales. Cómodo y versátil.',
    34.99,
    NULL,
    (SELECT id FROM categories WHERE slug = 'tops'),
    ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['Azul/Blanco', 'Negro/Blanco', 'Rojo/Blanco'],
    80,
    false,
    4.2
  );

-- 4. PRODUCTOS DE PANTALONES
INSERT INTO products (name, description, price, discount_price, category_id, images, sizes, colors, stock, is_featured, rating) VALUES
  (
    'Jeans Skinny Azul',
    'Jeans ajustados de mezclilla de alta calidad. Diseño moderno y cómodo.',
    69.99,
    54.99,
    (SELECT id FROM categories WHERE slug = 'pantalones'),
    ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8'],
    ARRAY['24', '26', '28', '30', '32'],
    ARRAY['Azul claro', 'Azul oscuro', 'Negro'],
    70,
    true,
    4.7
  ),
  (
    'Pantalón de Vestir',
    'Pantalón elegante para oficina. Corte recto y tela de calidad premium.',
    79.99,
    NULL,
    (SELECT id FROM categories WHERE slug = 'pantalones'),
    ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['Negro', 'Gris', 'Azul marino'],
    55,
    false,
    4.4
  );

-- 5. PRODUCTOS DE FALDAS
INSERT INTO products (name, description, price, discount_price, category_id, images, sizes, colors, stock, is_featured, rating) VALUES
  (
    'Falda Plisada Midi',
    'Falda midi plisada perfecta para cualquier ocasión. Diseño elegante y femenino.',
    54.99,
    44.99,
    (SELECT id FROM categories WHERE slug = 'faldas'),
    ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa'],
    ARRAY['XS', 'S', 'M', 'L'],
    ARRAY['Negro', 'Beige', 'Rosa'],
    40,
    false,
    4.5
  );

-- 6. PRODUCTOS DE ACCESORIOS
INSERT INTO products (name, description, price, discount_price, category_id, images, sizes, colors, stock, is_featured, rating) VALUES
  (
    'Bolso de Cuero Premium',
    'Bolso de mano en cuero genuino. Diseño atemporal y elegante.',
    149.99,
    119.99,
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    ARRAY['https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93'],
    ARRAY['Único'],
    ARRAY['Negro', 'Marrón', 'Camel'],
    25,
    true,
    4.9
  ),
  (
    'Collar Dorado Minimalista',
    'Collar delicado de oro de 18k. Perfecto para el día a día.',
    89.99,
    NULL,
    (SELECT id FROM categories WHERE slug = 'accesorios'),
    ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'],
    ARRAY['Único'],
    ARRAY['Dorado'],
    100,
    false,
    4.6
  );

-- 7. PRODUCTOS DE ABRIGOS
INSERT INTO products (name, description, price, discount_price, category_id, images, sizes, colors, stock, is_featured, rating) VALUES
  (
    'Abrigo de Lana Clásico',
    'Abrigo largo de lana para invierno. Cálido y elegante.',
    199.99,
    159.99,
    (SELECT id FROM categories WHERE slug = 'abrigos'),
    ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3'],
    ARRAY['XS', 'S', 'M', 'L', 'XL'],
    ARRAY['Camel', 'Negro', 'Gris'],
    35,
    true,
    4.8
  );

-- =============================================
-- FINALIZADO
-- =============================================
