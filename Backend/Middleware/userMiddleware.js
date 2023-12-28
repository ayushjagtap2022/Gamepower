const JWT = require('jsonwebtoken')
const axios = require('axios');
require('dotenv').config()
const { body, validationResult } = require('express-validator');

const validate_Registration = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  },
];

const users_Mid = (req,res,next) =>{
     let auth = req.headers['authorization']
     let token = auth.split(" ")[1]
     JWT.verify(token,process.env.PRIVATE_KEY,(err,decode)=>{
         if(err){
            res.status(401).send("Unauthorized User")
         }else{
           req.userData = decode
           next()
         }
     })
}
const checkEmail = async (req,res,next) =>{
  const options = {
    method: 'GET',
    url: 'https://validect-email-verification-v1.p.rapidapi.com/v1/verify',
    params: {
      email: req.body.email
    },
    headers: {
      'X-RapidAPI-Key': process.env.CHECK_EMAIL_APIKEY,
      'X-RapidAPI-Host': process.env.RAPID_API_HOST
    }
  };
  
  try {
    const response = await axios.request(options);
     if(response.data.status=='invalid'){
      res.status(401).send({Error:"Enter a valid Email"})
     }else{
      next()
     }
  } catch (error) {
    res.status(500).send({Error:error});
  }
  
}
module.exports = { users_Mid, validate_Registration , checkEmail};
