const mongoose = require('mongoose');
 require('dotenv').config()
  let User =new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },email:{
   type:String,
   required:true,
   unique:true,
   trim: true
   },password:{
    type:String,
    required:true,
    trim: true
   }
},{
    versionKey: false,
    timestamps: true
})
   module.exports = mongoose.model(process.env.USERCOLLECTION,User)