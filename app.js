const express = require("express");
const app = express();
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const queryWithTransaction = require("./db");
const xss = require("xss-clean");
const limitrate = require("express-rate-limit");
const path = require("path");
const globalErrorController = require("./Controllers/errorController");
const userRouter = require("./Routes/userRoute");
const reviewRouter = require("./Routes/reviewRoute");
const productRouter = require("./Routes/productRoute");
const colorRouter = require("./Routes/colorRoute");
const attributeRouter = require("./Routes/attributeRoute");
const brandRouter = require("./Routes/brandRoute");
const cartRouter = require("./Routes/cartRoute");
const promotionRouter = require("./Routes/promotionRoute");
const sizeRouter = require("./Routes/sizeRoutes");
const shippingRouter = require("./Routes/shippingRoute");
const paymentRouter = require("./Routes/paymentRoute");
const orderRouter = require("./Routes/orderRoute");
app.use(express.json({ limit: "10kb" }));
app.use(xss());
const limiter = limitrate({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "too many requests from this IP",
});
app.use("/api", limiter);
app.use(queryWithTransaction);
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(hpp());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/color", colorRouter);
app.use("/api/v1/attribute", attributeRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/size", sizeRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/promotion", promotionRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/shipping", shippingRouter);
app.use("*", (req, res, next) => {});
app.use(globalErrorController);
module.exports = app;
