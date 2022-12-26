const SanPhamDb = require("./dbOperate/SanPham");

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
var port = process.env.PORT || 8090;
app.listen(port);
console.log("User API is runnning at " + port);
