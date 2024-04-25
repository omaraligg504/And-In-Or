const promotionController = require("./../Controllers/promotionController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.use(authController.protected,authController.restrictedto('admin'))
router.
post('/addPromotion',promotionController.addpromotion)
.get('/getPromotion/:id',promotionController.getPromotion)
.get('/getAllPromotions',promotionController.getAllPromotion)
.delete('/deletePromotion/:id',promotionController.deletePromotion)
.patch('/updatePromotion/:id',promotionController.updatePromotion)
.patch('/updateAllPromptoins',promotionController.updateAllPromotion)
.post('/addProductPromotion',promotionController.addProductPromotion)
.get('/getProductPromotion/:id',promotionController.getProductPromotion)
.get('/getAllProductPromotions',promotionController.getAllProductPromotion)
.delete('/deleteProductPromotion/:id',promotionController.deleteProductPromotion)
.patch('/updateProductPromotion/:id',promotionController.updateProductPromotion)
.patch('/updateAllProductPromptoins',promotionController.updateAllProductPromotion)
module.exports = router;