const paymentController = require("../Controllers/paymentController");
const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const orderController=require('../Controllers/orderController');
const purchaseController=require('../Controllers/purchaseController')
router.use(authController.protected)
// router.post('/addUserPaymentMethod',authController.restrictedto('user'),paymentController.addUserPaymentMethod)
// router.post('/deleteMyPaymentMethod/:id',authController.restrictedto('user'),paymentController.deleteMyPaymentMethod)
// router.post('/updateMyPaymentMethod/:id',authController.restrictedto('user'),paymentController.updateMyPaymentMethod)
router.post('/payProductWithStripe',authController.restrictedto('user'),orderController.getProductPrice,orderController.addOrder,paymentController.stripePayment,orderController.updateOrder)
router.post('/payCartProductsWithStripe',authController.restrictedto('user'),orderController.getCartProductsPrice,orderController.addOrder,orderController.addOrderProduct,purchaseController.checkStock,paymentController.stripePayment,orderController.updateOrder,purchaseController.afterPayment)
router.post('/cancelOrRefund',paymentController.cancelOrRefund,orderController.updateOrder,purchaseController.afterPayment)
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