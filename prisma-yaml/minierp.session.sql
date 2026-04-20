CREATE TYPE status_type AS ENUM ('pending', 'ok', 'cancel');
CREATE TYPE shift_type AS ENUM ('C1x8', 'C2x8', 'C1x12', 'C2x12', 'C3x8');
CREATE TABLE roles (
    id serial PRIMARY KEY,
    role_name varchar(50),
    priority_level integer NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users (
    id serial PRIMARY KEY,
    username varchar(50) NOT NULL,
    password_hash text NOT NULL,
    full_name varchar(100),
    role_id integer,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_active boolean, -- use to delete
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);
CREATE TABLE teams (
    id serial PRIMARY KEY,
    team_name varchar(50),
    user_id integer ,
    CONSTRAINT fk_team_user FOREIGN KEY (user_id) REFERENCES users(id) on DELETE set null
);

CREATE TABLE ingredients (
  id serial PRIMARY KEY,
  ingredient_code varchar(20) NOT NULL,
  ingredient_name text,
  unit varchar(15),
  description varchar(50),
  CONSTRAINT unique_ingredient_code UNIQUE (ingredient_code),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id serial PRIMARY KEY,
  product_code varchar(20) NOT NULL,
  product_name text,
  unit varchar(50),
  description text,
  CONSTRAINT unique_product_code UNIQUE (product_code),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE formulas (
    id serial PRIMARY KEY,
    formula_code integer,
    formula_name text,
    product_id integer ,
    is_active boolean,
    product_line text,
    specification varchar(50),
    color varchar(10),
    type_of_specification varchar(10),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    created_by text,
    CONSTRAINT unique_formula_code UNIQUE (formula_code),
    CONSTRAINT fk_formula_product FOREIGN KEY (product_id) REFERENCES products(id) on DELETE set null
);

CREATE TABLE formula_details (
  id serial PRIMARY KEY,
  formula_id integer,
  ingredient_id integer,
  standard_quality float,

  CONSTRAINT fk_formulaDetail_formula FOREIGN KEY (formula_id) REFERENCES formulas(id) on DELETE set null,
  CONSTRAINT fk_formulaDetail_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) on delete set null
);

CREATE TABLE product_orders (
  id serial PRIMARY KEY,
  order_date date,
  formula_id integer,
  team_id integer,
  product_shift shift_type,
  target_quantity float,
  urea_rate float,
  status status_type,
  input_temprature_1 integer,
  output_temprature_1 integer,
  input_temprature_2 integer,
  output_temprature_2 integer,
  order_note text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  created_by text,
    CONSTRAINT fk_order_formula FOREIGN KEY (formula_id) REFERENCES formulas(id) on delete set null,
    CONSTRAINT fk_order_team FOREIGN key (team_id) REFERENCES teams(id) on delete set null
);

CREATE TABLE material_reports (
  id serial PRIMARY KEY,
  team_id integer,
  report_date date,
  shift shift_type,
  start_time time,
  end_time time,
  extral_materials JSONB default'[]'::jsonb,
  foreman_check boolean,
  CONSTRAINT fk_material_team FOREIGN KEY (team_id) REFERENCES teams(id) on delete set null
);
CREATE TABLE material_details (
    id serial PRIMARY KEY,
    material_id integer,
    ingredient_id integer,
    weight float,
    real_percent float,
    note text,

    CONSTRAINT fk_materialDetail_material FOREIGN KEY (material_id) REFERENCES material_Reports(id) on delete set null,
    CONSTRAINT fk_materialDetail_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) on delete set null
);

CREATE TABLE product_reports (
  id serial PRIMARY KEY,
  report_date date,
  team_id integer,
  furnace integer,
  shift shift_type,
  start_time time,
  end_time time,
  -- "product_report_jsonb" jsonb,
  warehouse_check boolean,
  producttion_check boolean,

  CONSTRAINT fk_productReport_team FOREIGN KEY (team_id) REFERENCES teams(id)
);


CREATE TABLE reports_products(
  id serial primary key,
  product_id integer,
  report_id integer,
  weight_ float,
  is_finish  boolean,
  type_of_specification varchar(20),
  product_line text,
  specification text,
  start_time time,
  end_time time,
  note_ text,
  CONSTRAINT fk_reportProduct_products FOREIGN key (product_id) REFERENCES products(id),
  CONSTRAINT fk_reportProduct_report FOREIGN KEY (report_id) REFERENCES product_Reports(id)
);

CREATE TABLE production_logs (
  id serial PRIMARY KEY,
  log_date date,
  log_start time,
  log_end time,
  number_of_employee integer,
  on_work integer,
  unauthorized_absence text,
  authorized_absence text,
  HT_di text,
  HT_den text,
  forklift text,
  shift_leader text,
  team_id integer,
  electric integer,
  extral_logs JSONB default'[]'::jsonb,

  CONSTRAINT fk_ProductLogs_Teams FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- ---------------------------------------------------------------
-- CREATE TABLE Roles (
--     "role_id" serial PRIMARY KEY,
--     "role_name" varchar(50),
--     "priority_level" integer NOT NULL,
--     "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
-- );
INSERT INTO roles(role_name, priority_level) values
('Administrator',0),
('CEO',1),
('Deputy Director',2),
('Department',3),
('Staff',4),
('Staff',5);

SELECT * FROM roles;

-- CREATE TABLE Users (
--     "id" serial PRIMARY KEY,
--     "username" char(20) NOT NULL,
--     "password_hash" text NOT NULL,
--     "full_name" varchar(100),
--     "role_id" integer,
--     "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
--     "is_active" boolean, -- use to delete
--     CONSTRAINT fk_user_role FOREIGN KEY (id) REFERENCES Roles(role_id) ON DELETE SET NULL
-- );

INSERT INTO users(username, password_hash, full_name, role_id,is_active) values
  ('admin','admin','Admin', 1, true),
  ('ceo', 'binhdien2','Tên CEO', 2, true),
  ('director','binhdien2', 'Tên Tổng giám đốc',3,true),
  ('manager', 'binhdien2', 'Tên GĐ Sản Xuất',4,true),
  ('psx','binhdien2', 'Phòng Sản Xuất',5,true),
  ('vpkho', 'binhdien2','Văn Phòng Kho',6,true),
  ('kho', 'binhdien2', 'Kho', 6, true),
  ('sx1', 'binhdien2', 'Sản xuất 1',6,true),
  ('sx2', 'binhdien2', 'Sản xuất 2',6,true),
  ('sx3', 'binhdien2', 'Sản xuất 3',6,true);
-- SELECT * FROM Users;
-- SELECT u.username,u.full_name, r.role_name FROM Users u INNER JOIN Roles r ON u.id = r.role_id;


-- CREATE TABLE Teams (
--     "team_id" serial PRIMARY KEY,
--     "team_name" varchar(50),
--     "leader_id" integer ,

--     CONSTRAINT fk_team_user FOREIGN KEY (leader_id) REFERENCES Users(id) on DELETE set null
-- );
INSERT INTO teams(team_name, user_id) values
  ('Sản xuất 1',8),('Sản xuất 2',9),('Sản xuất 3',10);
-- SELECT * FROM Teams;
-- select s.team_name, u.full_name FROM Teams s INNER JOIN Users u ON s.leader_id = u.id;

-- CREATE TABLE Ingredients (
--   "id" serial PRIMARY KEY,
--   "ingredient_code" char(10) NOT NULL,
--   "ingredient_name" text,
--   "unit" varchar(15),
--   "description" varchar(50),
--   "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
-- );
INSERT INTO ingredients (ingredient_code, ingredient_name, unit, description) VALUES
('NL001', 'Bột canxi (CaCO3)', 'Kg', 'Bột đá'),
('NL002', 'DAP Xanh 18-46-0', 'Kg', ''),
('NL003', 'DAP Xanh 60', 'Kg', ''),
('NL004', 'DAP xanh (16-44-0)', 'Kg', ''),
('NL005', 'KCl miểng đỏ', 'Kg', ''),
('NL006', 'SA TQ CAPRO tinh thể', 'Kg', ''),
('NL007', 'SA (20.5) bột trắng', 'Kg', ''),
('NL008', 'Urea Hạt Tím (TN)', 'Kg', ''),
('NL009', 'Bột Thạch cao tinh', 'Kg', ''),
('NL010', 'BTP 16.20.0+TE Plus Đen', 'Kg', ''),
('NL011', 'BTP 12.5.5+TE Đen', 'Kg', ''),
('NL012', 'BTP 12-5-5 CPC lúa', 'Kg', ''),
('NL013', 'BTP cải tạo đất (phế sấy)', 'Kg', ''),
('NL014', 'BTP 12.5.5+TE (ECO, 6 lít, CPC) 24.0.24', 'Kg', ''),
('NL015', 'BTP 12.5.5+TE (ECO, 8.5 lít, CPC) 25.2.18', 'Kg', ''),
('NL016', 'Chitosan', 'Kg', ''),
('NL017', 'DAP Nâu Tường Nguyên (18-46-0)', 'Kg', ''),
('NL018', 'DAP TQ (18-46)', 'Kg', ''),
('NL019', 'DAP ĐEN TQ (16-44)', 'Kg', ''),
('NL020', 'Phân DAP Đen Trung Quốc (18-46-0)', 'Kg', ''),
('NL021', 'DAP (15-45-0) LÀO CAI', 'Kg', ''),
('NL022', 'DAP (15-45-0)', 'Kg', ''),
('NL023', 'Kali bột lào', 'Kg', ''),
('NL024', 'Kali bột đỏ', 'Kg', ''),
('NL025', 'KCL cám đỏ', 'Kg', ''),
('NL026', 'NP 11-42', 'Kg', ''),
('NL027', 'MAP 10-50', 'Kg', ''),
('NL028', 'Phân UREA hạt đục', 'Kg', ''),
('NL029', 'Phân UREA Malaysia hạt đục', 'Kg', ''),
('NL030', 'Phân UREA hạt trong nhỏ', 'Kg', ''),
('NL031', 'Cao lanh tinh trắng (công thức)', 'Kg', ''),
('NL032', 'Cao lanh tinh trắng (vi lượng)', 'Kg', ''),
('NL033', 'Bột màu tinh Đen (Black N)', 'Kg', ''),
('NL034', 'Bột màu tinh Đen (Black P)', 'Kg', ''),
('NL035', 'Bột Secpentine', 'Kg', ''),
('NL036', 'Bột Dolomite', 'Kg', ''),
('NL037', 'Hỗn Hợp Vi Lượng', 'Kg', ''),
('NL038', 'PARAFIN (lít/tấn)', 'Lít', ''),
('NL039', 'Mangan MnSO4', 'Kg', ''),
('NL040', 'Mangan MnSO4.H2O', 'Kg', ''),
('NL041', 'NP 12-40', 'Kg', ''),
('NL042', 'NK (42-5)', 'Kg', ''),
('NL043', 'Acid Humic', 'Kg', ''),
('NL044', 'ECO NANO MIX (lít /tấn)', 'Lít', ''),
('NL045', 'Phế Tạp', 'Kg', ''),
('NL046', 'Phế đã xử lý', 'Kg', ''),
('NL047', 'K2SO4 chạy máy', 'Kg', ''),
('NL048', 'Đồng CuSO4', 'Kg', ''),
('NL049', 'Sắt FeSO4.7H2O', 'Kg', ''),
('NL050', 'Kẽm ZnSO4.7H2O', 'Kg', ''),
('NL051', 'Borat Na2B4O7.5H2O', 'Kg', ''),
('NL052', 'Kali bột đỏ, trắng', 'Kg', ''),
('NL053', 'Phân Kali bột trắng', 'Kg', ''),
('NL054', 'Kali SUN PHÁT (K2SO4 bột trắng) tinh thể', 'Kg', ''),
('NL055', 'Phân KCL Sulphate (K2SO4)', 'Kg', ''),
('NL056', 'SA capro tinh thể bao trắng(21% N)', 'Kg', ''),
('NL057', 'Bột màu Tím (Violet 4BS) - PT', 'Kg', ''),
('NL058', 'Bột màu Pigment Green 5G', 'Kg', ''),
('NL059', 'Màu Blue-A', 'Kg', ''),
('NL060', 'Cám btp 15-30-5', 'Kg', ''),
('NL061', 'MAP tinh thể 12-61', 'Kg', ''),
('NL062', 'DAP tinh thể', 'Kg', ''),
('NL063', 'Bột SILICA', 'Kg', ''),
('NL064', 'EDTA Mn 12%', 'Kg', ''),
('NL065', 'EDTA Mg6%', 'Kg', ''),
('NL066', 'EDTA Cu 6%', 'Kg', ''),
('NL067', 'EDTA Ca 10%', 'Kg', ''),
('NL068', 'EDTA Zn', 'Kg', ''),
('NL069', 'ACID BORIC(H3BO3)', 'Kg', ''),
('NL070', 'BTP 15.30.0 Đen', 'Kg', ''),
('NL071', 'BTP 15.30.5 Đen', 'Kg', ''),
('NL072', 'Cám SA', 'Kg', ''),
('NL073', 'Cám DAP', 'Kg', ''),
('NL074', 'Cám 20-20-15 (1 hạt)', 'Kg', ''),
('NL075', 'Cám 15-8-18', 'Kg', ''),
('NL076', 'Cám 15-15-15', 'Kg', ''),
('NL077', 'Cám 10-5-27', 'Kg', ''),
('NL078', 'Cám 16-6-18', 'Kg', ''),
('NL079', 'Cám 18-14-6', 'Kg', ''),
('NL080', 'Phế Cyclon', 'Kg', ''),
('NL081', '15-15-15 K2SO4 XL', 'Kg', ''),
('NL082', '16-16-8 XỬ LÝ LẠI', 'Kg', ''),
('NL083', '16-6-18 XL', 'Kg', ''),
('NL084', '15-7-17 THIẾU', 'Kg', ''),
('NL085', '16-8-16 THIẾU', 'Kg', ''),
('NL086', '20-20-15 thiếu p', 'Kg', ''),
('NL087', '19-4-18 THIẾU', 'Kg', ''),
('NL088', 'BTP 10-5-27 + TE PLUS', 'Kg', ''),
('NL089', 'BTP 10-5-27 + TE PLUS (1 hạt, K2SO4)', 'Kg', ''),
('NL090', 'BTP 15-7-17 TE Plus bao tạm', 'Kg', ''),
('NL091', 'BTP 15-15-15 TE Plus bao tạm', 'Kg', ''),
('NL092', 'BTP 15-15-15 TE K2SO4 bao tạm', 'Kg', ''),
('NL093', 'BTP 15-8-18 bao tạm', 'Kg', ''),
('NL094', 'BTP 16-16-8+9S bao tạm', 'Kg', ''),
('NL095', 'BTP 16-16-8 9s TE PLUS bao tạm', 'Kg', ''),
('NL096', 'BTP 16-6-18 bao tạm', 'Kg', ''),
('NL097', 'BTP 16-6-18 ECO Bao tạm', 'Kg', ''),
('NL098', 'BTP 16-6-18+TE (CH, CPC)', 'Kg', ''),
('NL099', 'BTP 16-8-16 6S TE PLUS bao tạm', 'Kg', ''),
('NL100', 'BTP 16-9-13 bao tạm', 'Kg', ''),
('NL101', 'BTP 16-10-6 bao tạm', 'Kg', ''),
('NL102', 'BTP 16-20 N-P', 'Kg', ''),
('NL103', 'BTP 16-16-18-13S (CPC, bao tạm)', 'Kg', ''),
('NL104', 'BTP 17-14-7 bao tạm', 'Kg', ''),
('NL105', 'BTP 17-3-5 bao tạm', 'Kg', ''),
('NL106', 'BTP 18-14-6 K2SO4 bao tạm', 'Kg', ''),
('NL107', 'BTP 18-14-6 eco', 'Kg', ''),
('NL108', 'BTP 18-14-6 (LX, CPC)', 'Kg', ''),
('NL109', 'BTP 18-14-6 bao tạm', 'Kg', ''),
('NL110', 'Btp 18-20-0 CPC', 'Kg', ''),
('NL111', 'BTP 18-20-0 Bao tạm', 'Kg', ''),
('NL112', 'BTP 19-4-18 Bao tạm', 'Kg', ''),
('NL113', 'BTP 20-20-15 (1 hạt)', 'Kg', ''),
('NL114', 'Đồng CuSO4.5H2O', 'Kg', '');
-- SELECT * FROM Ingredients;

-- CREATE TABLE Products (
--   "id" serial PRIMARY KEY,
--   "product_code" char(10) NOT NULL,
--   "product_name" text,
--   "unit" varchar(50),
--   "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
-- );
INSERT INTO products (product_code, product_name, unit, description) VALUES
('TPH027', 'NPK 2.0.20 TE Plus', 'Kg', ''),
('BTP050', 'Bán thành phẩm 12.5.5 - Trộn', 'Kg', 'BTP'),
('BTP024', 'Bán thành phẩm 15.30.5 - Trộn', 'Kg', 'BTP'),
('BTP003', 'Bán thành phẩm 16.20.0 - Trộn', 'Kg', 'BTP'),
('BTP054', 'Bán thành phẩm Dolomit', 'Kg', 'BTP'),
('BTP056', 'Nano B- Canxi (bao xá)', 'Kg', 'BTP'),
('BTP035', '16.16.8 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP009', '16.9.13 TE Plus( bao xá)', 'Kg', 'BTP'),
('BTP006', '15.15.15 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP012', '15.15.15 TE Plus có K2SO4 (bao xá)', 'Kg', 'BTP'),
('BTP007', '15.7.17 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP008', '16.8.16 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP016', '18.14.6 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP028', '18.14.6 TE Plus - K2SO4 (bao xá)', 'Kg', 'BTP'),
('BTP017', '17.14.7 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP018', '16.6.18 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP019', '15.8.18 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP020', '18.14.6 TE Plus (bao đen) Eco', 'Kg', 'BTP'),
('BTP021', '16.6.18 TE Plus (bao đen) Eco', 'Kg', 'BTP'),
('BTP022', 'Bán thành phẩm 12.5.5 Eco', 'Kg', 'BTP'),
('BTP025', '18.20.0 TE Plus (bao đen) - Eco', 'Kg', 'BTP'),
('BTP026', '19.4.18 TE Plus (bao đen) - Eco', 'Kg', 'BTP'),
('BTP047', '16.20 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP049', '10.5.27 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP027', '10.5.27 TE Plus có K2SO4 (bao xá)', 'Kg', 'BTP'),
('BTP055', '12.12.17 TE Plus - K2SO4 (bao xá)', 'Kg', 'BTP'),
('BTP051', '18.20.0 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP052', '19.4.18 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP011', '16.10.6 TE Plus( bao xá)', 'Kg', 'BTP'),
('BTP013', '17.3.5 TE Plus( bao xá)', 'Kg', 'BTP'),
('BTP053', '20.20.15 TE Plus (bao xá)', 'Kg', 'BTP'),
('BTP057', '16.20 TE Plus (ECO) mía xanh(bao xá)', 'Kg', 'BTP'),
('BTP058', '16.6.18 1Mg + TE(chitosan) mía khỏe( bao xá)', 'Kg', 'BTP'),
('TPH059', 'NPK 20.20.15 TE Plus', 'Kg', ''),
('TPH085', 'NPK 20.20.15 TE Plus - Tăng trưởng', 'Kg', ''),
('TPH077', 'NPK 20.20.15 TE Plus - Thanh Long 1', 'Kg', ''),
('TPH057', 'NPK 22.10.20 TE Plus - Thanh Long 2', 'Kg', ''),
('TPH060', 'NPK 20.20.15 TE Plus - Lúa Nhật', 'Kg', ''),
('TPH075', 'NPK 20.20.15 TE Plus (N-Bound)', 'Kg', ''),
('TPH073', 'Chuyên dùng lúa N-Plus TE 01', 'Kg', ''),
('TPH074', 'Chuyên dùng lúa N-Plus TE 02', 'Kg', ''),
('TPH058', 'NPK 20.3.20 TE Plus - Lúa 2', 'Kg', ''),
('TPH062', 'NPK 20.15.6 TE Plus - Lúa 1', 'Kg', ''),
('TPH098', 'NPK 18.14.6+6S+TE', 'Kg', ''),
('TPH099', 'NPK 16.6.18+1Mg+TE', 'Kg', ''),
('TPH056', 'NPK 25.25.5 TE Plus', 'Kg', ''),
('TPH063', 'NPK 16.9.13 TE Plus (bao TP)', 'Kg', ''),
('TPH070', 'NPK 15.15.15 TE Plus (Cây ăn quả)', 'Kg', ''),
('TPH030', 'NPK 15.15.15 TE Plus (Cây ăn quả) có K2SO4', 'Kg', ''),
('TPH069', 'NPK 15.15.15 TE Plus ( Tiêu, cà phê)', 'Kg', ''),
('TPH079', 'NPK 16.16.8.9S TE Plus (bao 50kg)', 'Kg', ''),
('TPH083', 'NPK 16.16.8.9S TE Plus (NPK BDII)', 'Kg', ''),
('TPH102', 'NPK 16.16.8.9S TE Plus (bao xá)', 'Kg', ''),
('TPH104', 'NPK 16.16.8.9S TE Plus (NB-25kg)', 'Kg', ''),
('TPH081', 'NPK 16.20.0( PB Hà Lan)', 'Kg', ''),
('TPH068', 'NPK 15.7.17 TE Plus (Cà phê)', 'Kg', ''),
('TPH105', 'NPK 15.7.17 TE Plus (Cao su, Điều, Khoai mì)', 'Kg', ''),
('TPH065', 'NPK 16.8.16 TE Plus (Cà phê, tiêu)', 'Kg', ''),
('TPH064', 'NPK 16.8.16 TE Plus (CLCT)', 'Kg', ''),
('TPH066', 'NPK 16.20 TE Plus', 'Kg', ''),
('TPH110', 'NPK 17.14.7+TE (Hồ tiêu - Cà phê)', 'Kg', ''),
('TPH111', 'NPK 18.14.6+6S+TE (Hồ tiêu - Cà phê)', 'Kg', ''),
('TPH109', 'NPK 16.6.18+1Mg+TE (Hồ tiêu - Cà phê)', 'Kg', ''),
('TPH108', 'NPK 15.8.18+TE (Hồ tiêu - Cà phê)', 'Kg', ''),
('TPH114', 'NPK 16.10.6 TE Plus', 'Kg', ''),
('HHA054', 'NPK 20.20.15 TE Plus (NEW-Hàng một hạt)', 'Kg', 'HHA'),
('TPH118', 'NPK 18.14.6+6S+TE (Lúa Xanh)', 'Kg', ''),
('TPH119', 'NPK 16.6.18+1Mg+TE (Chắc Hạt)', 'Kg', ''),
('TPH144', 'NPK 18.14.6+6S+TE (Dưỡng Trái)', 'Kg', ''),
('TPH145', 'NPK 16.6.18+1Mg+TE (Chắc Nhân)', 'Kg', ''),
('TPH164', 'NPK 16.20 TE Plus (Mía Xanh)', 'Kg', ''),
('TPH165', 'NPK 16.6.18+1Mg+TE (Mía Khỏe)', 'Kg', ''),
('TPH092', 'NPK 20.20.15 TE Plus (CAMBODIA)', 'Kg', ''),
('TPH091', 'NPK 20.3.20 TE Plus (CAMBODIA)', 'Kg', ''),
('TPH090', 'NPK 20.15.6 TE Plus (CAMBODIA)', 'Kg', ''),
('TPH093', 'SOIL DETOX COMPOUND (CAMBODIA)', 'Kg', ''),
('TPH095', 'NPK 18.20.0 TE Humic (CAMBODIA)', 'Kg', ''),
('TPH147', 'NPK 18.20.0 TE Humic (Túi Jumbo)', 'Kg', ''),
('TPH112', 'NPK 22.0.22 TE Humic (CAMBODIA)', 'Kg', ''),
('TPH113', 'NPK 25.2.18 TE Plus (Túi Jumbo)', 'Kg', ''),
('TPH120', 'NPK 25.2.18 TE Plus (bao 50kg)', 'Kg', ''),
('TPH103', 'NPK 19.4.18 TE Humic (bao 50kg)', 'Kg', ''),
('TPH101', 'NPK 19.4.18 TE Humic (Túi Jumbo)', 'Kg', ''),
('TPH142', 'NPK 24.0.24 TE Humic (bao 50kg)', 'Kg', ''),
('TPH143', 'NPK 24.0.24 TE Humic (Túi Jumbo)', 'Kg', ''),
('TPH116', 'NPK 16.16.8.13S TE Plus', 'Kg', ''),
('TPH126', 'NPK 18.14.6 TE Plus (CAMBODIA)', 'Kg', ''),
('TPH127', 'NPK 16.6.18 TE Plus (CAMBODIA)', 'Kg', ''),
('TPH106', 'NPK 17.17.17 TE Plus (bao 25kg) (CAMBODIA)', 'Kg', ''),
('TPH162', 'NPK 17.5.35 TE Plus', 'Kg', ''),
('TPH163', 'Nano B- Canxi', 'Kg', ''),
('TPH096', 'NPK 16.16.8.9S TE Plus (bao 25kg) BĐ', 'Kg', ''),
('TPH040', 'NPK 15.15.15 TE Plus (Cây ăn quả - bao 25kg) - GH', 'Kg', ''),
('TPH115', 'NPK 15.15.15 TE Plus (Cây ăn quả - bao 25kg)', 'Kg', ''),
('TPH097', 'NPK 15.15.15 TE Plus (có K2SO4 - 25kg)', 'Kg', ''),
('TPH044', 'NPK 17.3.5 TE Plus (bao 25kg)', 'Kg', ''),
('TPH043', 'NPK 20.15.6 TE Plus - Lúa 1 (bao 25kg)', 'Kg', ''),
('TPH045', 'NPK 20.3.20 TE Plus - Lúa 2 (bao 25kg)', 'Kg', ''),
('TPH094', 'NPK 16.10.6 TE Plus (bao 25kg)', 'Kg', ''),
('TPH117', 'NPK 20.20.15 TE Plus (NEW-Hàng một hạt) bao 25kg', 'Kg', ''),
('TPH080', 'NPK 30.10.10 TE Plus (bao 25kg)', 'Kg', ''),
('TPH121', 'NPK 17.17.17 TE Plus (bao 25kg)', 'Kg', ''),
('TPH122', 'NPK 10.5.27 TE Plus (bao 25kg)', 'Kg', ''),
('TPH123', 'NPK 18.14.6+6S+TE (Hàng một hạt - bao 25kg)', 'Kg', ''),
('TPH146', 'NPK 16.6.18+1Mg+TE (Hàng một hạt - bao 25kg)', 'Kg', ''),
('TPH138', 'NPK 18.14.6+6S+TE Lúa Xanh (bao 25kg)', 'Kg', ''),
('TPH139', 'NPK 16.6.18+1Mg+TE Chắc Hạt (bao 25kg)', 'Kg', ''),
('TPH124', 'NPK 10.5.27+TE Plus (TOP K Plus)', 'Kg', ''),
('TPH125', 'NPK 10.5.27+TE Plus (TOP K Plus+)', 'Kg', ''),
('TPH128', 'NPK 18.14.6+6S+TE (Mạnh Chồi)', 'Kg', ''),
('TPH141', 'NPK 18.14.6+6S+TE (Mạnh Chồi) Kali thường', 'Kg', ''),
('TPH129', 'NPK 15.15.15+TE Plus (Khỏe Cây)', 'Kg', ''),
('TPH130', 'NPK 10.5.27+TE Plus (Ngọt Trái)', 'Kg', ''),
('TPH140', 'NPK 20.20.15 TE Plus (Tưới nhỏ giọt) bao 25kg', 'Kg', ''),
('TPH133', 'ĐẠM NGỌC TÍM (bao 40kg)', 'Kg', ''),
('TPH100', 'NPK 20.5.5+15S+TE', 'Kg', ''),
('TPH071', 'NPK 22.5.6 TE Plus mùa khô', 'Kg', ''),
('TPH072', 'NPK 17.3.5 TE Plus mùa khô', 'Kg', ''),
('TPH137', 'NPK 20.5.6 TE Plus', 'Kg', ''),
('TPH131', 'NPK 30.10.10 TE Plus (túi 1kg)', 'Kg', ''),
('TPH132', 'NPK 17.17.17 TE Plus (túi 1kg)', 'Kg', ''),
('TPH134', 'NPK 10.5.27 TE Plus (túi 1kg)', 'Kg', ''),
('TPH135', 'NPK 16.6.18 TE Plus Chắc Hạt (túi 1kg)', 'Kg', ''),
('TPH136', 'NPK 15.15.15 TE Plus (K2SO4- túi 1kg)', 'Kg', ''),
('TPH148', 'NPK 18.14.6 TE Plus (Mạnh Chồi - túi 1kg)', 'Kg', ''),
('TPH149', 'NPK 10.5.27 TE Plus (Ngọt Trái - túi 1kg)', 'Kg', ''),
('TPH150', 'NPK 18.14.6+6S+TE Lúa Xanh (túi 1kg)', 'Kg', ''),
('TPH151', 'NPK 17.14.7+TE (túi 1kg)', 'Kg', ''),
('TPH152', 'NPK 18.14.6+6S+TE (Hồ tiêu - Cà phê) (túi 1kg)', 'Kg', ''),
('TPH153', 'NPK 16.6.18+1Mg+TE (Hồ tiêu - Cà phê) (túi 1kg)', 'Kg', ''),
('TPH154', 'NPK 15.8.18+TE (túi 1kg)', 'Kg', ''),
('TPH155', 'NPK 20.5.5+15S+TE (túi 1kg)', 'Kg', ''),
('TPH156', 'NPK 20.5.6 TE Plus (túi 1kg)', 'Kg', ''),
('TPH157', 'NPK 22.5.6 TE Plus (túi 1kg)', 'Kg', ''),
('TPH158', 'NPK 18.14.6+6S+TE (Dưỡng Trái) (túi 1kg)', 'Kg', ''),
('TPH159', 'NPK 16.6.18+1Mg+TE (Chắc Nhân) (túi 1kg)', 'Kg', ''),
('TPH160', 'NPK 15.15.15 TE Plus (Khỏe Cây - túi 1kg)', 'Kg', ''),
('TPH161', 'NPK 18.14.6 TE Plus (Mạnh Chồi - túi 1kg) Kali thường', 'Kg', '');
-- SELECT * FROM Products;

-- CREATE TABLE Formulas (
--     "id" serial PRIMARY KEY,
--     "formula_name" text,
--     "product_id" integer ,
--     "is_active" boolean,
--     "product_line" text,
--     "specification" varchar(50),
--     "color" varchar,
--     "type_of_specification" char(10),
--     "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
--     "created_by" text,

--     CONSTRAINT fk_formula_product FOREIGN KEY (product_id) REFERENCES Products(id) on DELETE set null
-- );
INSERT INTO formulas (formula_code, formula_name, product_id, is_active, product_line, specification, color, type_of_specification, created_by) VALUES
(1, '25-2-18 + TE PLUS (XK, CPC)', 80, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(2, '25-2-18 + TE PLUS (XK, CPC)', 81, TRUE, 'Tron', 'BTP', '3mau', '50Kg', 'NQH'),
(3, '20-15-6 L1 Xuất khẩu CPC (dap đen 18-46-0)', 43, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(4, '20-15-6 L1 Xuất khẩu CPC (dap đen 16-44-0)', 75, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(5, '20-3-20 L2-XK CPC (DAP đen 18-46-0)', 42, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(6, '20-3-20 L2-XK CPC (DAP đen 16-44-0)', 74, TRUE, 'Tron', 'BTP', '3mau', '50Kg', 'NQH'),
(7, '20-20-15 + TE PLUS (XK, CPC)', 73, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(8, '20-20-15 Đặc biệt CPC (dap xanh 18-46-0)', 31, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(9, '20-20-15 +TE PLUS (Xuất khẩu, CPC, DAP đen 16-44-0)', 34, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH'),
(10, '20-20-15 + TE PLUS (Đặc biệt, CPC, DAP xanh 16-44-0)', 35, TRUE, 'Tron', 'BTP', '3mau', '25Kg', 'NQH');
-- SELECT * FROM Formulas;

-- CREATE TABLE Formula_Details (
--   "id" serial PRIMARY KEY,
--   "formula_id" integer,
--   "ingredient_id" integer,
--   "standard_quality" float,

--   CONSTRAINT fk_formulaDetail_formula FOREIGN KEY (formula_id) REFERENCES Formulas(id) on DELETE set null,
--   CONSTRAINT fk_formulaDetail_ingredient FOREIGN KEY (ingredient_id) REFERENCES Ingredients(id) on delete set null
-- );
INSERT INTO Formula_Details(formula_id,ingredient_id,standard_quality) values
(1,5,28.17),(1,11,22),(1,20,2.5),(1,28,47.67),
(2,5,28.28),(2,11,21),(2,19,2.67),(2,28,48.08),
(3,5,7),(3,11,43),(3,20,27.95),(3,28,22.05),
(4,5,7),(4,11,42),(4,19,28.98),(4,28,22),
(5,5,30.67),(5,11,32),(5,20,4),(5,28,33.57),
(6,5,29.85),(6,11,33.2),(6,19,3.9),(6,28,33.04),
(7,5,24.75),(7,10,12.5),(7,20,10.87),(7,21,27.11),(7,28,24.8),
(8,2,24.24),(8,5,25),(8,10,13),(8,28,24.8),
(9,5,24.75),(9,10,12.5),(9,19,37.97),(9,28,24.8),
(10,4,37.97),(10,5,24.75),(10,10,12.5),(10,28,24.8);
-- SELECT * FROM Formula_Details;

-- SELECT 
--     f.formula_name, 
--     i.ingredient_name, 
--     fd.standard_quality, 
--     i.unit
-- FROM Formulas f
-- JOIN Formula_Details fd ON f.id = fd.formula_id
-- JOIN Ingredients i ON fd.ingredient_id = i.id
-- WHERE f.id = 1; -- Thay đổi ID công thức tại đây
