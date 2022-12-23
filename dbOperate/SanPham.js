var config = require("./config");

const sql = require("mssql");
async function getSanPham() {
  try {
    let pool = await sql.connect(config);
    let sanphamlist = await pool.request().query("select * from SanPham");
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
      .query("select * from SanPham where SanPham.MaSP = @MaSP");
    return sanpham.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getSanPham, getSanPhamById };
