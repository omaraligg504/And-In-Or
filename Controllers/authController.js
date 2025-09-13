const { promisify } = require("util");
const passwordValidator = require("password-validator");
const handerFactory=require('./handlerFactory')
const userController=require('./userController')
const { phone } = require("phone");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("./../Utils/catchAsync");
const crypto = require("crypto");
const AppError = require("../Utils/appError");
const signToken = function (id) {
  console.log(id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode,req, res,next,path) => {
  //console.log(user.rows[0].id);

  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //console.log(user);
  //console.log(token);
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  req.body.user=user;
  req.body.token=token ;
  req.user=user;
  console.log(user,token);
  if (!path){res.status(200).json({
  status:'success',
    data:{user,
    },
    token
  })}
  else next();
};
const checkPassword = (password) => {
  const schema = new passwordValidator();
  schema.is().min(8).has().uppercase().has().lowercase().has().digits().has();
  //.symbols();

  const validationResult = schema.validate(password, { list: true });

  const errorMessages = [];

  if (validationResult.includes("min")) {
    errorMessages.push(" must be at least 8 characters long");
  }

  if (validationResult.includes("uppercase")) {
    errorMessages.push(" must contain at least one uppercase letter");
  }

  if (validationResult.includes("lowercase")) {
    errorMessages.push(" must contain at least one lowercase letter");
  }

  if (validationResult.includes("digits")) {
    errorMessages.push(" must contain at least one digit");
  }

  if (validationResult.includes("symbols")) {
    errorMessages.push(" must contain at least one symbol");
  }
  if (errorMessages.length !== 0)
    return "Password " + errorMessages.join(" and ") + ".";
  return null;
};
const checkPhonenumber = (phonenumber) => {
  const formattedPhoneNumber = phone(phonenumber, { country: "EGY" });
  const result = {
    isValid: false,
    phoneNumber: null,
    countryIso2: null,
    countryIso3: null,
    countryCode: null,
    error: null,
  };

  if (formattedPhoneNumber.length > 0) {
    result.isValid = true;
    result.phoneNumber = formattedPhoneNumber[0];
    result.countryIso2 = formattedPhoneNumber[1];
    result.countryIso3 = formattedPhoneNumber[2];
    result.countryCode = formattedPhoneNumber[3];
  } else {
    result.error = "Invalid phone number";
  }

  return result;
};
const checkCredintials = (phonenumber, password, email, confirmpassword) => {
  if (confirmpassword !== password) {
    return "The password entered doesn't match the confirm password";
  }

  const passwordValidationError = checkPassword(password);
  if (passwordValidationError) {
    return passwordValidationError;
  }
  // if (!checkPhonenumber(phonenumber).isValid) {
  //   return "Invalid phone number please enter valid phone number";
  // }
  if (!validator.isEmail(email)) {
    return "please enter a valid email";
  }
  return null;
};
exports.signup = catchAsync(async (req, res, next) => {
  const { username, phonenumber, email, password, confirmpassword, role } =
    req.body;
  const { client } = req;

  const valid = checkCredintials(phonenumber, password, email, confirmpassword);
  if (valid) {
    return next(new AppError(valid, 401));
  }
  if(role=='admin'){
    return next(new AppError('Cannot signup as admin from the begging u must sign up as user then ask for being admin',401))
    }
  const passwordHash = await bcrypt.hash(password, 12);

  // Execute the INSERT query
  const sqlInsert = `
    INSERT INTO users (email, password,  role, phonenumber, username)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, phonenumber, username, email, role;
  `;
  const newUser = await client.query(sqlInsert, [
    email,
    passwordHash,
    role,
    phonenumber,
    username,
  ]);
  //console.log(newUser);
  // Commit the transaction
  //await client.query("COMMIT");

  //console.log(newUser.rows[0]); // Log the inserted user

  // Send response with token
  createSendToken(newUser.rows[0], 201, req,res,next,1);
});
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  req.user=undefined
  req.token=undefined
  res.status(200).header('x-clear-jwt', 'true').json({ status: "success" });
};

exports.login = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("enter Password and email", 400));
  }
  const { client } = req;
  //console.log(email,password);
  const sql = `SELECT id ,username , password , phonenumber,email , role  from users where email=$1 ;`;
  const result = await client.query(sql, [email]);
  const user = result.rows[0];
  //console.log(user.password,user.email);

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Ivalid password or email", 401));
  }

  createSendToken(user, 201, req,res,next);
});
const correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
exports.protected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log(req.headers.authorization);
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.cookie) {
    token = req.headers.cookie;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  if (token.startsWith("jwt")) {
    token = token.split("jwt=")[1];
  }
  const { client } = req;
  //console.log(token, process.env.JWT_SECRET);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //console.log(decoded);
  const sql = `select * from users where id =$1`;
  const currentUser = (await client.query(sql, [decoded.id])).rows[0];

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  if (changePasswordAt(currentUser.passwordchangeat, decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
exports.isLoggedIn = async (req, res, next) => {
  if (req.headers.cookie) {
    try {
      let token = req.headers.cookie;
      //console.log(req.headers.cookie);
      token = token.split("jwt=")[1];
      const { client } = req;
      //console.log(token, process.env.JWT_SECRET);
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      //console.log(decoded);
      const sql = `select * from users where id =$1`;
      const user = await client.query(sql, [decoded.id]);
      //console.log(currentUser);
      const currentUser = user.rows[0];
      if (!currentUser) {
        return next();
      }
      //    if(currentUser.changePasswordAt(decoded.iat)){
      //        return next()
      //    }
      res.locals.user = currentUser;
      //console.log(res.locals.user);
      return next();
    } catch (err) {
      console.log(err);
      next();
    }
  }
  next();
};
exports.restrictedto = function (...role) {
  return (req, res, next) => {
    console.log(role,req.user.role);
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
exports.isadmin = catchAsync(async (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== "admin") {
    return next(
      new AppError(
        "You do not have the permission to perform this action ",
        403
      )
    );
  }
  next();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const sql = `SELECT id, email, password from users where users.email=$1`;
  const { client } = req;
  const user = (await client.query(sql, [req.user.email])).rows[0];
  if (!user) {
    return next(new AppError("There is no user with email addresse.", 404));
  }
  const resetToken = createPasswordResetToken(user);
  const updatesql =
    "UPDATE users set passwordresettoken=$1 ,passwordresetexpires=$2 where users.id=$3";
  await client.query(updatesql, [
    user.passwordresettoken,
    user.passwordresetexpires,
    user.id,
  ]);
  await client.query("COMMIT");
  res.status(200).json({
    status: "success",
    user,
    resetToken,
  });
});
const createPasswordResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordresettoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordresettoken = passwordresettoken;
  user.passwordresetexpires = Date.now() + 60 * 10 * 1000;
  console.log(resetToken, passwordresettoken);
  return resetToken;
};
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const { client } = req;
  const currentDate = new Date();

  const previousDate = new Date(currentDate.getTime() - 1000);
  const timestamp = previousDate.toISOString();
  console.log(hashedtoken);
  const sql =
    "select * from users where passwordresettoken=$1 and passwordresetexpires > $2 ";
  const user = (await client.query(sql, [req.params.token, Date.now()])).rows[0];
  if (!user) {
    return next(new AppError("Invalid or expired token", 400));
  }
  //console.log(user.passwordresetexpires,Date.now());
  const validation = checkPassword(req.body.newpassword);
  if (validation) {
    return next(new AppError(validation, 401));
  }
  const passwordHash = await bcrypt.hash(req.body.newpassword, 12);
  console.log(timestamp);
  const updatesql = `UPDATE users set password =$1, passwordresettoken=NULL ,passwordchangeat=$2, passwordresetexpires=NULL where users.id=$3`;
  await client.query(updatesql, [passwordHash, timestamp, user.id]);
  await client.query("COMMIT");
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    user,
  });
});
const changePasswordAt = function (passwordchangeat, JWTTimestamp) {
  if (passwordchangeat) {
    return parseInt(passwordchangeat.getTime() / 1000, 10) > JWTTimestamp;
  }
  return false;
};
exports.updateMyPassword = catchAsync(async function (req, res, next) {
  const { client } = req;
  const newPassword=req.body.newPassword
  const confirmPassword=req.body.confirmPassword
  if(newPassword!==confirmPassword){
    return next(new AppError("The password entered doesn't match the confirm password",401));
  }
  const validation = checkPassword(newPassword);
  if (validation) {
    return next(new AppError(validation, 401));
  }
  console.log(req.user.id);
  const user =( await client.query(
    `SELECT password,id FROM users WHERE users.id=${req.user.id}`
  )).rows[0];
  
  //console.log(user);
  // 2) Check if POSTed current password is correct
  if (!(await correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  const passwordHash = await bcrypt.hash(req.body.newPassword, 12);

  // 3) If so, update password
  user.password = passwordHash;
  console.log(passwordHash);
  await client.query(
    `UPDATE users set password = ('${passwordHash}')  WHERE users.id=${user.id}`
  );
  await client.query("COMMIT");
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req,res,next);
});

exports.updateMyEmail=catchAsync(async (req,res,next)=>{
  const newEmail=req.body.newEmail
  if (!validator.isEmail(newEmail)) {
    return next(new AppError("please enter a valid email",404));
  }
  const {client}=req; 
   const sql=`UPDATE users set email = $1  WHERE users.id=$2`;
  const updateEmail=(await client.query(sql,[newEmail,req.user.id])).rows[0]
  await client.query('COMMIT')
  res.status(200).json({
  status:'success',
  messege:"email updated successfully"
  })
})


