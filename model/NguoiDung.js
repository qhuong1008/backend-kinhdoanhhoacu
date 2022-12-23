class NguoiDung {
  constructor(
    MaNguoiDung,
    TenDangNhap,
    MatKhau,
    HoTen,
    NgaySinh,
    DiaChi,
    RoleId,
    DaXoa
  ) {
    this.MaNguoiDung = MaNguoiDung;
    this.TenDangNhap = TenDangNhap;
    this.MatKhau = MatKhau;
    this.HoTen = HoTen;
    this.NgaySinh = NgaySinh;
    this.DiaChi = DiaChi;
    this.RoleId = RoleId;
    this.DaXoa = DaXoa;
  }
}
module.exports = NguoiDung;
