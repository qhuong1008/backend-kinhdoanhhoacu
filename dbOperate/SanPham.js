var config = require("./config");
const sql = require("mssql");

async function getSanPham() {
  try {
    let pool = await sql.connect(config);
    let sanphamlist = await pool
      .request()
      .query(
        "select MaSP, TenSP, Gia, ChiTiet,Hinh, LoaiSanPham.TenLoaiSanPham, LoaiSanPham.MaLoaiSP, SanPham.DaXoa from SanPham inner join LoaiSanPham on SanPham.MaLoaiSP = LoaiSanPham.MaLoaiSP"
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

async function getAllLoaiSP() {
  try {
    let pool = await sql.connect(config);
    let loaisanpham = await pool.request().query("select * from LoaiSanPham");
    return loaisanpham.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function AddSanPham(sanpham) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("tenSP", sql.NVarChar, sanpham.tenSP)
      .input("gia", sql.Int, sanpham.gia)
      .input("chitiet", sql.NVarChar, sanpham.chitiet)
      .input("hinh", sql.NVarChar, sanpham.hinh)
      .input("maLsp", sql.NVarChar, sanpham.maLsp)
      .query("exec AddSanPham @tenSP,@gia,@chitiet,@hinh,@maLsp");
  } catch (error) {
    console.log(error);
  }
}

async function AddLoaiSanPham(sanpham) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("tenlsp", sql.NVarChar, sanpham.tenlsp)
      .query("exec AddLoaiSanPham @tenlsp");
  } catch (error) {
    console.log(error);
  }
}
async function DeleteSanPhamById(id) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("Id", sql.NVarChar, id)
      .query("exec deleteProductById @Id");
  } catch (error) {
    console.log(error);
  }
}

async function DeleteLoaiSanPhamById(id) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("Id", sql.NVarChar, id)
      .query("exec deleteProductTypeById @Id");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getSanPham,
  getSanPhamById,
  getTenLoaiSanPhamBySPId,
  getAllLoaiSP,
  AddSanPham,
  AddLoaiSanPham,
  DeleteSanPhamById,
  DeleteLoaiSanPhamById,
};
