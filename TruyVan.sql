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
	insert into HoaDon values (REPLACE(@MaNguoiDung+CONVERT(VARCHAR(12),GETDATE(),114), ':', ''),@ghichu,0,@hoten,@diachi,@sdt,@MaNguoiDung,'',0,0,0,0);
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



exec getDonHangInfo 'USER002'











