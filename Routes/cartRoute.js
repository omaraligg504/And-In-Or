const cartController = require("./../Controllers/cartController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");

router
.get('/getMyCart',authController.protected,authController.restrictedto('user'),cartController.getMyCart)
.get('/getMyCartItems',authController.protected,authController.restrictedto('user'),cartController.getMyCartItems)
.post('/addCart',authController.protected,authController.restrictedto('user'),cartController.addCart)
.post('/addCartItem',authController.protected,authController.restrictedto('user'),cartController.addCartItem)
.delete('/deleteMyCartItem/:id',authController.protected,authController.restrictedto('admin','user'),cartController.deleteoneCartItem)
.delete('/deleteAllMyCartItems',authController.protected,authController.restrictedto('user'),cartController.deleteAllMyCartItems)


router.use(authController.protected,authController.restrictedto('admin'))

router.get('/getCart/:id',cartController.getOneCart)
.get('/getAllCarts',cartController.getAllCart)
.delete('/deleteCart/:id',cartController.deleteoneCart)
.patch('/updateCart:/id',cartController.updateOneCart)
.patch('/updateAllCarts',cartController.updateAllCart)
router.get('/getCartItem/:id',cartController.getOneCartItem)
.get('/getAllCartItems',cartController.getAllCartItem)
.delete('/deleteCartItem/:id',cartController.deleteoneCartItem)
.patch('/updateCartItem/:id',cartController.updateOneCartItem)
.patch('/updateAllCartItems',cartController.updateAllCartItem)


module.exports = router;