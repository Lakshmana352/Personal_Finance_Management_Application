const asyncHandler = require("express-async-handler");
const db = require("../model");
const {Snowflake} = require("@theinternetfolks/snowflake");

const createType = asyncHandler(async(req,res)=>{
  const resp = {
    status:false,
    content:{}
  };
  const {name} = req.body;
  if(!name){
    resp.content.data = {message:"Name of the type is neccessary."};
    res.status(400).json(resp);
    return;
  }
  const checkType = await db.type.findOne({where:{name:name}});
  if(checkType){
    resp.content.data = {message:`Type with name ${name} already exists.`};
    res.status(400).json(resp);
    return;
  }
  const type = (await db.type.create({
    id: Snowflake.generate(),
    name: name
  })).dataValues;
  resp.content.data = type;
  resp.status = true;
  res.status(200).json(resp);
});

const getTypes = asyncHandler(async(req,res)=>{
  const types = await db.type.findAll();
  const resp = {
    status:true,
    content:{
      data: types
    }
  };
  res.status(200).json(resp);
})

module.exports = {
  createType,
  getTypes
}