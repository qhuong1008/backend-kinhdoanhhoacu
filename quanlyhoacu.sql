CREATE DATABASE QUANLYHOACU
GO
USE QUANLYHOACU
GO

-- Create a new table called '[SanPham]' in schema '[dbo]'

-- Drop the table if it already exists

IF OBJECT_ID('[dbo].[SanPham]', 'U') IS NOT NULL

DROP TABLE [dbo].[SanPham]

GO

-- Create the table in the specified schema

CREATE TABLE [dbo].[SanPham]

(

	MaSP varchar(30) primary key,

	TenSP nvarchar(100),

	Gia int,

	ChiTiet nvarchar(200),

	Hinh varchar(1000),

	MaLoaiSP varchar(30),

	DaXoa bit DEFAULT 0 

);

GO

-- Create a new table called '[LoaiSanPham]' in schema '[dbo]'

-- Drop the table if it already exists

IF OBJECT_ID('[dbo].[LoaiSanPham]', 'U') IS NOT NULL

DROP TABLE [dbo].[LoaiSanPham]

GO

-- Create the table in the specified schema

CREATE TABLE [dbo].[LoaiSanPham]

(

	MaLoaiSP varchar(30) primary key,

	TenLoaiSanPham nvarchar(200),

	DaXoa bit DEFAULT 0

    -- Specify more columns here

);

GO

-- Create a new table called '[HoaDon]' in schema '[dbo]'

-- Drop the table if it already exists

IF OBJECT_ID('[dbo].[HoaDon]', 'U') IS NOT NULL

DROP TABLE [dbo].[HoaDon]

GO

-- Create the table in the specified schema

CREATE TABLE [dbo].[HoaDon] 

(

    MaHoaDon varchar(30) primary key,

    GhiChu nvarchar(200),

    TongThanhToan int,
	
	HoTen nvarchar(200),

    DiaChiGiaoHang nvarchar(200),

    SoDienThoai varchar(13),

    MaKhachHang varchar(30),

    ThoiGianGiaoHang DateTime,

    TrangThaiDonHang bit,

    TrangThaiGiaoHang bit,

    TrangThaiThanhToan bit,

    DaXoa bit DEFAULT 0

    -- Specify more columns here

);

GO



-- Create a new table called '[ChiTietHoaDon]' in schema '[dbo]'

-- Drop the table if it already exists

IF OBJECT_ID('[dbo].[ChiTietHoaDon]', 'U') IS NOT NULL

DROP TABLE [dbo].[ChiTietHoaDon]

GO

-- Create the table in the specified schema

CREATE TABLE [dbo].[ChiTietHoaDon]

(

    MaHoaDon varchar(30)  not null,

    MaSP varchar(30)  not null,

    SoLuong int,

    TongPhu float --soluong*giasanpham

);

GO





-- Create a new table called '[NguoiDung]' in schema '[dbo]'

-- Drop the table if it already exists

IF OBJECT_ID('[dbo].[NguoiDung]', 'U') IS NOT NULL

DROP TABLE [dbo].[NguoiDung]

GO

-- Create the table in the specified schema

CREATE TABLE [dbo].[NguoiDung]

(

	MaNguoiDung varchar(30)  primary key,

	TenDangNhap varchar(30) unique,

	MatKhau varchar(100),

	HoTen nvarchar(100),

	NgaySinh date,

	DiaChi nvarchar(100),

	RoleID varchar(10),

	DaXoa bit DEFAULT 0

);

GO



/*
Create the table in the specified schema
*/

-- Drop a table called 'ROLE' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('[dbo].[ROLE]', 'U') IS NOT NULL
DROP TABLE [dbo].[ROLE]
GO
CREATE TABLE [dbo].[ROLE]
(
	RoleID varchar(10) primary key,
	RoleName varchar(100) not null,
);

-- Insert rows into table 'ROLE' in schema '[dbo]'

INSERT INTO [dbo].[ROLE]

( -- Columns to insert data into

 [RoleID], [RoleName]

)

VALUES

( -- First row: values for the columns in the list above

 '000','ADMIN'

),

( -- Second row: values for the columns in the list above

 '001','USER'

)

-- Add more rows here

GO

alter table [dbo].[SanPham]
add CONSTRAINT FK_SanPhamVaLoaiSanPham
    FOREIGN key (MaLoaiSP)
    REFERENCES [dbo].[LoaiSanPham](MaLoaiSP)
ON UPDATE CASCADE
ON DELETE CASCADE

alter table [dbo].[ChiTietHoaDon]
ADD PRIMARY KEY (MaHoaDon, MaSP);

ALTER table [dbo].[ChiTietHoaDon]
add CONSTRAINT FK_MaSP
FOREIGN key (MaSP)
REFERENCES [dbo].[SanPham](MaSP)

alter table [dbo].[ChiTietHoaDon]
add constraint FK_MaHoaDon
foreign key (MaHoaDon) 
REFERENCES [dbo].[HoaDon](MaHoaDon)

alter table [dbo].[NguoiDung]
add constraint FK_UserAndRole
foreign key (RoleID) 
REFERENCES [dbo].[ROLE](RoleID)

alter table [dbo].[HoaDon]
	add constraint FK_UserAndOrder
	foreign key (MaKhachHang) 
	REFERENCES [dbo].[NguoiDung](MaNguoiDung)

go
CREATE TRIGGER newHoaDon_NewUser ON NguoiDung

FOR INSERT

AS BEGIN

	DECLARE @userID varchar(30)

	SET @userID = (select inserted.MaNguoiDung from inserted)

	insert into HoaDon values (CONCAT('cart_',@userID),'',0,'','','',@userID,'',0,0,0,0);

end

