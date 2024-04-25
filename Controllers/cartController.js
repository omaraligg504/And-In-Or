const catchAsync = require("./../Utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const {missing}=handlerFactory
exports.addCart = catchAsync(async (req, res, next) => {
  const { client } = req;
  const validation= missing('shopping_cart',[{name:'user_id',value:req.user.id}])
  //console.log(validation);
  if(validation.length!==0){return next(new AppError(validation,401))}
  const sql = `insert into shopping_cart  (user_id ) values($1) returning id`;
  const cart = (await client.query(sql, [req.user.id])).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    cart,
  });
});
exports.addCartItem = catchAsync(async (req, res, next) => {
  const { client } = req;
  const {cart_id,product_item_id,quantity}=req.body 
  const validation= handlerFactory.missing('shopping_cart_item ',[{name:'cart_id',value:cart_id},{name:'product item id',value:product_item_id},{name:'quantity',value:quantity}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const sql = `insert into shopping_cart_item  (cart_id,product_item_id,quantity ) values($1,$2,$3) returning id`;
  const cart_item = (
    await client.query(sql, [
      cart_id,
      product_item_id,
      quantity,
    ])
  ).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    cart_item,
  });
});

exports.getOneCart = handlerFactory.getOne("shopping_cart");
exports.getMyCart = handlerFactory.getMyOne("shopping_cart");
exports.getAllCart = handlerFactory.getAll("shopping_cart");
exports.deleteoneCart = handlerFactory.deleteOne("shopping_cart");
exports.updateOneCart = handlerFactory.updateOne("shopping_cart");
exports.updateAllCart = handlerFactory.updateAll("shopping_cart");

//exports.updateMyCart = handlerFactory.updateMyOne("shopping_cart_item");
//exports.deleteMyCart=handlerFactory.deleteMyOne('shopping_cart_item');/

exports.deleteAllMyCartItems = catchAsync(async (req, res, next) => {
  const { client } = req;
  const {info} =req
  const cartitemsql = `delete from shopping_cart_item where cart_id=$1`;
  const cartitemsdelete = (await client.query(cartitemsql, [req.params.cartId])).rows[0];
  await client.query('COMMIT')
  res.status(200).json({
  status:'success',
  cartitemsdelete,
  info
  })
});

exports.getOneCart_item = handlerFactory.getOne("shopping_cart_item");
exports.getAllCart_item = handlerFactory.getAll("shopping_cart_item");
exports.deleteoneCart_item = handlerFactory.deleteOne("shopping_cart_item");
exports.updateOneCart_item = handlerFactory.updateOne("shopping_cart_item");
exports.updateAllCart_item = handlerFactory.updateAll("shopping_cart_item");
