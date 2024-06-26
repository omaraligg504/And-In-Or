const catchAsync = require("./../Utils/catchAsync");
const AppError=require('./../Utils/appError')
const handlerFactory = require("./handlerFactory");
const {missing}=handlerFactory
exports.addCart = catchAsync(async (req, res, next) => {
  const { client } = req;
  const validation= missing('cart',[{name:'user_id',value:req.user.id}])
  //console.log(validation);
  if(validation.length!==0){return next(new AppError(validation,401))}
  const sql = `insert into cart  (user_id ) values($1) returning id`;
  const cart = (await client.query(sql, [req.user.id])).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    cart,
  });
});
exports.addCartItem = catchAsync(async (req, res, next) => {
  const { client } = req;
  const {product_item_id,quantity}=req.body 
   const cartSql=`select get_or_create_cart($1) AS cart_id`;
  const {cart_id}=(await client.query(cartSql,[req.user.id])).rows[0]
  console.log(cart_id);

  const validation= handlerFactory.missing('cart_item ',[{name:'cart_id',value:cart_id},{name:'product item id',value:product_item_id},{name:'quantity',value:quantity}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const sql = `insert into cart_item  (cart_id,product_item_id,quantity ) values($1,$2,$3) returning id`;
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

exports.getOneCart = handlerFactory.getOne("cart");
exports.getMyCart = catchAsync(async (req,res,next)=>{
  const {client}=req; 
   const sql=`select get_or_create_cart($1);`;
  const cart=(await client.query(sql,[req.user.id])).rows[0].get_or_create_cart
  res.status(200).json({
  status:'success',
  cart
  })})

exports.getAllCart = handlerFactory.getAll("cart");
exports.deleteoneCart = handlerFactory.deleteOne("cart");
exports.updateOneCart = handlerFactory.updateOne("cart");
exports.updateAllCart = handlerFactory.updateAll("cart");

//exports.updateMyCart = handlerFactory.updateMyOne("cart_item");
//exports.deleteMyCart=handlerFactory.deleteMyOne('cart_item');/

exports.deleteAllMyCartItems = catchAsync(async (req, res, next) => {
  const { client } = req;
  const {info} =req
  const cartitemsql = `delete from cart_item where cart_id=$1`;
  const cartitemsdelete = (await client.query(cartitemsql, [req.params.cartId])).rows[0];
  await client.query('COMMIT')
  res.status(200).json({
  status:'success',
  cartitemsdelete,
  info
  })
});
exports.getMyCartItems = catchAsync(async (req, res, next) => {
  const { client } = req;
  const myCartItems = await getCartItems(client, req.user.id);
  res.status(200).json({
    status: 'success',
    myCartItems
  });
});

exports.getCartItems = async (client, userId) => {
  const cartSql = `select get_or_create_cart($1);`;
  const cartId = (await client.query(cartSql, [userId])).rows[0].get_or_create_cart;
  const sql = `select * from cart_item where cart_id=$1`;
  const myCartItems = (await client.query(sql, [cartId])).rows;
  return myCartItems;
};

exports.getOneCart_item = handlerFactory.getOne("cart_item");
exports.getAllCart_item = handlerFactory.getAll("cart_item");
exports.deleteoneCart_item = handlerFactory.deleteOne("cart_item");
exports.updateOneCart_item = handlerFactory.updateOne("cart_item");
exports.updateAllCart_item = handlerFactory.updateAll("cart_item");
