const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const db = require("../model");
const { getToken } = require("../middleware/auth");
const {Snowflake} = require("@theinternetfolks/snowflake");


function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

const signIn = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {}
  };
  const {email,password} = req.body;
  if(!email || !password){
    resp.content.data = {message: "All fields are neccessary."};
    res.status(400).json(resp);return;
  }
  var user = await db.users.findOne({where:{email:email}});
  if(!user){
    resp.content.data = {message: `User with email ${email} doesnot exists.`};
    res.status(400).json(resp);return;
  }
  user = user.dataValues;
  if(!(await bcrypt.compare(password,user.password))){
    resp.content.data = {message: "Either password or email is wrong."};
    res.status(400).json(resp);return;
  }
  const accesstoken = getToken(user);
  resp.status = true;
  resp.content.data = {message:"SignIn Successful."}
  resp.content.accesstoken = accesstoken;
  res.status(200).json(resp);
  return;
});

const signUp = asyncHandler(async(req,res)=>{
  const {name,email,password} = req.body;
  const resp = {
    status: true,
    content: {
      data: {}
    }
  }
  if(!name || !email || !password){
    resp.status = false;
    resp.content.data.message = "All fields are neccesary.";
    res.status(400).json(resp);
    return;
  }
  if(!isValidEmail(email)){
    resp.status = false;
    resp.content.data.message = "Email is not valid.";
    res.status(400).json(resp);
    return;
  }
  if(!isStrongPassword(password)){
    resp.status = false;
    resp.content.data.message = `${password} is not as strong password.`;
    res.status(400).json(resp);
    return;
  }
  const check = await db.users.findOne({where:{email:email}});
  if(check){
    resp.status = false;
    resp.content.data.message = `User already exists with email ${email}.`;
    res.status(400).json(resp)
    return;
  }
  // req.body.id = Snowflake.generate();
  let salt = process.env.SALT;
  salt = Number(salt);
  const hashPassword = await bcrypt.hash(password,salt);
  // console.log(req.body);
  const user = await db.users.create({
    id: Snowflake.generate(),
    name: name,
    email: email,
    password: hashPassword
  });
  const accesstoken = getToken(user.dataValues);
  resp.content.data = {
    id: user.dataValues.id,
    name: user.dataValues.name,
    email: user.dataValues.email,
    created_at: user.dataValues.createdAt 
  }
  resp.content.accesstoken = accesstoken;
  //   }
  // };
  res.status(200).json(resp);
});

module.exports = {
  signIn,
  signUp
}