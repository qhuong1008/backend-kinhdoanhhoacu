var config = require("./config");
const sql = require("mssql");

async function getAllNguoiDung() {
  try {
    let pool = await sql.connect(config);
    let listNguoiDung = await pool.request().query("select * from NguoiDung");
    return listNguoiDung.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function getNguoiDungAuth(username, password) {
  try {
    let pool = await sql.connect(config);
    let nguoidung = await pool
      .request()
      .input("TenDangNhap", sql.Char, username)
      .input("MatKhau", sql.Char, password)
      .query(
        "select MaNguoiDung from NguoiDung where NguoiDung.TenDangNhap = @TenDangNhap and NguoiDung.MatKhau = @MatKhau"
      );
    return nguoidung.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getNguoiDungById(id) {
  try {
    let pool = await sql.connect(config);
    let nguoidung = await pool
      .request()
      .input("Id", sql.Char, id)
      .query("select * from NguoiDung where NguoiDung.MaNguoiDung = @Id");
    return nguoidung.recordsets;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllNguoiDung, getNguoiDungAuth, getNguoiDungById };
