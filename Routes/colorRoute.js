const colorController = require("./../Controllers/colorController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.use(authController.protected,authController.restrictedto('admin'))
router.
post('/addcolor',colorController.addcolor)
.get('/getColor/:id',colorController.getOneColor)
.get('/getAllColors',colorController.getAllColor)
.delete('/deleteColor/:id',colorController.deleteoneColor)
.patch('/updateColor/:id',colorController.updateOneColor)
.patch('/updateAllColors',colorController.updateAllColor)
module.exports = router;