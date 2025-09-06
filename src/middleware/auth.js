const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const userAuth = async (req, res, next) => {
  try{
    const cookie = req.cookies;
    const {token} = cookie;
    if(!token){
      throw new Error("Unauthorized");
    }
    const decoded = jwt.verify(token, "secretKey");
    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  }
  catch(err){
    res.status(400).send("Error: " + err);
  }
}

module.exports = { userAuth };