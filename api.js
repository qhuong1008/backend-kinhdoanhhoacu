const SanPhamDb = require("./dbOperate/SanPham");
const NguoiDungDb = require("./dbOperate/NguoiDung");
const CartDb = require("./dbOperate/Cart");
const HoaDonDb = require("./dbOperate/HoaDon");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

router.use((request, response, next) => {
  response.setHeader(
    "Access-Control-Allow-Headers",
    "accept, authorization, content-type, x-requested-with"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE"
  );
  response.setHeader("Access-Control-Allow-Origin", response.header("origin"));
  response.header("Access-Control-Allow-Origin", "*");
  next();
});

// ****** API SANPHAM ******
// *************************
router.route("/sanpham").get((request, response) => {
  SanPhamDb.getSanPham().then((data) => {
    response.json(data[0]);
  });
});
router.route("/sanpham/:id").get((request, response) => {
  SanPhamDb.getSanPhamById(request.params.id).then((data) => {
    response.json(data[0]);
  });
});
router.route("/sanpham/lsp/:id").get((request, response) => {
  SanPhamDb.getTenLoaiSanPhamBySPId(request.params.id).then((data) => {
    response.json(data[0]);
  });
});

// ****** API NGUOIDUNG ****
// *************************
router.route("/nguoidung").get((request, response) => {
  NguoiDungDb.getAllNguoiDung().then((data) => {
    response.json(data[0]);
  });
});
router.route("/nguoidung/:id").get((request, response) => {
  NguoiDungDb.getNguoiDungById(request.params.id).then((data) => {
    response.json(data[0]);
  });
});
router.route("/nguoidung").post((request, response) => {
  let user = { ...request.body };
  NguoiDungDb.EditNguoiDung(user).then((data) => {
    response.status(201).json(data);
  });
});
router.route("/nguoidung/changepw").post((request, response) => {
  let user = { ...request.body };
  NguoiDungDb.ChangePassword(user).then((data) => {
    response.status(201).json(data);
  });
});

// ****** API CART *********
// *************************
router.route("/cart/:maHD").get((request, response) => {
  CartDb.GetCartInfo(request.params.maHD).then((data) => {
    response.json(data[0]);
  });
});

router.route("/cart").post((request, response) => {
  let cart = { ...request.body };
  CartDb.AddToCart(cart).then((data) => {
    response.status(201).json(data);
  });
});

router.route("/delete/cart").delete((request, response) => {
  let cart = { ...request.body };
  CartDb.DeleteFromCart(cart).then((data) => {
    response.status(201).json(data);
  });
});

// ****** API HOÁ ĐƠN *********
// *************************
router.route("/hoadon").post((request, response) => {
  let info = { ...request.body };
  HoaDonDb.ThanhToanHoaDon(info).then((data) => {
    response.status(201).json(data);
  });
});
// LISTEN PORT
var port = process.env.PORT || 8090;
app.listen(port);
console.log("User API is runnning at " + port);
