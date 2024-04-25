const reviewController = require("./../Controllers/reviewController");
const express = require("express");
const router = express.Router();
const authController = require("./../Controllers/authController");

router.get("/getProductsReviews/:id", reviewController.getProductsReviews);
router.use(authController.protected);
router.get(
  "/getMyReviews",
  authController.restrictedto("user"),
  reviewController.getmyreviews
);
router.post(
  "/addReview",
  authController.restrictedto("user"),
  reviewController.addReview
);
router.delete(
  "/deleteMyReview/:id",
  authController.restrictedto("user"),
  reviewController.deletemyreview
);
router.delete(
  "/deleteMyAllReviews",
  authController.restrictedto("user"),
  reviewController.deleteallmyreview
);
router.patch(
  "/updateMyReview/:id",
  authController.restrictedto("user"),
  reviewController.updatemyreview
);

router.use(authController.restrictedto("admin"));
router
  .get("/getReview/:id", reviewController.getOneReview)
  .delete("/deleteProductReviews/:id", reviewController.deleteProductsReviews)
  .get("/getAllReviews", reviewController.getAllReview)
  .delete("/deleteReview/:id", reviewController.deleteoneReview);
// .patch('/updateReview',reviewController.updateOneReview)
// .patch('/updateallreview',)
module.exports = router;
