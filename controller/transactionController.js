const { Snowflake } = require("@theinternetfolks/snowflake");
const db = require("../model");
const asyncHandler = require("express-async-handler");

const createTransaction = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {}
  };
  const user = req.user;
  const {type,amount} = req.body;
  if(!type || !amount){
    resp.content.data = {message: "All fields are neccessary."};
    res.status(400).json(resp);return;
  }
  const checkType = await db.type.findOne({where:{id:type}});
  if(!checkType){
    resp.content.data = {message: `Type with the name ${type} doesnot exists.`};
    res.status(400).json(resp);return;
  }
  if(isNaN(amount)){
    resp.content.data = {message: `Enter correct amount in numbers.`};
    res.status(400).json(resp);return;
  }
  const transaction = (await db.transactions.create({
    id: Snowflake.generate(),
    user: user.id,
    type: type,
    amount: Number(amount)
  })).dataValues;
  if(!transaction){
    resp.content.data = {message: "Internal server error try again."};
    res.status(500).json(resp);return;
  }
  resp.status = true;
  resp.content.data = transaction;
  res.status(200).json(resp);
  return;
});

const getTransactions = asyncHandler(async(req,res)=>{
  const user = req.user;
  const resp = {
    status: true,
    content: {}
  };
  const checkUser = await db.users.findOne({where:{id:user.id}});
  if(!checkUser){
    resp.status = false;
    resp.content.data = {message: `Invalid User.`};
    res.status(400).json(res);return;
  }
  const transactions = await db.transactions.findAll({where:{user:user.id}});
  resp.content.data = transactions;
  res.status(200).json(resp);
});

const getSummary = asyncHandler(async(req,res)=>{
  const user = req.user;
  const resp = {
    status: true,
    content: {}
  };
  const checkUser = await db.users.findOne({where:{id:user.id}});
  if(!checkUser){
    resp.status = false;
    resp.content.data = {message: `Invalid User.`};
    res.status(400).json(res);return;
  }
  var data = []
  const types = await db.type.findAll();
  for(var type of types){
    type = type.dataValues;
    const total = await db.transactions.sum('amount',{where:{type:type.id,user:user.id}});
    const total_typeId = {
      type: type.name,
      total: total
    }
    data.push(total_typeId);
  }
  data.push({
    type: "Savings",
    total: data[0].total - data[1].total
  })
  resp.content.data = data;
  res.status(200).json(resp);
  return;
});

const deleteTrasaction = asyncHandler(async(req,res)=>{
  const user = req.user;
  const {id} = req.params;
  const resp = {
    status: false,
    content: {}
  };
  const checkUser = await db.users.findOne({where:{id:user.id}});
  if(!checkUser){
    resp.content.data = {message: `Invalid User.`};
    res.status(400).json(resp);return;
  }
  var checkTrasaction = await db.transactions.findOne({where:{id:id}});
  if(!checkTrasaction){
    resp.content.data = {message: `Transaction with id ${id} doesnot exists.`};
    res.status(400).json(resp);return;
  }
  checkTrasaction = checkTrasaction.dataValues;
  if(user.id != checkTrasaction.user){
    resp.content.data = {message: `Users can only modify their transactions.`};
    res.status(400).json(resp);return;
  }
  await db.transactions.destroy({where:{id:id}})
    .then(()=>{
      resp.status = true;
      resp.content.data = {message:"Deletion successful."};
      res.status(200).json(resp);
      return;
    })
    .catch((err)=>{
      resp.content.data = {Error: err};
      res.status(500).json(resp);
      return;
    })
});

module.exports = {
  createTransaction,
  getTransactions,
  getSummary,
  deleteTrasaction
}