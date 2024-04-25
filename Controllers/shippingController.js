const catchAsync = require("../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')

exports.addShipingMethod = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into shipping_method  (name ,price ) values($1,$2) returning id`;
  const {name,price}=req.body
  const validation= handlerFactory.missing('shipping method ',[{name:'name',value:name},{name:'price',value:price}])
  if(validation.length!==0){return next(new AppError(validation,401))}
  const shipping_method = (await client.query(sql, [name, price]))
    .rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    shipping_method
  });
});

// exports.getUsersShippingMethod=handlerFactory.getOneForOne('shipping_method')
exports.getOneShippingMethod=handlerFactory.getOne('shipping_method');
exports.getAllShippingMethod=handlerFactory.getAll('shipping_method')
exports.deleteoneShippingMethod=handlerFactory.deleteOne('shipping_method');
exports.updateOneShippingMethod=handlerFactory.updateOne('shipping_method');
exports.updateAllShippingMethod=handlerFactory.updateAll('shipping_method');