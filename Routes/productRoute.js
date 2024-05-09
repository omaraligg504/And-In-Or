const productController=require('../Controllers/productController')
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");


router.
patch('/uploadProductImages/:id',productController.uploadProductItemPhoto,productController.resizeProductPhoto)
.post('/addproduct',productController.addProduct)
.post('/addproductitem',productController.addProductItem)
.post('/addproductimage',productController.addProductImage)
.post('/addproductattribute',productController.addProductAttribute)
.patch('/updateoneproduct/:id',productController.updateOneProduct)
.delete('/deleteoneproduct/:id',productController.deleteoneProduct)
.patch('/updateoneproductpromotion/:id',productController.updateOneProductpromtion)
.delete('/deleteoneproductpromotion/:id',productController.deleteoneProductpromtion)
.delete('/deleteoneproductimage/:id',productController.deleteoneProductImage)
.patch('/updateoneproductattribute/:id',productController.updateOneProductAttribute)
.delete('/deleteoneproductattribute/:id',productController.deleteoneProductAttribute)


router.use(authController.protected,authController.restrictedto('admin'))

router.
post('/addProductRelation',productController.addRealtedProducts).
get('/getProductsBoughtWith/:id',productController.getProductBoughtTogether).
get('/getRelatedProducts/:id',productController.getRelatedProducts)
.delete('/deleteProductRelation/:id',productController.deleteProductRelation).
post('/addproductcategory',productController.addProductCategory)
 //.post('/addproductvariation',productController.addProductVariation)
.get('/getproductcategory/:id',productController.getOneProductCategory)
.get('/getallproductcategories',productController.getAllProductCategory)
.patch('/updateoneproductcategory/:id',productController.updateOneProductCategory)
.patch('/updateallproductcategories',productController.updateAllProductCategory)
.delete('/deleteoneproductcategory/:id',productController.deleteoneProductCategory)
// .get('/getproductvariation/:id',productController.getOneProductVariation)
// .get('/getallproductvariation',productController.getAllProductVariation)
// .patch('/updateoneproductvariation/:id',productController.updateOneProductVariation)
// .patch('/updateallproductvariations',productController.updateAllProductVariation)
// .delete('/deleteoneproductvariation/:id',productController.deleteoneProductVariation)
.get('/getproduct/:id',productController.getOneProduct)
.get('/getallproduct',productController.getAllProduct)
.patch('/updateallproduct',productController.updateAllProduct)
.get('/getproductpromotion/:id',productController.getOneProductpromtion)
.get('/getallproductpromotion',productController.getAllProductpromtion)
.patch('/updateallproductpromotion',productController.updateAllProductpromtion)
.get('/getproductimage/:id',productController.getOneProductImage)
.get('/getallproductimages',productController.getAllProductImage)
.patch('/updateoneproductimage/:id',productController.updateOneProductImage)
.patch('/updateallproductimages',productController.updateAllProductImage)
.get('/getproductattribute/:id',productController.getOneProductAttribute)
.get('/getallproductattributes',productController.getAllProductAttribute)
.patch('/updateallproductattributes',productController.updateAllProductAttribute)
module.exports = router;
