const mongoose = require('mongoose')
require('dotenv').config()
 const info = new mongoose.Schema({
 user:{
       type:mongoose.Schema.Types.ObjectId
     },
title:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},
thumbnail:{
  type:String,
  required:true,
},
platforms:{
    type:String,
    required:true
}
 },{
    versionKey: false,
    timestamps: true 
 })
 let infoSchema = mongoose.model(process.env.DETAILS,info)
 module.exports = infoSchema