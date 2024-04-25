const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const AppError=require('./../Utils/appError')
exports.addpromotion = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into promotion  (name ,description,discount_rate,start_date,end_date,code) values($1,$2,$3,$4,$5,$6) returning id`;
  const {name ,description,discount_rate,start_date,end_date,code}=req.body
  const validation= handlerFactory.missing('promotion ',[{name:'name',value:name},{name:'discount rate',value:discount_rate},{name:'start date',value:start_date},{name:"end date" ,value:end_date},{name:"code",value:code}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const promotion = (await client.query(sql, [name ,description,discount_rate,start_date,end_date,code]))
    .rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    promotion,
  });
});


exports.addProductPromotion=catchAsync(async (req,res,next)=>{
  const {client}=req; 
   const sql=`insert into product_promotion (product_id,promotion_id) values($1,$2)`;
   
  
   const {productId,promotionId}=req.body

   const validation= handlerFactory.missing('product promotion ',[{name:'product id',value:productId},{name:'promotion id',value:promotionId}])
   if(validation.length!==0){return next(new AppError(validation,401))}
  const productPromotion=(await client.query(sql,[productId,promotionId])).rows[0]
  res.status(200).json({
  status:'success',
    productPromotion
  })
})

exports.getPromotion=handlerFactory.getOne('promotion');
exports.getAllPromotion=handlerFactory.getAll('promotion')
exports.deletePromotion=handlerFactory.deleteOne('promotion');
exports.updatePromotion=handlerFactory.updateOne('promotion');
exports.updateAllPromotion=handlerFactory.updateAll('promotion');
exports.getProductPromotion=handlerFactory.getOne('product_promotion');
exports.getAllProductPromotion=handlerFactory.getAll('product_promotion')
exports.deleteProductPromotion=handlerFactory.deleteOne('product_promotion');
exports.updateProductPromotion=handlerFactory.updateOne('product_promotion');
exports.updateAllProductPromotion=handlerFactory.updateAll('product_promotion');