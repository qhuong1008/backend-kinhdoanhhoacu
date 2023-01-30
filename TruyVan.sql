select * from HoaDon

select * from ChiTietHoaDon

select * from SanPham

-- lấy giá của sản phẩm dựa trên id sản phẩm
go
create function getPriceByProductId(@productID nvarchar(10))
returns int
as begin
	declare @price int
	set @price = (select SanPham.Gia from SanPham where SanPham.MaSP = @productID)
	return @price
end

--lấy tên sản phẩm dựa trên id sản phẩm
go
create function getNameByProductId(@productID nvarchar(10))
returns nvarchar(100)
as begin
	declare @name nvarchar(100)
	set @name = (select SanPham.TenSP from SanPham where SanPham.MaSP = @productID)
	return @name
end
--select [dbo].getNameByProductId('SP0000')


-- procedure thêm sp vào cart
go
create procedure AddToCart @maNguoiDung nvarchar(30), @maSP nvarchar(10), @soLuong int
as begin
insert into ChiTietHoaDon values('cart_'+@maNguoiDung,@maSP,@soLuong,0)
end

go
--exec AddToCart 'USER010','SP00010',2

-- procedure xóa sp khỏi cart
go
create procedure DeleteFromCart @maNguoiDung nvarchar(30), @maSP nvarchar(10)
as begin
delete from ChiTietHoaDon where ChiTietHoaDon.MaHoaDon = 'cart_'+@maNguoiDung and ChiTietHoaDon.MaSP=@maSP
end

--exec DeleteFromCart 'USER010','SP000100'

--procedure cập nhật tổng phụ của n sản phẩm sau khi thêm n sản phẩm vào giỏ
create trigger CapNhatTongPhu
on ChiTietHoaDon
after insert
as begin
	declare @tongphu int, @soluong int, @gia int
	set @soluong = (select inserted.SoLuong from inserted)
	set @gia = (select [dbo].getPriceByProductId(inserted.MaSP) from inserted)
	set @tongphu = @soluong * @gia
	update ChiTietHoaDon
	set TongPhu = @tongphu
	where ChiTietHoaDon.MaSP = (select inserted.MaSP from inserted)
end

go
--procedure sau khi bấm nút thanh toán thì cart chuyển thành hóa đơn
create procedure ThanhToanHoaDon @MaNguoiDung nvarchar(30),@hoten nvarchar(30), @diachi nvarchar(200), @sdt char(10), @ghichu nvarchar(30)
as begin
	insert into HoaDon values (REPLACE(@MaNguoiDung+CONVERT(VARCHAR(12),GETDATE(),114), ':', ''),@ghichu,0,@hoten,@diachi,@sdt,@MaNguoiDung,(select GETDATE()),0,0,0,0);
end


--exec ThanhToanHoaDon 'USER001','dsd','dssffdsf','123456','ghi chu'
--procedure Chuyển toàn bộ SP từ giỏ hàng sang hóa đơn, giỏ hàng lúc này rỗng
go
create trigger CapNhatGioHangSauThanhToan
on HoaDon
after insert
as begin
	update ChiTietHoaDon 
	set MaHoaDon = (select inserted.MaHoaDon from inserted)
	where ChiTietHoaDon.MaHoaDon = 'cart_'+ (select MaKhachHang from inserted)
end

--procedure cập nhật tổng tiền sau khi thanh toán hóa đơn
go
create trigger capnhatTongTienOnHoaDon
on HoaDon
after insert
as begin
	declare @tongtien int
	set @tongtien = (select sum(TongPhu) from ChiTietHoaDon where ChiTietHoaDon.MaHoaDon=(select MaHoaDon from inserted))
	update HoaDon
	set HoaDon.TongThanhToan = @tongtien 
	where HoaDon.MaHoaDon = (select MaHoaDon from inserted)
end

-- procedure update info NguoiDung
go
create procedure UpdateNguoiDung @manguoidung nvarchar(30), @username nvarchar(100), @password nvarchar(30), @hoten nvarchar(100), @ngaysinh date, @diachi nvarchar(100)
as begin
	update NguoiDung
	set TenDangNhap=@username,MatKhau=@password,HoTen=@hoten,NgaySinh=@ngaysinh, DiaChi=@diachi
	where NguoiDung.MaNguoiDung=@manguoidung
end

--exec UpdateNguoiDung 'USER001', 'qhuong1008','123','Hương Cute','01-31-2002','VN'

--procedure change password
go
create procedure changePassword @manguoidung nvarchar(30), @password nvarchar(30)
as begin
	update NguoiDung
	set MatKhau=@password
	where NguoiDung.MaNguoiDung=@manguoidung
end
-- exec changePassword 'USER001', '123456'

go
create procedure getDonHangInfo @userID nvarchar(30)
as begin
select y.MaSP,y.MaHoaDon,y.SoLuong,y.TongPhu,y.GhiChu,y.TongThanhToan,y.DiaChiGiaoHang,y.SoDienThoai,y.MaKhachHang,
y.ThoiGianGiaoHang,y.TrangThaiGiaoHang,y.TrangThaiThanhToan,x.TenSP,x.MaLoaiSP,x.Gia, x.TenLoaiSanPham, x.Hinh
from 
(select ChiTietHoaDon.MaSP,ChiTietHoaDon.MaHoaDon,ChiTietHoaDon.SoLuong,ChiTietHoaDon.TongPhu,
HoaDon.GhiChu,HoaDon.TongThanhToan,HoaDon.DiaChiGiaoHang,HoaDon.SoDienThoai,HoaDon.MaKhachHang,HoaDon.ThoiGianGiaoHang,
HoaDon.TrangThaiGiaoHang,HoaDon.TrangThaiThanhToan
from ChiTietHoaDon inner join HoaDon on ChiTietHoaDon.MaHoaDon = HoaDon.MaHoaDon) as y
inner join 
(select SanPham.TenSP,SanPham.Hinh, SanPham.MaLoaiSP, SanPham.Gia, SanPham.MaSP, LoaiSanPham.TenLoaiSanPham from SanPham 
inner join LoaiSanPham on SanPham.MaLoaiSP = LoaiSanPham.MaLoaiSP) as x
on y.MaSP = x.MaSP
where y.MaKhachHang=@userID
end



--exec getDonHangInfo 'USER002'

go
create procedure AddNguoiDung @tendangnhap nvarchar(50),@matkhau nvarchar(30), @hoten nvarchar(200), @ngaysinh date, @diachi nvarchar(200), @hinh nvarchar(100)
as begin
insert into NguoiDung values (concat('USER00', (select max(NguoiDung.Stt)+1 from NguoiDung)),@tendangnhap,@matkhau,@hoten,@ngaysinh,@diachi,'001',0,@hinh)
end


exec AddNguoiDung 'qhuong969','123','hellokitty','2002-01-12','hcm','hinh'
go
create procedure AddSanPham @tenSP nvarchar(100),@gia int, @chitiet nvarchar(300),@hinh nvarchar(100),@maLsp nvarchar(10)
as begin
insert into SanPham values (concat('SP000',(select count(SanPham.MaSP)+2 from SanPham)),@tenSP,@gia,@chitiet,@hinh,@maLsp,0)
end

--exec AddSanPham 'sp3',12000,'chitiet','hinh','lsp02'

go
create procedure AddLoaiSanPham @tenlsp nvarchar(100)
as begin
insert into LoaiSanPham values(concat('lsp0',(select count(LoaiSanPham.MaLoaiSP)+1 from LoaiSanPham)),@tenlsp,0)
end

go
create procedure DeleteNguoiDungById @id nvarchar(30)
as begin
update NguoiDung
set NguoiDung.DaXoa = 1 
where NguoiDung.MaNguoiDung = @id
delete from HoaDon where HoaDon.MaHoaDon = 'cart_'+@id
end

--exec DeleteNguoiDungById 'USER0037'

go
create procedure deleteProductById @id nvarchar(30)
as begin
update SanPham
set SanPham.DaXoa=1
where SanPham.MaSP = @id
end

--exec deleteProductById 'SP000400'


go
create procedure deleteProductTypeById @id nvarchar(30)
as begin
update LoaiSanPham
set LoaiSanPham.DaXoa=1
where LoaiSanPham.MaLoaiSP = @id
end

--exec deleteProductTypeById

create procedure deleteHoaDonById @id nvarchar(30)
as begin
update HoaDon
set HoaDon.DaXoa = 1
where HoaDon.MaHoaDon = @id
end


create procedure editNguoiDung @manguoidung nvarchar(30), @tendangnhap nvarchar(30),@matkhau nvarchar(30),@hoten nvarchar(100),@ngaysinh date, @diachi nvarchar(100),@hinh nvarchar(100)
as begin
update NguoiDung
set NguoiDung.TenDangNhap=@tendangnhap,NguoiDung.MatKhau=@matkhau,NguoiDung.HoTen=@hoten,NguoiDung.NgaySinh=@ngaysinh,NguoiDung.DiaChi=@diachi,NguoiDung.Hinh=@hinh
where NguoiDung.MaNguoiDung=@manguoidung
end

go
create procedure editSanPham @masp nvarchar(10), @tensp nvarchar(100), @gia int, @chitiet nvarchar(100),@hinh nvarchar(100),@malsp nvarchar(10)
as begin
update SanPham
set SanPham.TenSP=@tensp,SanPham.Gia=@gia,SanPham.ChiTiet=@chitiet,SanPham.Hinh=@hinh,SanPham.MaLoaiSP=@malsp
where SanPham.MaSP=@masp
end


select * from HoaDon

go
create procedure editHoaDon @maHD nvarchar(30),@ghichu nvarchar(100),@tongthanhtoan int, @hoten nvarchar(100), @diachigiaohang nvarchar(200),
@sodienthoai nvarchar(10), @maKH nvarchar(20), @thoigiangiaohang date, @trangthaidonhang bit, @trangthaigiaohang int, @trangthaithanhtoan bit
as begin
update HoaDon
set HoaDon.GhiChu=@ghichu,HoaDon.TongThanhToan=@tongthanhtoan,HoaDon.HoTen=@hoten,HoaDon.DiaChiGiaoHang=@diachigiaohang,
HoaDon.SoDienThoai=@sodienthoai,HoaDon.MaKhachHang=@maKH,HoaDon.ThoiGianGiaoHang=@thoigiangiaohang,HoaDon.TrangThaiDonHang=@trangthaidonhang,
HoaDon.TrangThaiThanhToan=@trangthaithanhtoan
where HoaDon.MaHoaDon=@maHD
end


go
alter table HoaDon 
alter COLUMN TrangThaiGiaoHang int

select * from HoaDon where HoaDon.MaHoaDon not like '%cart%' order by HoaDon.ThoiGianGiaoHang DESC

select * from NguoiDung
