const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const orderController=require('.//orderController')
const stripe=require('stripe')(process.env.STRIPE_API_KEY)
// exports.addpaymentMethod = catchAsync(async (req, res, next) => {
//   const { client } = req;
//   const sql = `insert into payment_type  (name ) values($1) returning id`;
//   const {name}=req.body
//   const validation= handlerFactory.missing('payment method ',[{name:'name',value:name}])
//     if(validation.length!==0){return next(new AppError(validation,401))}
//   const payment_method = (await client.query(sql, [name]))
//     .rows[0];
//   await client.query("COMMIT");
//   res.status(200).json({
//     status: "success",
//     payment_method
//   });
// });


exports.stripePayment=catchAsync(async (req,res,next)=>{

  const {currency,token,amount,shipping_method_id,order_date}=req.body
  // const {amount}=req.shopOrder
  const {email,userName}=req.user
  console.log(email);
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      token
    },
  });
  const paymentIntent=await stripe.paymentIntents.create({
    amount:amount*100,
    currency,
//payment_method_types:['pm_card_visa'],
    payment_method:paymentMethod.id,
    confirmation_method:'automatic',
    confirm:true,
    receipt_email:email,
    description:'Payment for product',
  //   customer:{name:userName,
  // }
  return_url:'https://www.youtube.com/'
  })
  console.log(paymentIntent.status);
  req.body.order_date=order_date;
  req.body.shipping_method_id=shipping_method_id;
  req.body.order_total=amount;
  req.body.entity='status'
  req.body.orderStatus=paymentIntent.status
  next();
})







// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   // 1) Get the currently booked tour
  

//   // 2) Create checkout session
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
//       req.params.tourId
//     }&user=${req.user.id}&price=${tour.price}`,
//     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//     customer_email: req.user.email,
//     client_reference_id: req.params.tourId,
//     line_items: [
//       {
//         name: `${tour.name} Tour`,
//         description: tour.summary,
//         images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
//         amount: tour.price * 100,
//         currency: 'usd',
//         quantity: 1
//       }
//     ]
//   });

//   // 3) Create session as response
//   res.status(200).json({
//     status: 'success',
//     session
//   });
// });

// exports.addUserPaymentMethod=catchAsync(async (req,res,next)=>{
//   const {client}=req; 
//    const sql=`insert into user_payment_method (user_id,payment_type_id,provider,account_number,expiry_date,is_default ) values($1,$2,$3,$4,$5,$6)`;
//    const {payment_type_id,provider,account_number,expiry_date,is_default }=req.body
//    const validation= handlerFactory.missing('users payment method ',[{name:'payment type id',value:payment_type_id},{name:'user id',value :req.user.id},{name:'provider',value:provider},{name : 'account number',value:account_number},{name:' is default or not indicato',value:is_default}])
//      if(validation.length!==0){return next(new AppError(validation,401))}
 
//    const user_payment_method =(await client.query(sql,[req.user.id,payment_type_id,provider,account_number,expiry_date,is_default ])).rows[0]
//   await client.query('COMMIT')
//   res.status(200).json({
//   status:'success',
//     user_payment_method
//   })
// })
// exports.getUsersPaymentMethod=handlerFactory.getOneForOne('user_payment_method','users','payment_method')
// exports.deleteUsersPaymentMethod=handlerFactory.deleteOneForOne('user_payment_method','users','payment_method')
// exports.updateUsersPaymentMethod=handlerFactory.updateOneForOne('user_payment_method','users','payment_method')
// exports.getOnePaymentMethod=handlerFactory.getMyOne('user_payment_method')
// exports.deleteMyPaymentMethod=handlerFactory.deleteMyOne('user_payment_method')
// exports.updateMyPaymentMethod=handlerFactory.updateMyOne('user_payment_method')
// exports.getOnePaymentMethod=handlerFactory.getOne('payment_method');
// exports.getAllPaymentMethod=handlerFactory.getAll('payment_method')
// exports.deleteonePaymentMethod=handlerFactory.deleteOne('payment_method');
// exports.updateOnePaymentMethod=handlerFactory.updateOne('payment_method');
// exports.updateAllPaymentMethod=handlerFactory.updateAll('payment_method');