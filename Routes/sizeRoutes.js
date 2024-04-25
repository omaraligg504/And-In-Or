const express = require("express");
const router = express.Router();
const sizeController=require('./../Controllers/sizeController')
const authController=require('./../Controllers/authController')

router.use(authController.protected,authController.restrictedto('admin'))
router.
post('/addSizeCategory',sizeController.addSizeCategory).
post('/addSize',sizeController.addsize)
.get('/getSize/:id',sizeController.getOneSize)
.get('/getAllSizes',sizeController.getAllSize)
.delete('/deleteSize/:id',sizeController.deleteoneSize)
.patch('/updateSize/:id',sizeController.updateOneSize)
.patch('/updateAllSizes',sizeController.updateAllSize)
.post('/addSizeCategory',sizeController.addSizeCategory)
.get('/getonesizecategory/:id',sizeController.getOneSize)
.get('/getAllSizeCategories',sizeController.getAllSize)
.delete('/deleteonesizecategory/:id',sizeController.deleteoneSize)
.patch('/updateonesizecategory/:id',sizeController.updateOneSize)
.patch('/updateallsizecategories',sizeController.updateAllSize)

module.exports = router;
