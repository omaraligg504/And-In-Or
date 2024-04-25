const shippingController = require("./../Controllers/shippingController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.use(authController.protected,authController.restrictedto('admin'))
router
.post('/addShippingMethod',shippingController.addShipingMethod)
.get('/getShippingMethod/:id',shippingController.getOneShippingMethod)
.get('/getAllShippingMethods',shippingController.getAllShippingMethod)
.delete('/deleteShippingMethod/:id',shippingController.deleteoneShippingMethod)
.patch('/updateShippingMethod/:id',shippingController.updateOneShippingMethod)
.patch('/updateAllShippingMethods',shippingController.updateAllShippingMethod)
module.exports = router;