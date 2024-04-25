const saleController = require("./../Controllers/saleController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.use(authController.protected,authController.restrictedto('admin'))
router.
post('/addSale',saleController.addSale)
.get('/getSale/:id',saleController.getSale)
.get('/getAllSale',saleController.getAllSale)
.delete('/deleteSale/:id',saleController.deleteSale)
.patch('/updateSale/:id',saleController.updateSale)
.patch('/updateAllSales',saleController.updateAllSales)
.post('/addProductSale',saleController.addProductCategorySale)
.get('/getProductCategorySale/:id',saleController.getProductCategorySale)
.get('/getAllProductCategorySale',saleController.getAllProductCategorySales)
.delete('/deleteProductCategorySale/:id',saleController.deleteProductCategorySale)
.patch('/updateProductCategorySale/:id',saleController.updateProductCategorySale)
.patch('/updateAllProductCategorySales',saleController.updateAllProductCategorySales)
module.exports = router;