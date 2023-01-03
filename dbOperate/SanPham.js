var config = require("./config");
const sql = require("mssql");

async function getSanPham() {
  try {
    let pool = await sql.connect(config);
    let sanphamlist = await pool
      .request()
      .query(
        "select MaSP, TenSP, Gia, ChiTiet,Hinh, LoaiSanPham.TenLoaiSanPham, LoaiSanPham.MaLoaiSP from SanPham inner join LoaiSanPham on SanPham.MaLoaiSP = LoaiSanPham.MaLoaiSP"
      );
    return sanphamlist.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function getSanPhamById(productId) {
  try {
    let pool = await sql.connect(config);
    let sanpham = await pool
      .request()
      .input("MaSP", sql.Char, productId)
      .query(
        "select MaSP, TenSP, Gia, ChiTiet,Hinh, LoaiSanPham.TenLoaiSanPham, LoaiSanPham.MaLoaiSP from SanPham inner join LoaiSanPham on SanPham.MaLoaiSP = LoaiSanPham.MaLoaiSP and SanPham.MaSP = @MaSP"
      );
    return sanpham.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getTenLoaiSanPhamBySPId(productId) {
  try {
    let pool = await sql.connect(config);
    let sanpham = await pool
      .request()
      .input("MaSP", sql.Char, productId)
      .query(
        "select TenLoaiSanPham from LoaiSanPham inner join SanPham on SanPham.MaLoaiSP = LoaiSanPham.MaLoaiSP" +
          " and SanPham.MaSP = @MaSP"
      );
    return sanpham.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getSanPham, getSanPhamById, getTenLoaiSanPhamBySPId };
