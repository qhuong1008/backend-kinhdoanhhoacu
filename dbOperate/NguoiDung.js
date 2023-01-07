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

async function EditNguoiDung(user) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("MaNguoiDung", sql.NVarChar, user.MaNguoiDung)
      .input("TenDangNhap", sql.NVarChar, user.TenDangNhap)
      .input("MatKhau", sql.NVarChar, user.MatKhau)
      .input("HoTen", sql.NVarChar, user.HoTen)
      .input("NgaySinh", sql.Date, user.NgaySinh)
      .input("DiaChi", sql.NVarChar, user.DiaChi)
      .query(
        "exec UpdateNguoiDung @MaNguoiDung,@TenDangNhap,@MatKhau,@HoTen,@NgaySinh,@DiaChi"
      );
  } catch (error) {
    console.log(error);
  }
}
async function ChangePassword(user) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("MaNguoiDung", sql.NVarChar, user.MaNguoiDung)
      .input("MatKhau", sql.NVarChar, user.MatKhau)
      .query("exec changePassword @MaNguoiDung,@MatKhau");
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getAllNguoiDung,
  getNguoiDungAuth,
  getNguoiDungById,
  EditNguoiDung,
  ChangePassword,
};
