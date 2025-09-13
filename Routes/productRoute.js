const productController=require('../Controllers/productController')
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");


router.
patch('/uploadProductImages/:id',productController.uploadProductItemPhoto,productController.resizeProductPhoto)
.post('/addProduct',productController.addProduct)
.post('/addProductItem',productController.addProductItem)
.post('/addProductImage',productController.addProductImage)
.post('/addProductAttribute',productController.addProductAttribute)
.patch('/updateOneProduct/:id',productController.updateOneProduct)
.delete('/deleteOneProduct/:id',productController.deleteoneProduct)
// .patch('/updateOneProductPromotion/:id',productController.updateOneProductpromtion)
// .delete('/deleteOneProductPromotion/:id',productController.deleteoneProductpromtion)
.delete('/deleteOneProductImage/:id',productController.deleteoneProductImage)
// .patch('/updateOneProductAttribute/:id',productController.updateOneProductAttribute)
.delete('/deleteOneProductAttribute/:id/:sid',productController.deleteoneProductAttribute)


router.use(authController.protected,authController.restrictedto('admin'))

router.
post('/addProductRelation',productController.addRealtedProducts).
get('/getProductsBoughtWith/:id',productController.getProductBoughtTogether).
get('/getRelatedProducts/:id',productController.getRelatedProducts)
.delete('/deleteProductRelation/:id/:sid',productController.deleteProductRelation).
post('/addProductCategory',productController.addProductCategory)
 //.post('/addproductvariation',productController.addProductVariation)
.get('/getProductCategory/:id',productController.getOneProductCategory)
.get('/getallproductcategories',productController.getAllProductCategory)
.patch('/updateOneProductCategory/:id',productController.updateOneProductCategory)
// .patch('/updateAllProductCategories',productController.updateAllProductCategory)
.delete('/deleteOneProductCategory/:id',productController.deleteoneProductCategory)
// .get('/getproductvariation/:id',productController.getOneProductVariation)
// .get('/getallproductvariation',productController.getAllProductVariation)
// .patch('/updateoneproductvariation/:id',productController.updateOneProductVariation)
// .patch('/updateallproductvariations',productController.updateAllProductVariation)
// .delete('/deleteoneproductvariation/:id',productController.deleteoneProductVariation)
.get('/getProduct/:id',productController.getOneProduct)
.get('/getAllProducts',productController.getAllProduct)
// .patch('/updateAllProduct',productController.updateAllProduct)
// .get('/getproductpromotion/:id',productController.getOneProductpromtion)
// .get('/getallproductpromotion',productController.getAllProductpromtion)
// .patch('/updateallproductpromotion',productController.updateAllProductpromtion)
.get('/getProductImage/:id',productController.getOneProductImage)
.get('/getAllProductImages/:id',productController.getAllProductImage)
// .patch('/updateoneproductimage/:id',productController.updateOneProductImage)
// .patch('/updateallproductimages',productController.updateAllProductImage)
// .get('/getProductAttribute/:id',productController.getOneProductAttribute)
.get('/getAllProductAttributes/:id',productController.getAllProductAttribute)
// .patch('/updateallproductattributes',productController.updateAllProductAttribute)
module.exports = router;
