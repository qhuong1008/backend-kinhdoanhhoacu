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
router.route("/sanpham/add").post((request, response) => {
  let sanpham = { ...request.body };
  SanPhamDb.AddSanPham(sanpham).then((data) => {
    response.status(201).json(data);
  });
});
router.route("/loaisanpham").get((request, response) => {
  SanPhamDb.getAllLoaiSP().then((data) => {
    response.json(data[0]);
  });
});
router.route("/loaisanpham/add").post((request, response) => {
  let loaisanpham = { ...request.body };
  SanPhamDb.AddLoaiSanPham(loaisanpham).then((data) => {
    response.status(201).json(data);
  });
});
router.route(`/sanpham/delete/:id`).post((request, response) => {
  SanPhamDb.DeleteSanPhamById(request.params.id).then((data) => {
    response.status(201).json(data);
  });
});
router.route(`/loaisanpham/delete/:id`).post((request, response) => {
  SanPhamDb.DeleteLoaiSanPhamById(request.params.id).then((data) => {
    response.status(201).json(data);
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
router.route("/nguoidung/add").post((request, response) => {
  let user = { ...request.body };
  NguoiDungDb.AddNguoiDung(user).then((data) => {
    response.status(201).json(data);
  });
});
router.route("/nguoidung/delete/:id").post((request, response) => {
  NguoiDungDb.DeleteNguoiDungById(request.params.id).then((data) => {
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

router.route("/delete/cart").post((request, response) => {
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
router.route("/hoadon").get((request, response) => {
  HoaDonDb.getAllHoaDon().then((data) => {
    response.json(data[0]);
  });
});
router.route("/hoadon/:userID").get((request, response) => {
  HoaDonDb.getAllHoaDonByUserId(request.params.userID).then((data) => {
    response.json(data[0]);
  });
});
router.route("/hoadon/orderId/:orderID").get((request, response) => {
  HoaDonDb.getHoaDonByOrderId(request.params.orderID).then((data) => {
    response.json(data[0]);
  });
});
router.route("/hoadon/products/:orderID").get((request, response) => {
  HoaDonDb.getAllProductsFromHoaDon(request.params.orderID).then((data) => {
    response.json(data[0]);
  });
});
// LISTEN PORT
var port = process.env.PORT || 8090;
app.listen(port);
console.log("User API is runnning at " + port);
