const handlerFactory=require('./handlerFactory')
const catchAsync = require("./../Utils/catchAsync");
const { missing } = require("./handlerFactory");
const sharp=require('sharp')

const multer=require('multer');
const AppError = require('../Utils/appError');

// exports.createOneUser = catchAsync(async (req, res, next) => {
  //   const {email,password,confirmpassword,photo,role,phonenumber} = req.body;
  //   const { client } = req;
  //   //console.log(client);
  //   const sql = `INSERT INTO users (email, password, confirmpassword, photo, role, phonenumber) VALUES ($1, $2, $3, $4, $5, $6)`;
  //   await client.query(sql, [
//     email,
//     password,
//     confirmpassword,
//     photo,
//     role,
//     phonenumber,
//   ]);
//   await client.query("COMMIT");
//   res.status(200).json({
  //     status: "success",
  //   });
  // });
  
  exports.getAllUsers=handlerFactory.getAll('users')
  // exports.getAllUsers = catchAsync(async (req, res, next) => {
  //   const { client } = req;
  //   const results = await client.query(`select * from users`);
  //   res.status(200).json({
  //     status: "success",
  //     results:results.rows[0],
  //   });
  // });
  exports.makeAdmin = catchAsync(async (req, res, next) => {
  const {client}=req;
  const sql=` update users set role = 'admin' where users.id= $1`;
  const user = await client.query(sql,[req.params.id]);
  await client.query('COMMIT')
  res.status(200).json({
    status: "success",
    user
  });
});
exports.addAddress=catchAsync(async (req,res,next)=>{
  const {city,unitnumber,streetnumber,addressline1,addressline2,country,region,postalcode}=req.body;
  const valid=missing('address ',[{name:'city',value:city},{name:"unitnumber",value:unitnumber},{name:'streetnumber',value:streetnumber},{name:'country',value:country},{name:'region',value:region},{name:'postalcode',value:postalcode}])
  if(valid){
    return next(new AppError(valid,401))
  }
  const {client}=req
  const insertSql='insert into address (city,unitnumber,streetnumber,addressline1,addressline2,country,region,postalcode) values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *'
  const address=(await client.query(insertSql,[city,unitnumber,streetnumber,addressline1,addressline2,country,region,postalcode])).rows[0]
  const updatesql='Update users set addressid =$1 where users.id=$2 RETURNING addressid'
  const useraddress=(await client.query(updatesql,[address.id,req.user.id])).rows[0]
  await client.query('COMMIT')
  res.status(200).json({
    status:'success',
    address,
    useraddress
  })
})
exports.getOneUser = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `select * from users where id =$1`;
  const user = await client.query(sql, [req.params.id]);
  const userValues = {};
  user.fields.forEach((field) => {
    userValues[field.name] = user.rows[0][field.name];
  });
  res.status(200).json({
    status: "success",
    user: userValues,
  });
});

exports.deleteOneUser = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = "DELETE FROM users where id =$1";
  await client.query(sql, [req.params.id]);
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    messege:'account deleted'
  });
});
exports.getMe=catchAsync(async (req,res,next)=>{
  res.status(200).json({
    status:'success',
    user:req.user
  })
})

exports.deleteMe=catchAsync(async (req,res,next)=>{
  const {client}=req;
  const sql=`Update users set active=$1 where users.id=$2` 
  await client.query(sql,[false,req.user.id])
  await client.query('COMMIT')
  res.status(200).json({
    status:'success',
    messege:'Account deleted'
  })
})
exports.updateMyUserName=catchAsync(async (req,res,next)=>{
  const {client}=req;
  const sql=`Update users set username=$1 where users.id=$2` 
  await client.query(sql,[req.body.username,req.user.id])
  await client.query('COMMIT')
  res.status(200).json({
    status:'success',
    messege:'user name updated'
  })
})
exports.updateMyPhonenumber=catchAsync(async (req,res,next)=>{
  const {client}=req;
  const sql=`Update users set phonenumber=$1 where users.id=$2` 
  await client.query(sql,[phonenumber,req.user.id])
  await client.query('COMMIT')
  res.status(200).json({
    status:'success',
    messege:'phone number updated successfully'
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
exports.uploadUserPhoto=upload.single('photo')

exports.resizeUserPhoto=catchAsync (async (req,res,next)=>{
  if(!req.file)return next(new AppError('there is not any photo uploaded',300));
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`Public/img/users/${req.file.filename}`)
  const {client}=req;
  const sql=`Update users set photo=$1 where users.id=$2` 
  await client.query(sql,[req.file.filename,req.user.id])
  await client.query('COMMIT')
  res.status(200).json({
  stauts:'success',
  messege:'photo updated successfully'
  })
})  


exports.deleteOneAddress=handlerFactory.deleteOne('address')
// exports.getOneUserPaymentMethod=handlerFactory.getOne('user_payment_method');
// exports.getAllUserPaymentMethod=handlerFactory.getAll('user_payment_method')
// exports.deleteoneUserPaymentMethod=handlerFactory.deleteOne('user_payment_method');
// exports.updateOneUserPaymentMethod=handlerFactory.updateOne('user_payment_method');
// exports.updateAllUserPaymentMethod=handlerFactory.updateAll('user_payment_method');

//jdbc:postgresql://localhos:5432/Amazondb