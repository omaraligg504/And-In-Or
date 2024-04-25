const catchAsync = require("./../Utils/catchAsync");
const handleFactory=require('./handlerFactory')
exports.addattributeType=catchAsync(async (req,res,next)=>{
    const {client}=req; 
     const sql=`insert into attribute_type  (name) values($1) returning id`;
    const attribute_type=(await client.query(sql,[req.body.name])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    attribute_type
    })
})

exports.addattributeOption=catchAsync(async (req,res,next)=>{
    const {client}=req; 
     const sql=`insert into attribute_option  (attribute_type_id,name) values($1,$2) returning id`;
    const attribute_option=(await client.query(sql,[req.body.addattribute_type_id,req.body.name])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    attribute_option
    })
})

exports.getOneAttributeType=handleFactory.getOne('attribute_type');
exports.getAllAttributeType=handleFactory.getAll('attribute_type');
exports.getAllAttributeOption=handleFactory.getAll('attribute_option');
exports.getOneAttributeOption=handleFactory.getOne('attribute_option');
exports.deleteOneAttributeType=handleFactory.deleteOne('attribute_type')
exports.deleteOneAttributeOption=handleFactory.deleteOne('attribute_option')
exports.updateOneAttributeType=handleFactory.updateOne('attribute_type');
exports.updateOneAttributeOption=handleFactory.updateOne('attribute_option');
exports.updateAllAttributeOption=handleFactory.updateAll('attribute_type');
exports.updateAllAttributeType=handleFactory.updateAll('attribute_option');
