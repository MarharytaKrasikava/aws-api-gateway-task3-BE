--create table product_list (
--	id uuid primary key default uuid_generate_v4(),
--	title text not null,
--	description text,
--	price INT	
--)

--CREATE EXTENSION if NOT EXISTS "uuid-ossp";

--ALTER TABLE product_list
--  RENAME TO products;

--create table stocks (
--	product_id uuid,
--	count INT,
--	foreign key ("product_id") references "products" ("id")
--)

--insert into products (title, description, price) values 
--('Turbo', 'Multicolor, bigger flowers', 6),
--('Cordana', 'Multicolor, most popular', 5),
--('Patio', 'Pink, amuzing flower shape and fragrance', 7)

--insert into products (title, description, price) values 
--('Green Ice', 'White-green, stylized flowers shape', 7.5),
--('Burbon rose', 'Red, bigger bush and flowers', 5),
--('Rosa tea', 'Multicolor, doubled petals, fragranå', 6),
--('Chinese rose', 'Multicolor, small flowers, low bushes', 6.5)

--update products 
--set title = 'Rose Tea'
--where id = '1ed506fb-8846-4dfb-aaf8-032671ad0700'

insert into stocks (product_id, count) values 
('1ccca29a-fdae-4318-a601-05ee5ae270b4', 10),
('1f42c180-e195-4c02-87bf-523f50cc3704', 12),
('0824f549-136a-445b-9216-ff14d456d7d9', 8),
('82f526b4-8866-49b7-9148-25983aa55a95', 7), 
('2e190d83-4f3b-407c-ad55-0a251b3481e9', 10),
('ae23f87c-0d67-433d-8093-771da7573c22', 5),
('1ed506fb-8846-4dfb-aaf8-032671ad0700', 7)