var config = require("./config");
const sql = require("mssql");

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
module.exports = { ThanhToanHoaDon };
