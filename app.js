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
const db = require("./db")
const User = require("./models/user")





require('dotenv').config()



console.log(process.env.PRIVATE_KEY)


// FUNCTIONS
app.use(cors());
app.use(express.json());



// INITIAL ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    msg: "server is working",
  });
});

// SIGN UP

app.post("/signin", async(req,res)=>{

  let username = req.body.username;
  let password = req.body.password;

  // CHECK VALIDATION
  if (_.isEmpty(username)) {
    res.status(400).json({
      status: false,
      message: "Please enter an Email ",
    });
  }
  if (_.isEmpty(password)) {
    res.status(400).json({
      status: false,
      message: "Please enter a password",
    });
  }

   // ENCRYPT PASSWORD
   let cryptPass = await encryptPAss(password)
  
   // USER OBJECT HERE 
  const new_user = {
     username:username,
     password:cryptPass
  }

  // CREATE NEW USER 
   
  const user = new User(new_user)
  try {
    const newUser = await user.save()
    res.status(201).json({
      status: true,
      message: "User added successfully with id:"+newUser.id
    })
  } catch (err) {
    res.status(400).json({
      status: false, message: err.message
    })
  }

})






// LOGIN ROUTE
app.post("/login", async (req, res) => {
  console.log(req.body);

  // GET CRETEDENTIALS

  let email = req.body.username;
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

  // CHECK IF THE USER EXIST 
  let users = ""
  try {
    const user = await User.findOne({email:email})
    console.log(user)
    if (user.length == 0){
      res.status(400).json(failed_response(400,"username is worng or user dosen't exists",false));
    }


    users = user
  } catch (err) {
    res.status(400).json(failed_response(400,err.message,false));
  }
   

  // CHECHK PASS VALIDATION FROM DATABASE
   if(!checkpass(password,users.password)){
     res.status(400).json(failed_response(400,"You have entered wrong passsword",false));
   }
  
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
