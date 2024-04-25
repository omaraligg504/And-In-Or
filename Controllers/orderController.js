const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')

exports.addOrder = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into orders  (user_id,order_date,shipping_method_id,order_total ) values($1,$2,$3,$4,$5) returning id,order_total`;
  const {shipping_mehod_id,totalPrice}=req.body
  const user_id=req.user.id
  const timestamp = new Date(Date.now());
  const order_date = timestamp.toISOString().split('T')[0];
  const validation= handlerFactory.missing(' order ',[{name:'user id',value:user_id},{name:'order date',value:order_date},{name:"shipping mehod id",value:shipping_mehod_id},{name:'order total price amount',value:order_total},])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const Order = (await client.query(sql, [user_id,order_date,shipping_mehod_id,totalPrice])).rows[0];
  await client.query("COMMIT");
  req.order=Order
});

exports.getCartProductsPrice=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const id=req.user.id
   const cartSql=`SELECT
   sc.cart_id,
      SUM(pi.price * sci.quantity) AS total_price
        FROM
          shopping_cart sc
        JOIN
          shopping_cart_item sci ON sc.cart_id = sci.cart_id
        JOIN
          product_items pi ON sci.product_id = pi.product_id
        WHERE
          sc.user_id = <user_id> -- Replace <user_id> with the actual user ID
        GROUP BY
          sc.cart_id;`;
  const totalPrice=(await client.query(cartSql,[id])).rows[0]
  req.totalPrice=totalPrice
  next();
})

exports.getProductPrice=catchAsync(async (req,res,next)=>{
  const {client}=req;
  const id=req.params.id 
   const sql=`select sale_price from product_item  
    where id=$1`;
  const price=(await client.query(sql,[id])).rows[0]
  req.totalPrice=price;
  next();
})
exports.checkOrderStatus=catchAsync(async (req,res,next)=>{
  if(req.order.status=='succeded'||req.order.status=='shipping'){
    const {client}=req; 
     const sql=`update product_variation pv set quantity_in_stock=pv.quantity_in_stock -op.quantity  from order_product op where op.order_id=$1 and op.product_variation_id=pv.id`;
    const updateOrder=(await client.query(sql,[req.order.id])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    updateOrder,
    info:req.info
    })
  }
})
// exports.addOrderStatus=catchAsync(async (req,res,next)=>{
//     const {client}=req; 
//      const sql=`insert into order_status (status) values($1)`;
//      const validation= handlerFactory.missing('order status ',[{name:'status',value:req.body.orderStatus}])
//      if(validation.length!==0){return next(new AppError(validation,401))}
//     const orderStatus =(await client.query(sql,[req.body.orderStatus])).rows[0]
//     await client.query('COMMIT')
//     res.status(200).json({
//     status:'success',
//     orderStatus
//     })
// })
exports.addOrderProduct=catchAsync(async (req,res,next)=>{
    const {client}=req; 
     const sql=`insert into order_product (product_variation_id, order_id,quantity,price) values($1,$2,$3,$4)`;
    const{product_variation_id, order_id,quantity,price}=req.body
    const validation= handlerFactory.missing('order Product',[{name:'product item id',value:product_variation_id},{name:'order id ',value:order_id},{name:'quantit',value:quantity},{name:"price",value:price}])
    if(validation.length!==0){return next(new AppError(validation,401))}
     
    const orderProduct=(await client.query(sql,[product_variation_id, order_id,quantity,price])).rows[0]
     await client.query('COMMIT')
     res.status(200).json({
     status:'success',
     orderProduct
     })
})

exports.getMyOrder=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const id=req.params.id
   const sql=`select * from orders where id=$1`;
  const order=(await client.query(sql,[id])).rows[0]
  res.status(200).json({
  status:'success',
  order
  })
})
exports.getMyOrders=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const id=req.user.id
   const sql=`select * from orders where user_id=$1`;
  const orders=(await client.query(sql,[id])).rows[0]
  res.status(200).json({
  status:'success',
  orders
  })
})

exports.getMyOrdersProducts=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const userId=req.user.id
  //const id=req.params.id
   const sql=`select id from orders where user_id=$1 `;
  const OrderId=(await client.query(sql,[userId])).rows[0]
  const ordersql=`select * from order_product where order_id= $1`
  //console.log(OrderId.id);
  const ordersProducts=(await client.query(ordersql,[OrderId.id])).rows[0]
  res.status(200).json({
  status:'success',
  ordersProducts
  })
})
exports.getMyOrderProducts=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const userId=req.user.id
  const id=req.params.id
   const sql=`select id from orders where user_id=$1 AND id=$2`;
  const OrderId=(await client.query(sql,[userId,id])).rows[0]
  const ordersql=`select * from order_product where order_id= $1`
  //console.log(OrderId.id);
  const orderProducts=(await client.query(ordersql,[OrderId.id])).rows[0]
  res.status(200).json({
  status:'success',
  orderProducts
  })
})
exports.updateOrder=
  catchAsync(async (req,res,next)=>{
    const id=req.body.order.id
    const status=req.body.order.id
    const {client}=req
    console.log(params,value);
    const sql=`update  orders set status = ${status}  where id = $1 `
    const results=(await client.query(sql,[id])).rows[0]
    res.status(200).json({
      status: "success",
      results,
      id
    });
  })

exports.getOneOrder=handlerFactory.getOne('orders');
exports.getAllOrder=handlerFactory.getAll('orders')
exports.deleteoneOrder=handlerFactory.deleteOne('orders');
exports.updateOneOrder=handlerFactory.updateOne('orders');
exports.updateAllOrder=handlerFactory.updateAll('orders');
exports.getOneOrderProduct=handlerFactory.getOne('order_product');
exports.getAllOrderProduct=handlerFactory.getAll('order_product')
exports.deleteoneOrderProduct=handlerFactory.deleteOne('order_product');
exports.updateOneOrderProduct=handlerFactory.updateOne('order_product');
exports.updateAllOrderProduct=handlerFactory.updateAll('order_product');
// exports.getOneOrderStatus=handlerFactory.getOne('order_status');
// exports.getAllOrderStatus=handlerFactory.getAll('order_status')
// exports.deleteoneOrderStatus=handlerFactory.deleteOne('order_status');
// exports.updateOneOrderStatus=handlerFactory.updateOne('order_status');
// exports.updateAllOrderStatus=handlerFactory.updateAll('order_status');