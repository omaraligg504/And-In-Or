const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const sharp=require('sharp')
const multer=require('multer');
const AppError = require("../Utils/appError");
exports.addProductCategory = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into product_category (name, image,description,size_category_id,parent_category_id) values ($1,$2,$3,$4,$5) Returning *`;
  const { name, image, description, size_category, parent_category_id } =
    req.body;
    const validation= handlerFactory.missing('product category ',[{name:'name',value:name}])
    if(validation.length!==0){return next(new AppError(validation,401))}
  const productCategory = (
    await client.query(sql, [
      name,
      image,
      description,
      size_category,
      parent_category_id,
    ])
  ).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    productCategory,
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into product (name,product_description,model_height,model_wearing,care_instructions,about,product_category_id,brand_id) values ($1,$2,$3,$4,$5,$6,$7,$8)`;
  const {
    name,
    product_description,
    model_height,
    model_wearing,
    care_instruction,
    about,
    product_category_id,
    brand_id,
  } = req.body;
  const validation= handlerFactory.missing('product ',[{name:'name',value:name},{name:'product description',value:product_description},{name:'product category',value:product_category_id},{name:'about',value:about},{name:'brand',value:brand_id}])
  if(validation.length!==0){return next(new AppError(validation,401))}
  const product = (
    await client.query(sql, [
      name,
      product_description,
      model_height,
      model_wearing,
      care_instruction,
      about,
      product_category_id,
      brand_id,
    ])
  ).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    product,
  });
});
exports.addProductItem = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into product_item (product_id,color_id,original_price,code,sale_price) values($1,$2,$3,$4,$5)`;
  const { product_id, color_id, original_price, code, sale_price } = req.body;
  const validation= handlerFactory.missing('product item ',[{name:'product id',value:product_id},{name:'original price',value:original_price},{name:'code',value:code}])
  if(validation.length!==0){return next(new AppError(validation,401))}
  const productItem = (
    await client.query(sql, [
      product_id,
      color_id,
      original_price,
      code,
      sale_price,
    ])
  ).rows[0];
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    productItem,
  });
});
exports.addProductVariation = catchAsync(async (req, res, next) => {
  const { client } = req;
  const sql = `insert into product_variation (product_item_id ,size_id,quantity_in_stock) values($1,$2,$3)`;
  const { product_item, size_id, quantity_in_stock } = req.body;
  const validation= handlerFactory.missing('product variation ',[{name:'product item',value:product_item},{name:'quantity in stock',value:quantity_in_stock}])
  if(validation.length!==0){return next(new AppError(validation,401))}
  const product_variation = (
    await client.query(sql, [product_item, size_id, quantity_in_stock])
  ).rows[0];
  await client.query('COMMIT')
  res.status(200).json({
    status: "success",
    product_variation,
  });
});
exports.addRealtedProducts=catchAsync(async (req,res,next)=>{
  const {client}=req; 
  const {product_id,related_product_id}=req.body
   const sql=`insert into related_products (product_id,related_product_id) values($1,$2)`;
  const relation=(await client.query(sql,[product_id,related_product_id])).rows[0]
  res.status(200).json({
  status:'success',
  relation
  })
})
exports.getRelatedProducts=catchAsync(async (req,res,next)=>{
  const {client}=req; 
   const sql=`SELECT DISTINCT p.*
   FROM products p
   LEFT JOIN related_products rp1 ON p.id = rp1.related_product_id
   LEFT JOIN related_products rp2 ON p.id = rp2.product_id
   WHERE rp1.product_id = $1 OR rp2.related_product_id = $1;
   `;
   const product_id=req.params.id
  const related=(await client.query(sql,[product_id])).rows[0]
  res.status(200).json({
  status:'success',
  related
  })
})
exports.addProductImage=catchAsync(async (req,res,next)=>{
    const {client}=req; 
     const sql=`insert into product_image (product_item_id,image_filename) values($1,$2)`;
     const validation= handlerFactory.missing('product image ',[{name:'product_id',value:req.user.product_item_id},{name:'image file name',value:req.body.image_filename}])
     if(validation.length!==0){return next(new AppError(validation,401))}
    const image=(await client.query(sql,[req.body.product_item_id,req.body.image_filename])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    image
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
exports.uploadProductItemPhoto=upload.array('images',6)
exports.resizeProductPhoto=catchAsync (async (req,res,next)=>{
  console.log(req.files.length);
  if(!req.files)return next(new AppError('there is not any photo uploaded',300));
  if(req.files.length>5)return next(new AppError('you can upload 5 images only for product item'))

  const {client}=req;
  await Promise.all(req.files.map(async(element,i) => {
  
    const filename=`productItem-${req.params.id}-${Date.now()}-${i+1}.jpeg`
    await sharp(element.buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`Public/img/products/${filename}`)
    //req.file.filename=filename 
    const {client}=req; 
    const sql=`insert into product_image (product_item_id,image_filename) values($1,$2)`;
    // const validation= handlerFactory.missing('product image ',[{name:'product_id',value:req.user.product_item_id},{name:'image file name',value:req.body.image_filename}])
    //if(validation.length!==0){return next(new AppError(validation,401))}
   const image=(await client.query(sql,[req.params.id,filename])).rows[0]
  }))
  await client.query('COMMIT')
  res.status(200).json({
  stauts:'success',
  messege:'photos updated successfully'
  })
})  
//sadklasd

exports.addProductAttribute=catchAsync(async (req,res,next)=>{
    const {client}=req; 
    const validation= handlerFactory.missing('product attribute ',[{name:'product item',value:req.body.product_id},{name:'attribute option',value:req.body.attribute_option}])
    if(validation.length!==0){return next(new AppError(validation,401))}
     const sql=`insert into product_attribute (product_id,attribute_option) values($1,$2)`;
    const product_attribute=(await client.query(sql,[req.body.product_id,req.body.attribute_option])).rows[0]
    await client.query('COMMIT')
    res.status(200).json({
    status:'success',
    product_attribute
    })
})

exports.getProductBoughtTogether=catchAsync(async (req,res,next)=>{
  //const{product_1,product_2}=req.params
  const {client}=req; 
   const sql=`SELECT 
   CASE 
       WHEN product_id_1 = :$1 THEN product_id_2
       ELSE product_id_1 
   END AS bought_with_product,
   count
FROM 
   bought_together
WHERE 
   product_id_1 = :$1 OR product_id_2 = :product_id
ORDER BY 
   count DESC;


   `;
  const result=(await client.query(sql,[req.params.product_id])).rows[0]
  res.status(200).json({
  status:'success',
  result
  })
})
exports.getOneProductCategory=handlerFactory.getOne('product_category');
exports.getAllProductCategory=handlerFactory.getAll('product_category')
exports.deleteoneProductCategory=handlerFactory.deleteOne('product_category');
exports.deleteProductRelation=handlerFactory.deleteOne('related_products');
exports.updateOneProductCategory=handlerFactory.updateOne('product_category');
exports.updateAllProductCategory=handlerFactory.updateAll('product_category');
exports.getOneProduct=handlerFactory.getOne('product');
exports.getAllProduct=handlerFactory.getAll('product')
exports.deleteoneProduct=handlerFactory.deleteOne('product');
exports.updateOneProduct=handlerFactory.updateOne('product');
exports.updateAllProduct=handlerFactory.updateAll('product');
exports.getOneProductpromtion=handlerFactory.getOne('product_promtion');
exports.getAllProductpromtion=handlerFactory.getAll('product_promtion')
exports.deleteoneProductpromtion=handlerFactory.deleteOne('product_promtion');
exports.updateOneProductpromtion=handlerFactory.updateOne('product_promtion');
exports.updateAllProductpromtion=handlerFactory.updateAll('product_promtion');
exports.getOneProductItem=handlerFactory.getOne('product_item');
exports.getAllProductItem=handlerFactory.getAll('product_item')
exports.deleteoneProductItem=handlerFactory.deleteOne('product_item');
exports.updateOneProductItem=handlerFactory.updateOne('product_item');
exports.updateAllProductItem=handlerFactory.updateAll('product_item');
exports.getOneProductAttribute=handlerFactory.getOne('product_attribute');
exports.getAllProductAttribute=handlerFactory.getAll('product_attribute')
exports.deleteoneProductAttribute=handlerFactory.deleteOne('product_attribute');
exports.updateOneProductAttribute=handlerFactory.updateOne('product_attribute');
exports.updateAllProductAttribute=handlerFactory.updateAll('product_attribute');
exports.getOneProductVariation=handlerFactory.getOne('product_variation');
exports.getAllProductVariation=handlerFactory.getAll('product_variation')
exports.deleteoneProductVariation=handlerFactory.deleteOne('product_variation');
exports.updateOneProductVariation=handlerFactory.updateOne('product_variation');
exports.updateAllProductVariation=handlerFactory.updateAll('product_variation');
exports.getOneProductImage=handlerFactory.getOne('product_image');
exports.getAllProductImage=handlerFactory.getAll('product_image')
exports.deleteoneProductImage=handlerFactory.deleteOne('product_image');
exports.updateOneProductImage=handlerFactory.updateOne('product_image');
exports.updateAllProductImage=handlerFactory.updateAll('product_image');