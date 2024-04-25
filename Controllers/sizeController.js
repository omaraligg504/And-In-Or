const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')

exports.addSizeCategory = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into size_category (name) values ($1) RETURNING id `;
  const validation= handlerFactory.missing('size category ',[{name:'name',value:req.body.size_category_name}])
  if(validation.length!==0){return next(new AppError(validation,401))}
  const size_category = (await client.query(sql, [req.body.size_category_name]))
    .rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    stauts: "success",
    messege: "inserted",
    size_category,
  });
});


exports.addsize=catchAsync(async (req,res,next)=>{
    const {client}=req; 
    const sizesql=`select id from size_category where name = $1`
    const size_category=(await client.query(sizesql,[req.body.size_category_id])).rows[0]
    const validation= handlerFactory.missing('size ',[{name:'name',value:req.body.name},{name:'sorting order',value:req.body.sort_order},{name :'size category',value:size_category}])
    if(validation.length!==0){return next(new AppError(validation,401))}
     const sql=`insert into size  (name , sort_order,size_category_id) values($1,$2,$3) returning id`;
    const size=(await client.query(sql,[req.body.name,req.body.sort_order,size_category.id])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    size
    })
})


exports.getOneSizeCategory=handlerFactory.getOne('size_category');
exports.getAllSizeCategory=handlerFactory.getAll('size_category')
exports.deleteoneSizeCategory=handlerFactory.deleteOne('size_category');
exports.updateOneSizeCategory=handlerFactory.updateOne('size_category');
exports.updateAllSizeCategory=handlerFactory.updateAll('size_category');
exports.getOneSize=handlerFactory.getOne('size');
exports.getAllSize=handlerFactory.getAll('size')
exports.deleteoneSize=handlerFactory.deleteOne('size');
exports.updateOneSize=handlerFactory.updateOne('size');
exports.updateAllSize=handlerFactory.updateAll('size');