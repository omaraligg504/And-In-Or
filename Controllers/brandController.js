const AppError = require("../Utils/appError");
const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const multer=require('multer')
const sharp=require('sharp')
exports.addbrand=catchAsync(async (req,res,next)=>{
    const {client}=req; 
    const {name,description,providerId}=req.body;
    //console.log(name,description);
    const validation= handlerFactory.missing('brand ',[{name:'name',value:name},{name:'description',value:description},{name:'provider id',value:providerId}])
    if(validation.length!==0){return next(new AppError(validation,401))}
    const sql=`insert into brand  (name ,description,provider_id ) values($1,$2) returning id`;
    const brand=(await client.query(sql,[name,description,providerId])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    brand
    })
})

const multerStorage=multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadBrandPhoto=upload.single('photo')

exports.resizeBrandPhoto=catchAsync (async (req,res,next)=>{
  if(!req.file)return next(new AppError('there is not any photo uploaded',300));
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`Public/img/brands/${req.file.filename}`)
  const {client}=req;
  const sql=`Update brands set photo=$1 where brand.id=$2` 
  await client.query(sql,[req.file.filename,req.params.id])
  await client.query('COMMIT')
  res.status(200).json({
  stauts:'success',
  messege:'photo updated successfully'
  })
})  


exports.getOneBrand=handlerFactory.getOne('brand');
exports.getAllBrand=handlerFactory.getAll('brand')
exports.deleteoneBrand=handlerFactory.deleteOne('brand');
exports.updateOneBrand=handlerFactory.updateOne('brand');
exports.updateAllBrand=handlerFactory.updateAll('brand');