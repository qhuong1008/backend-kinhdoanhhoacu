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

--cập nhật tổng phụ của n sản phẩm sau khi thêm n sản phẩm vào giỏ
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


--select [dbo].getPriceByProductId('SP0000')

go
update ChiTietHoaDon
set TongPhu = SoLuong * [dbo].getPriceByProductId('SP0000') 
where ChiTietHoaDon.MaSP = 'SP0000' 



go
--sau khi bấm nút thanh toán thì cart chuyển thành hóa đơn
insert into HoaDon values('1111111','',0,'','','USER010','',0,0,0,0)
go
update ChiTietHoaDon 
set MaHoaDon = '1111111'
where ChiTietHoaDon.MaHoaDon = 'cart_USER010'



select * from ChiTietHoaDon

select [dbo].getNameByProductId(MaSP) as 'TenSP', SoLuong, TongPhu from ChiTietHoaDon
where ChiTietHoaDon.MaHoaDon = 'cart_USER010'


select [dbo].getNameByProductId(MaSP) as 'TenSP', SoLuong, TongPhu from ChiTietHoaDon
                  where ChiTietHoaDon.MaHoaDon = 'cart_USER010'














