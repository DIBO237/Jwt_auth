const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
var _ = require("lodash");
var jwt = require("jsonwebtoken");
var cors = require("cors");
const auth = require("./auth");
const help = require ("./helpers")
const {success_response,failed_response} = require ("./helpers")
const encryptPAss = help.hasPass
const checkpass = help.checkPass

require('dotenv').config()



console.log(process.env.PRIVATE_KEY)


// FUNCTIONS
app.use(cors());
app.use(express.json());

user = {
  email: "dibya.dey@gmail.com",
  password: "9830",
};

// INITIAL ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    name: "dibya",
  });
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  console.log(req.body);

  // GET CRETEDENTIALS

  let email = req.body.email;
  let password = req.body.password;

  // CHECK VALIDATION
  if (_.isEmpty(email)) {
    res.status(400).json({
      status: false,
      message: "no email id ",
    });
  }
  if (_.isEmpty(password)) {
    res.status(400).json({
      status: false,
      message: "no password",
    });
  }
   
   // ENCRYPT PASSS
   const row = await encryptPAss(password)
  console.log("pass:",row)

  // CHECHK PASS VALID
  console.log(checkpass("98923",row))
  
  // JWT LOGIN TOKEN GENERATION
  try {
    jwt.sign(
        { email },
        process.env.PRIVATE_KEY,
        { expiresIn: "1h" },
        function (err, token) {
          
          if (!_.isEmpty(token)) {
           
            res.status(200).json(success_response(200,"logged successfully",{ token:token },true));
          }
    
          if (err !== null) {
            res.status(400).json(failed_response(400,err.message,false));
          }
        }
      );

  }
  catch(err){
    res.status(400).json(failed_response(400,err.message,false));
  }
  
});




app.post("/userdetails",auth, (req, res) => {
    res.status(200).json(success_response(200,"logged successfully",{ user:req.user },true));
});

// SERVER ON

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
