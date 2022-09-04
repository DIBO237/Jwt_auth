const mongoose = require('mongoose')

const User = mongoose.Schema({

   username:{
    type: String,
    required: true
   },
   password:{
    type:String,
    required:true
   },
   created_At: {
    type: Date,
    required: true,
    default: Date.now
   }

})

module.exports = mongoose.model('User',User)