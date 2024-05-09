const cartController = require("./../Controllers/cartController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");

router
.get('/getMyCart',authController.protected,authController.restrictedto('user'),cartController.getMyCart)
.get('/getMyCartItems',authController.protected,authController.restrictedto('user'),cartController.getMyCartItems)
.post('/addCart',authController.protected,authController.restrictedto('user'),cartController.addCart)
.post('/addCartItem',authController.protected,authController.restrictedto('user'),cartController.addCartItem)


router.use(authController.protected,authController.restrictedto('admin'))

router.get('/getCart/:id',cartController.getOneCart)
.get('/getAllCarts',cartController.getAllCart)
.delete('/deleteCart/:id',cartController.deleteoneCart)
.patch('/updateCart:/id',cartController.updateOneCart)
.patch('/updateAllCarts',cartController.updateAllCart)
router.get('/getCartItem/:id',cartController.getOneCart_item)
.get('/getAllCartItems',cartController.getAllCart_item)
.delete('/deleteCartItem/:id',cartController.deleteoneCart_item)
.patch('/updateCartItem/:id',cartController.updateOneCart_item)
.patch('/updateAllCartItems',cartController.updateAllCart_item)


module.exports = router;