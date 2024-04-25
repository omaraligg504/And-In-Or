const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const AppError=require('./../Utils/appError')
exports.addSale = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into promotion  (name ,description,discount_rate,start_date,end_date) values($1,$2,$3,$4,$5) returning id`;
  const {name ,description,discount_rate,start_date,end_date}=req.body
  const validation= handlerFactory.missing('promotion ',[{name:'name',value:name},{name:'discount rate',value:discount_rate},{name:'start date',value:start_date},{name:"end date" ,value:end_date}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const sale = (await client.query(sql, [name ,description,discount_rate,start_date,end_date]))
    .rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    sale,
  });
});


exports.addProductCategorySale=catchAsync(async (req,res,next)=>{
  const {client}=req; 
   const sql=`insert into product_categories_sales (product_category_id,sale_id) values($1,$2)`;
   
  
   const {productCategoryId,saleId}=req.body

   const validation= handlerFactory.missing('product promotion ',[{name:'product category id',value:productCategoryId},{name:'sale id',value:saleId}])
   if(validation.length!==0){return next(new AppError(validation,401))}
  const productCategorySale=(await client.query(sql,[productCategoryId,saleId])).rows[0]
  res.status(200).json({
  status:'success',
    productCategorySale
  })
})

exports.getSale=handlerFactory.getOne('sales');
exports.getAllSales=handlerFactory.getAll('sales')
exports.deleteSale=handlerFactory.deleteOne('sales');
exports.updateSale=handlerFactory.updateOne('sales');
exports.updateAllSales=handlerFactory.updateAll('sales');
exports.getProductCategorySale=handlerFactory.getOne('product_categories_sales');
exports.getAllProductCategorySales=handlerFactory.getAll('product_categories_sales')
exports.deleteProductCategorySale=handlerFactory.deleteOne('product_categories_sales');
exports.updateProductCategorySale=handlerFactory.updateOne('product_categories_sales');
exports.updateAllProductCategorySales=handlerFactory.updateAll('product_categories_sales');