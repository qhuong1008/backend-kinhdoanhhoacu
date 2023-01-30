var config = require("./config");
const sql = require("mssql");

async function getAllHoaDon(userID) {
  try {
    let pool = await sql.connect(config);
    let hoadonlist = await pool
      .request()
      .input("userID", sql.NVarChar, userID)
      .query(
        "select * from HoaDon where HoaDon.MaHoaDon not like '%cart%' order by HoaDon.ThoiGianGiaoHang DESC"
      );
    return hoadonlist.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getAllHoaDonByUserId(userID) {
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
async function getHoaDonByOrderId(orderID) {
  try {
    let pool = await sql.connect(config);
    let hoadonlist = await pool
      .request()
      .input("orderID", sql.NVarChar, orderID)
      .query(
        "select * from HoaDon where HoaDon.MaHoaDon=@orderID and HoaDon.MaHoaDon not like '%cart%'"
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

async function EditOrder(hoadon) {
  try {
    let pool = await sql.connect(config);
    await pool
      .request()
      .input("MaHoaDon", sql.NVarChar, hoadon.MaHoaDon)
      .input("GhiChu", sql.NVarChar, hoadon.GhiChu)
      .input("TongThanhToan", sql.Int, hoadon.TongThanhToan)
      .input("HoTen", sql.NVarChar, hoadon.HoTen)
      .input("DiaChiGiaoHang", sql.NVarChar, hoadon.DiaChiGiaoHang)
      .input("SoDienThoai", sql.NVarChar, hoadon.SoDienThoai)
      .input("MaKhachHang", sql.NVarChar, hoadon.MaKhachHang)
      .input("ThoiGianGiaoHang", sql.Date, hoadon.ThoiGianGiaoHang)
      .input("TrangThaiDonHang", sql.Bit, hoadon.TrangThaiDonHang)
      .input("TrangThaiGiaoHang", sql.Int, hoadon.TrangThaiGiaoHang)
      .input("TrangThaiThanhToan", sql.Bit, hoadon.TrangThaiThanhToan)
      .query(
        "exec editHoaDon @MaHoaDon, @GhiChu,@TongThanhToan,@HoTen,@DiaChiGiaoHang,@SoDienThoai,@MaKhachHang,@ThoiGianGiaoHang,@TrangThaiDonHang,@TrangThaiGiaoHang,@TrangThaiThanhToan"
      );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  ThanhToanHoaDon,
  getAllHoaDon,
  getAllHoaDonByUserId,
  getAllProductsFromHoaDon,
  getHoaDonByOrderId,
  EditOrder,
};
