
var jwt = require("jsonwebtoken");
var _ = require("lodash");
// FOR JWT TOKE SECURED MIDDLEWARE
const {success_response,failed_response} = require ("./helpers")

const auth = (req,res,next)=>{
    // CHECK AUTH TOKEN IN HEADER
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (_.isEmpty(token)) return res.status(400).json(failed_response(400,"token is missing or expired",false));
  
    // VERIFY TOKEN AND RETURN USER
    jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
      console.log(err)
      if (err !== null) {
        res.status(400).json(failed_response(400,"You must login first",false));
      }
      req.user = user.email
      next()
    })

}


module.exports = auth;