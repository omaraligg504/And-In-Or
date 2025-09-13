const brandController = require("./../Controllers/brandController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.get('/getBrand/:id',brandController.getOneBrand)
.get('/getAllBrands',brandController.getAllBrand)
router.use(authController.protected,authController.restrictedto('provider'))
router.
post('/addBrand',brandController.addbrand)

.delete('/deleteBrand/:id',brandController.deleteoneBrand)
.patch('/updateBrand/:id',brandController.updateOneBrand)
module.exports = router;