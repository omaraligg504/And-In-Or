const productController=require('../Controllers/productController')
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.use(authController.protected,authController.restrictedto('admin'))

router.
post('/addProductRelation',productController.addRealtedProducts).
patch('/uploadProductImages/:id',productController.uploadProductItemPhoto,productController.resizeProductPhoto)
.get('/getProductsBoughtWith/:id',productController.getProductBoughtTogether).
get('/getRelatedProducts/:id',productController.getRelatedProducts)
.delete('/deleteProductRelation/:id',productController.deleteProductRelation).
post('/addproductcategory',productController.addProductCategory)
 .post('/addproduct',productController.addProduct)
 .post('/addproductitem',productController.addProductItem)
 .post('/addproductimage',productController.addProductImage)
 .post('/addproductvariation',productController.addProductVariation)
 .post('/addproductattribute',productController.addProductAttribute)
.get('/getproductcategory/:id',productController.getOneProductCategory)
.get('/getallproductcategories',productController.getAllProductCategory)
.patch('/updateoneproductcategory/:id',productController.updateOneProductCategory)
.patch('/updateallproductcategories',productController.updateAllProductCategory)
.delete('/deleteoneproductcategory/:id',productController.deleteoneProductCategory)
.get('/getproductvariation/:id',productController.getOneProductVariation)
.get('/getallproductvariation',productController.getAllProductVariation)
.patch('/updateoneproductvariation/:id',productController.updateOneProductVariation)
.patch('/updateallproductvariations',productController.updateAllProductVariation)
.delete('/deleteoneproductvariation/:id',productController.deleteoneProductVariation)
.get('/getproduct/:id',productController.getOneProduct)
.get('/getallproduct',productController.getAllProduct)
.patch('/updateoneproduct/:id',productController.updateOneProduct)
.patch('/updateallproduct',productController.updateAllProduct)
.delete('/deleteoneproduct/:id',productController.deleteoneProduct)
.get('/getproductpromotion/:id',productController.getOneProductpromtion)
.get('/getallproductpromotion',productController.getAllProductpromtion)
.patch('/updateoneproductpromotion/:id',productController.updateOneProductpromtion)
.patch('/updateallproductpromotion',productController.updateAllProductpromtion)
.delete('/deleteoneproductpromotion/:id',productController.deleteoneProductpromtion)
.get('/getproductimage/:id',productController.getOneProductImage)
.get('/getallproductimages',productController.getAllProductImage)
.patch('/updateoneproductimage/:id',productController.updateOneProductImage)
.patch('/updateallproductimages',productController.updateAllProductImage)
.delete('/deleteoneproductimage/:id',productController.deleteoneProductImage)
.get('/getproductattribute/:id',productController.getOneProductAttribute)
.get('/getallproductattributes',productController.getAllProductAttribute)
.patch('/updateoneproductattribute/:id',productController.updateOneProductAttribute)
.patch('/updateallproductattributes',productController.updateAllProductAttribute)
.delete('/deleteoneproductattribute/:id',productController.deleteoneProductAttribute)
module.exports = router;
