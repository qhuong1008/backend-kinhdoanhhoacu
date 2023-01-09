var config = require("./config");
const sql = require("mssql");

async function getAllHoaDon(userID) {
  try {
    let pool = await sql.connect(config);
    let hoadonlist = await pool
      .request()
      .input("userID", sql.NVarChar, userID)
      .query(
        "select * from HoaDon where HoaDon.MaKhachHang=@userID and HoaDon.MaHoaDon not like '%cart%'"
      );
    return hoadonlist.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function ThanhToanHoaDon(info) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("maNguoiDung", sql.VarChar, info.maNguoiDung)
      .input("hoten", sql.NVarChar, info.hoten)
      .input("diachi", sql.NVarChar, info.diachi)
      .input("sdt", sql.Char, info.sdt)
      .input("ghichu", sql.NVarChar, info.ghichu)
      .query("exec ThanhToanHoaDon @maNguoiDung,@hoten,@diachi,@sdt,@ghichu");
  } catch (error) {
    console.log(error);
  }
}

async function getAllProductsFromHoaDon(userID) {
  try {
    let pool = await sql.connect(config);
    let productlist = await pool
      .request()
      .input("userID", sql.NVarChar, userID)
      .query("exec getDonHangInfo @userID");
    return productlist.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { ThanhToanHoaDon, getAllHoaDon, getAllProductsFromHoaDon };
