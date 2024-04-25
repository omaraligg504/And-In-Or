const paymentController = require("../Controllers/paymentController");
const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const orderController=require('../Controllers/orderController');
router.use(authController.protected)
// router.post('/addUserPaymentMethod',authController.restrictedto('user'),paymentController.addUserPaymentMethod)
// router.post('/deleteMyPaymentMethod/:id',authController.restrictedto('user'),paymentController.deleteMyPaymentMethod)
// router.post('/updateMyPaymentMethod/:id',authController.restrictedto('user'),paymentController.updateMyPaymentMethod)
router.post('/payProductWithStripe',orderController.getProductPrice,orderController.addOrder,authController.restrictedto('user'),paymentController.stripePayment,orderController.updateOrder)
router.post('/payProductWithStripe',orderController.getCartProductsPrice,orderController.addOrder,authController.restrictedto('user'),paymentController.stripePayment,orderController.updateOrder)

// router.use(authController.restrictedto('admin'))
// router.
// post('/addPaymentMethod',paymentController.addpaymentMethod)
// .get('/getPaymentMethod/:id',paymentController.getOnePaymentMethod)
// .get('/getUsersPaymentMethod/user/:id/paymentMethod/:sid',paymentController.getUsersPaymentMethod)
// .get('/deleteUsersPaymentMethod/user/:id/paymentMethod/:sid',paymentController.deleteUsersPaymentMethod)
// .get('/updateUsersPaymentMethod/user/:id/paymentMethod/:sid',paymentController.updateUsersPaymentMethod)
// .get('/getAllPaymentMethods',paymentController.getAllPaymentMethod)
// .delete('/deletePaymentMethod/:id',paymentController.deleteonePaymentMethod)
// .patch('/updatePaymentMethod/:id',paymentController.updateOnePaymentMethod)
// .delete('/deleteUsersPaymentMethod/:id',paymentController.deleteonePaymentMethod)
// .patch('/updateUsersPaymentMethod/:id',paymentController.updateOnePaymentMethod)
// .patch('/updateAllPaymentMethods',paymentController.updateAllPaymentMethod)
module.exports = router;