const AppError = require('../Utils/appError');
const catchAsync=require('../Utils/catchAsync')
const orderController=require('./orderController')
exports.afterPayment=catchAsync(async (req,res,next)=>{
    //console.log(req.body.orderStatus);
    const {client}=req
    console.log(req.body.orderStatus);
    if(req.body.orderStatus==='succeeded'){
        //const {client}=req; 
        const sql=`SELECT update_stock_for_order($1)`;
       const result=(await client.query(sql,[req.body.order.id])).rows[0]
        await update_sales(client,req.user.id,req.body.order.id)
       await client.query('COMMIT')

       res.status(200).json({
       status:'success',
       messege:'successfully purchased',
       result,
       order:req.body.order
       })
    }
    else if(req.body.orderStatus==='failed'||req.body.orderStatus==='cancelled'||req.body.orderStatus==='refunded'){
        if(req.body.orderStatus!=='failed')await client.query('select update_product_sales($1)',[req.body.order.id])      
        res.status(200).json({
        status:req.body.orderStatus,
        messege:'order '+req.body.orderStatus
        })
    }
    else if(req.body.orderStatus==='processing'||req.body.orderStatus==='pending'){
        // if(req.body.orderStatus==='refunded')await client.query('select update_product_sales($1)',[req.body.order.id])      

        res.status(200).json({
        status:'processing',
        messege:'order in process'
        })
    }
})

const update_sales=async (client,user_id,id)=>{
    
    try{
       // console.log(id);
    await client.query('select update_product_sales($1)',[Number(id)])

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
