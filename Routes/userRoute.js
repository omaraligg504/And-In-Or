const userController = require("./../Controllers/userController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");//console.log('omar');




router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/signup", authController.signup);


//                  ONLY USERS


router.use(authController.protected)
router.get('/me',userController.getMe);
router.delete('/deleteme',userController.deleteMe)
router.get('/forgetpassword',authController.forgetPassword)
router.post('/resetpassword/:token',authController.resetPassword)
router.post('/addaddress',userController.addAddress)
router.post('/updateMyPassword',authController.updateMyPassword)
router.post('/updateMyEmail',authController.updateMyEmail)
router.post('/updateMyPhoneNumber',authController.updateMyPhoneNumber)
router.patch('/updateUserPhoto',userController.uploadUserPhoto,userController.resizeUserPhoto)




//                 ONLY PROVIDERS



//                  ONLY ADMINS

router.use( authController.restrictedto('admin'));
router
  .route("/")
  .get(userController.getAllUsers)

  router
.route('/makeAdmin/:id')
.patch(userController.makeAdmin)
router
  .route("/:id")
  .get(userController.getOneUser)
  .delete(userController.deleteOneUser)



  module.exports = router;
