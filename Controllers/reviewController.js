const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const AppError=require('./../Utils/appError')
exports.addReview = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into reviews  (rating_value,comment,user_id,order_id,product_id) values($1,$2,$3,$4,$5) returning id`;
  const { rating_value, comment, shop_order_id ,product_id} = req.body;
  const validation= handlerFactory.missing('review ',[{name:'user id',value:req.user.id},{name:'product id',value:product_id}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const review = (
    await client.query(sql, [rating_value, comment, req.user.id, shop_order_id,product_id])
  ).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    review,
  });
});
exports.getProductsReviews=catchAsync(async (req,res,next)=>{
  const productId=req.params.id
  const {client}=req; 
   const sql=`select * from reviews where product_id=$1`;
  const review=(await client.query(sql,[productId])).rows[0]
  res.status(200).json({
  status:'success',
    review
  })
})
exports.deleteProductsReviews=catchAsync(async (req,res,next)=>{
  const productId=req.params.id
  const {client}=req; 
   const sql=`delete from reviews where product_id=$1`;
  const review=(await client.query(sql,[productId])).rows[0]
  res.status(200).json({
  status:'success',
    review
  })
})



exports.getmyreviews=handlerFactory.getMyOne('reviews');
exports.deletemyreview= 
catchAsync(async (req,res,next)=>{
  const id=req.user.id
  const sid=req.params.id
  const {client}=req
  const sql=  `delete  from reviews where user_id = $1 and product_id =$2 `
  const results=(await client.query(sql,[id,sid])).rows[0]
  res.status(200).json({
    status: "success",
    results
  });
})  
exports.deleteallmyreview=handlerFactory.deleteAllMy('reviews');
exports.updatemyreview=catchAsync(async (req,res,next)=>{
  const id=req.user.id
  const product_id=req.params.id
  const params=req.body.entity
  const value=req.body.value
  const {client}=req
  const sql=`update  reviews set $1 = $2  where user_id = $3 and product_id=$4`
  
  const results=(await client.query(sql,[params,value,id,product_id])).rows[0]
  res.status(200).json({
    status: "success",
    results
  });
})

exports.getOneReview=handlerFactory.getOne('reviews');
exports.getAllReview=handlerFactory.getAll('reviews')
exports.deleteoneReview=handlerFactory.deleteOne('reviews');
exports.updateOneReview=handlerFactory.updateOne('reviews');
