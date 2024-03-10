const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const resp = {
  status: false,
  content: {}
}
const getToken = (user) => {
  const token = jwt.sign(user,secretKey,{expiresIn:'15m'});
  if(!token){
    resp.content.data = {message: "Token cannot be created."}
    res.status(500).json(resp);
    return;
  }
  return token;
}

const authenticateToken = (req,res,next) => {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split(' ')[1];
  if(!token){
    resp.content.data = {message: "Token is not found."};
    res.status(400).json(resp);
    return;
  }
  jwt.verify(token,secretKey,function(err,user){
    if(err){
      resp.content.data = {message:"Token is not valid"}
      res.status(401).json(resp);
      return;
    }
    else{
      req.user = user;
      next();
    }
  });
}

module.exports = {
  getToken,
  authenticateToken
}