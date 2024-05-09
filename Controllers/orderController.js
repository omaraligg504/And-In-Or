const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const cartController=require('./cartController')
const AppError=require('../Utils/appError')
exports.addOrder = async (req, res, next) => {
  const { client } = req;
  const sql = `insert into orders  (user_id,order_date,shipping_method_id,order_total ) values($1,$2,$3,$4) returning id,order_total`;
  const {shipping_mehod_id,totalPrice}=req.body
  const user_id=req.user.id
  const timestamp = new Date(Date.now());
  const order_date = timestamp.toISOString().split('T')[0];
  //console.log(order_date);
  const validation= handlerFactory.missing(' order ',[{name:'user id',value:user_id},{name:'order date',value:order_date},{name:"shipping mehod id",value:shipping_mehod_id},{name:'order total price amount',value:totalPrice},])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const Order = (await client.query(sql, [user_id,order_date,shipping_mehod_id,totalPrice])).rows[0];
  await client.query("COMMIT");
  req.body.order=Order
  //console.log(Order);

   
  next()
};

exports.getCartProductsPrice=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const id=req.user.id
   const cartSql=`SELECT
   sc.id,
   SUM(pi.sale_price ::NUMERIC * sci.quantity)::NUMERIC AS total_price
FROM
   cart sc
JOIN
   cart_item sci ON sc.id = sci.cart_id
JOIN
   product_item pi ON sci.product_item_id = pi.id
WHERE
   sc.user_id = $1
GROUP BY
   sc.id;
`;
  const totalPrice=(await client.query(cartSql,[id])).rows[0].total_price
  req.body.totalPrice=totalPrice
  //console.log(totalPrice);
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
     const sql=`update product_item pv set quantity_in_stock=pv.quantity_in_stock -op.quantity  from order_product op where op.order_id=$1 and op.product_item_id=pv.id`;
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
  const items=await cartController.getCartItems(req.client,req.user.id)
    const {client}=req; 
   // console.log(items);
    const sql = `INSERT INTO order_product (product_item_id, order_id, quantity) VALUES($1, $2, $3)`;
    const values = items.map(item => [item.product_item_id, req.body.order.id, item.quantity ]);
     
    //const validation= handlerFactory.missing('order Product',[{name:'product item id',value:product_item_id},{name:'order id ',value:order_id},{name:'quantit',value:quantity},{name:"price",value:price}])
    //if(validation.length!==0){return next(new AppError(validation,401))}
    try {
      await client.query('BEGIN');
      await Promise.all(values.map(async (row) => {
          await client.query(sql, row);
      }));
      await client.query('COMMIT');
      
      next()
  } catch (err) {
      await client.query('ROLLBACK');
      return next(new AppError('Failed to add order products', 500));
  }
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
exports.myOrderProducts=async(client,user_id,orderId)=>{
   const sql=`select id from orders where user_id=$1 AND id=$2`;
  const OrderId=(await client.query(sql,[user_id,orderId])).rows[0]
  const ordersql=`select * from order_product where order_id= $1`
  const result=((await client.query(ordersql,[OrderId.id])).rows)
  return result
}

exports.getMyOrderProducts=catchAsync(async (req,res,next)=>{
  const orderProducts=await this.myOrderProducts(req.client,req.user.id,req.params.id)
  console.log(orderProducts);
  res.status(200).json({
  status:'success',
  orderProducts
  })
})

exports.updateOrder=
  catchAsync(async (req,res,next)=>{
    const id=req.body.order.id
    const status=req.body.orderStatus
    const {client}=req
    console.log(status,req.body.order.payment_intent_id,id);
    //console.log(params,value);
    const sql=`update  orders set status = ('${status}'), payment_intent_id= ($1)   where id = $2 returning *`
    const results=(await client.query(sql,[req.body.order.payment_intent_id,id])).rows[0]
    await client.query('COMMIT')
    req.body.order=results
    res.status(200).json({
    status:'success',
    messege:"refunded"
    })
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