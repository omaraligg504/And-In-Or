const orderController = require("./../Controllers/orderController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.post(
  "/addOrder",
  authController.protected,
  authController.restrictedto("user"),
  orderController.addOrder
);
router.post(
  "/addOrderProduct",
  authController.protected,
  authController.restrictedto("user"),
  orderController.addOrderProduct
);

router.get(
  "/getMyOrders",
  authController.protected,
  authController.restrictedto("user"),
  orderController.getMyOrder
);
router.get(
  "/getMyOrderProducts/:id",
  authController.protected,
  authController.restrictedto("user"),
  orderController.getMyOrderProducts
);
router.use(authController.protected, authController.restrictedto("admin"));
router
  // .post("/addOrderStatus", orderController.addOrderStatus)
  // .get("/getOrderStatus/:id", orderController.getOneOrderStatus)
  // .get("/getAllOrderStatus", orderController.getAllOrderStatus)
  // .delete("/deleteOrderStatus/:id", orderController.deleteoneOrderStatus)
  // .patch("/updateOrderStatus/:id", orderController.updateOneOrderStatus)
  // .patch("/updateAllOrderStatus", orderController.updateAllOrderStatus)
  .get("/getOrderProduct/:id", orderController.getOneOrderProduct)
  .get("/getAllOrderProducts", orderController.getAllOrderProduct)
  .delete("/deleteOrderProduct/:id", orderController.deleteoneOrderProduct)
  .patch("/updateOrderProduct/:id", orderController.updateOneOrderProduct)
  .patch("/updateAllOrderProducts", orderController.updateAllOrderProduct)
  .get("/getOrder/:id", orderController.getOneOrder)
  .get("/getAllOrders", orderController.getAllOrder)
  .delete("/deleteOrder/:id", orderController.deleteoneOrder)
  .patch("/updateOrder/:id", orderController.updateOneOrder)
  .patch("/updateAllOrders", orderController.updateAllOrder);

module.exports = router;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMjMxODkwNiwiZXhwIjoxNzEzMTgyOTA2fQ.9wliHOI_PxBmDpsf3TvI6FPZLtnQ20vMhZBsVe_aux8
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTcxMjMxODkwNiwiZXhwIjoxNzEzMTgyOTA2fQ.9wliHOI_PxBmDpsf3TvI6FPZLtnQ20vMhZBsVe_aux8