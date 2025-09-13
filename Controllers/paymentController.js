const catchAsync = require("./../Utils/catchAsync");
const handlerFactory=require('./handlerFactory')
const orderController=require('.//orderController');
const { result } = require("lodash");
const AppError = require("../Utils/appError");
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

exports.cancelOrRefund=catchAsync(async (req,res,next)=>{
  const {order}=req.body
  //console.log(order);
  const{ payment_intent_id}=order
  const paymentIntent= await stripe.paymentIntents.retrieve(payment_intent_id);
  let result;
  if (paymentIntent.status === 'succeeded'||order.status==='delivered'||order.status==='shipped') {
    // Payment was successful, initiate a refund if needed
    const refund = await stripe.refunds.create({
      payment_intent: payment_intent_id,
      amount: order.order_total, // Amount in cents (if partial refund)
    });
    result=refund
    req.body.orderStatus='refunded'
  } else if(paymentIntent.status === 'requires_capture'||order.status==='pending'||order.status=='processing'){
    // Payment is pending, cancel the PaymentIntent
    
    const canceledPaymentIntent = await stripe.paymentIntents.cancel(paymentIntent.id);
    result=canceledPaymentIntent
    req.body.orderStatus='cancelled'

  } 
  if(!result){
    next(new AppError('the order transaction is already failed',302))
  }
  next();
})

exports.stripePayment=catchAsync(async (req,res,next)=>{

  const {currency,token,totalPrice,shipping_method_id,order_date}=req.body
  // const {amount}=req.shopOrder
  const {email,userName}=req.user
  //console.log(email);
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      token
    },
  });
  const paymentIntent=await stripe.paymentIntents.create({
    amount:totalPrice*100,
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
  //console.log(paymentIntent.id,paymentIntent);
  req.body.entity='status'
  //req.body.paymentIntentId=paymentIntent.id
//  req.body.chargeId=1
  req.body.order.payment_intent_id=paymentIntent.id
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