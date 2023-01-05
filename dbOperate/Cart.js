var config = require("./config");
const sql = require("mssql");

async function GetCartInfo(maHD) {
  try {
    let pool = await sql.connect(config);
    let cart = await pool
      .request()
      .input("maHD", sql.Char, maHD)
      .query(
        `select Hinh, TenSP, SoLuong,SanPham.MaSP, TongPhu from ChiTietHoaDon inner join SanPham 
        on ChiTietHoaDon.MaSP = SanPham.MaSP
        where ChiTietHoaDon.MaHoaDon = @maHD`
      );
    return cart.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function AddToCart(cart) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("maNguoiDung", sql.VarChar, cart.maNguoiDung)
      .input("maSP", sql.VarChar, cart.maSP)
      .input("soLuong", sql.Int, cart.soLuong)
      .query("exec AddToCart @maNguoiDung,@maSP,@soLuong");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { AddToCart, GetCartInfo };
