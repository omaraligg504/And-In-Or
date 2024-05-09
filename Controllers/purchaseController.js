const AppError = require('../Utils/appError');
const catchAsync=require('../Utils/catchAsync')
const orderController=require('./orderController')
exports.afterPayment=catchAsync(async (req,res,next)=>{
    //console.log(req.body.orderStatus);
    if(req.body.orderStatus==='succeeded'){
        const {client}=req; 
        const sql=`SELECT update_stock_for_order($1)`;
        //console.log(req.body.order);
       const result=(await client.query(sql,[req.body.order.id])).rows[0]
        await increaseSales(client,req.user.id,req.body.order.id)
       await client.query('COMMIT')
       res.status(200).json({
       status:'success',
       messege:'successfully purchased',
       result,
       order:req.body.order
       })
    }
    else if(req.body.orderStatus==='failed'||req.body.orderStatus==='cancelled'){
        res.status(200).json({
        status:'failed',
        messege:'order failed'
        })
    }
    else if(req.body.orderStatus==='processing'||req.body.orderStatus==='pending'){
        res.status(200).json({
        status:'processing',
        messege:'order in process'
        })
    }
})
const increaseSales=async (client,user_id,id)=>{
    
    try{const orderProducts=await orderController.myOrderProducts(client,user_id,id);
    const  productIds=new Map()
    //console.log(orderProducts);
    for (const x of orderProducts){
        
         const sql=`select product_id from product_item where id=$1`;
        //console.log(x.product_item_id);
        const productIDs=(await client.query(sql,[x.product_item_id])).rows[0]
        //productIds.add(productIDs.product_id)
        if(productIds.has(productIDs.product_id))
            productIds.set(productIDs.product_id,productIds.get(productIDs.product_id)+x.quantity)
        else productIds.set(productIDs.product_id,x.quantity)
        //console.log('product_id '+productIDs.product_id)
    }
    //console.log(productIds);
    for( const  [x,val] of productIds){
        //const {client}=req; 
        console.log(x);
         const sql=`update product set sold =(sold+$1) where id=$2 returning sold`;
        const result=(await client.query(sql,[val,x])).rows[0]
        //console.log(result);
    }
    await client.query('COMMIT')
}catch(err){
        throw new AppError(err,302);
    }
}
exports.checkStock=catchAsync(async (req,res,next)=>{
    try{const {client}=req; 
     const sql=`select check_stock($1);`;
    //console.log('here '+req.body.order.id);
    const check=(await client.query(sql,[req.body.order.id])).rows[0].check_stock
    next();   }
    catch(err){
        req.orderStatus='failed'
        orderController.updateOrder(req,res,next);
        next(new AppError(err,302))
    }
})