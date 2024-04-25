const attributeController = require("./../Controllers/attributeController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");
router.use(authController.protected,authController.restrictedto('admin'))
router.
post('/addAttributeType',attributeController.addattributeType)
.post('/addAttributeOption',attributeController.addattributeOption)
.get('/getAttributeType/:id',attributeController.getOneAttributeType)
.get('/getAllAttributeTypes',attributeController.getAllAttributeType)
.get('/getAttributeOption/:id',attributeController.getOneAttributeOption)
.get('/getAllAttributeOptions',attributeController.getAllAttributeOption)
.delete('/deleteAttributeType/:id',attributeController.deleteOneAttributeType)
.patch('/updateAttributeType/:id',attributeController.updateOneAttributeType)
.patch('/updateAllAttributeOptions',attributeController.updateAllAttributeOption)
.delete('/deleteAttributeOption/:id',attributeController.deleteOneAttributeOption)
.patch('/updateAttributeOption/:id',attributeController.updateOneAttributeOption)
.patch('/updateAllAttributeTypes',attributeController.updateAllAttributeType)
module.exports = router;