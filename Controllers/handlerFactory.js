const catchAsync = require("./../Utils/catchAsync");
const pool = require("./../db");
// exports.getAll = model =>
//   catchAsync(async (req, res, next) => {
//     const {client}=req
//     const results =(await client.query(`select * from ${model}`)).rows[0];
//     res.send(200).json({
//       status: "success",
//       results
//     });
//   });
  exports.getAll= (model)=>catchAsync(async (req, res, next) => {
    const {client}=req
     const sql=`select * from ${model}`;
     console.log(model);
    const results=(await client.query(sql)).rows
    res.status(200).json({
      status: "success",
      results
    });
  });
exports.createOne=(model,params)=>
    catchAsync( async (req,res,next)=>{
      const {client}=req
      const results=await client.query(`insert into ${model} (${[...params]})`)
      res.status(200).json({
        status: "success",
        results
      });
    })

exports.getOne=model=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const {client}=req
    const sql=`select * from ${model} where id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    res.status(200).json({
      status: "success",
      results
    });
  })
  exports.getMyOne=model=>
  catchAsync(async (req,res,next)=>{
    const id=req.user.id
    const {client}=req
    const sql=`select * from ${model} where user_id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    res.status(200).json({
      status: "success",
      results
    });
  })


exports.deleteOne=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const {client}=req
    const sql=`delete  from ${model} where id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
      status: "success",
      results
    });
  })
  exports.deleteOneForOne=(model,first,second)=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const sid=req.params.sid
    const {client}=req
    const sql=`delete  from ${model} where ${first}_id = $1 and ${second}_id = $2 `
    const results=(await client.query(sql,[id,sid])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
      status: "success",
      results
    });
  })  
  exports.getOneForOne=(model,first,second)=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const sid=req.params.sid
    const {client}=req
    const sql=`select *  from ${model} where ${first}_id = $1 and ${second}_id =$2 `
    const results=(await client.query(sql,[id,sid])).rows[0]
    res.status(200).json({
      status: "success",
      results
    });
  })
exports.deleteMyOne=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.user.id
    const {client}=req
    const sql=`delete  from ${model} where user_id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
      status: "success",
      results
    });
  })
exports.deleteAllMy=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.user.id
    const {client}=req
    const sql=`delete  from ${model} where user_id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
      status: "success",
      results
    });
  })


exports.updateOne=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const params=req.body.entity
    const value=req.body.value
    const {client}=req
    console.log(params,value);
    const sql=`update  ${model} set ${params} = '${value}'  where id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
      status: "success",
      results
    });
  })
  exports.updateOneForOne=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const params=req.body.entity
    const value=req.body.value
    const {client}=req
    const sid=req.params.sid
    const sql=`update  ${model} set ${params} = '${value}'  where id = ${first}_id = $1 and ${second}_id =$2`
    const results=(await client.query(sql,[id,sid])).rows[0]
    res.status(200).json({
      status: "success",
      results
    });
  })
exports.updateMyOne=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.user.id
    const params=req.body.entity
    const value=req.body.value
    const {client}=req  
    const sql=`update  ${model} set ${params} = '${value}'  where user_id = $1`
    const results=(await client.query(sql,[id])).rows[0]
    res.status(200).json({
      status: "success",
      results
    });
  })


exports.updateAll=(model)=>
  catchAsync(async (req,res,next)=>{
    const id=req.params.id
    const params=req.body.entity
    const value=req.body.value
    const {client}=req
    const sql=`update  ${model} set ${params} = '${value}'`
    const results=(await client.query(sql)).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
      status: "success",
      results
    });
  })


exports.missing=(model, creditials)=>{

  const errorMessages = [];
  creditials.forEach(element => {
    //console.log(element);
    if(!element.value){
      errorMessages.push(`must has ${element.name}`)
    }
  });
  if (errorMessages.length !== 0)
    return model + errorMessages.join(" and ") + ".";
  return '';
}

