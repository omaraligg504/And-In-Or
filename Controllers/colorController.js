const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')

exports.addcolor = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into color  (name ,code ) values($1,$2) returning id`;
  const {name,code}=req.body
  const validation= handlerFactory.missing('color ',[{name:'name',value:name}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const color = (await client.query(sql, [name, code]))
    .rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    color,
  });
});


exports.getOneColor=handlerFactory.getOne('color');
exports.getAllColor=handlerFactory.getAll('color')
exports.deleteoneColor=handlerFactory.deleteOne('color');
exports.updateOneColor=handlerFactory.updateOne('color');
exports.updateAllColor=handlerFactory.updateAll('color');