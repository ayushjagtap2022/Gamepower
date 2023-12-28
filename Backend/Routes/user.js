const express = require('express')
const genHash = require('../services/generateHash')
const {compare} = require('bcryptjs')
const Router = express.Router()
const tokenGen = require('../services/token')
const userSchema = require('../mongoose/User/userScehma')
const { users_Mid, validate_Registration , checkEmail} = require('../Middleware/userMiddleware');
const sendMail = require('../services/mail')
Router.use(express.json())
Router.get('/getallusers', users_Mid, async (req, res) => {
      let userData = await userSchema.find();
      res.status(200).send(userData)
})
Router.post('/createuser', validate_Registration,checkEmail, async (req, res) => {
      try {
            let result = await userSchema.findOne({ email: req.body.email })
            if (!result || (req.body.email != result.email)) {
                  sendMail(req.body.email)  
                  let passwordHash = genHash(req.body.password)
                  let userDetails = new userSchema({
                        name: req.body.name,
                        email: req.body.email,
                        password: passwordHash,
                  });
                  userDetails.save().then((user) => {
                        
                        tokenGen(res, user._id).then((token)=>{
                              res.status(201).send({ token, name: user.name, send: user.email });
                        })
                  }).catch((err) => {
                        res.send({ Error: err })
                  });
            }
            else {
                  res.status(400).send({ Error: "Email already exist" })
            }
      } catch (error) {
            res.status(500).send({ Error: `Internal server Error ${error}` });
      }
});
Router.get('/loginuser', async (req, res) => {
      try {
            let loginquery = await userSchema.findOne({ email: req.body.email })
            if (loginquery) {
                  compare(req.body.password, loginquery.password, (err, result) => {
                        if (result) {
                              let generatedToken = tokenGen(res, loginquery._id)
                              generatedToken.then((token) => {
                                    res.send({ Message: "Successfully Login", token })
                              })
                        } else {
                              res.status(400).json({ message: 'Invalid credentials' });
                        }
                  });
            } else {
                  res.status(400).send({ Error: "Wrong Credentials" })
            }
      } catch (error) {
            res.status(500).send({ Error: `Internal server Error ${error}` })
      }
})
Router.delete('/deleteuser/:_id', users_Mid, async (req, res) => {
      try {
            let deleteuser_query = await userSchema.findByIdAndDelete(req.params._id.trim())
            if (!deleteuser_query) {
                  res.status(400).send({ Error: "User not found" });
            } else {
                  res.status(200).send(deleteuser_query)
            }
      } catch (error) {
            res.status(500).send({ Error: "Internal Server Error" })
      }
})
Router.put('/updatebyadmin/:_id', users_Mid, validate_Registration, async (req, res) => {
      try {
         let compareHash = genHash(req.body.password)
            const update = { email: req.body.email, password: compareHash };
            let updatedUser = await userSchema.findByIdAndUpdate(
                  req.params._id.trim(),
                  update,
                  { new: true }
            );
            if (updatedUser) {
                  res.status(200).send(updatedUser);
            } else {
                  res.status(400).send({ error: 'User not found' });
            }
      } catch (err) {
            res.status(500).send(err);
      }
});

module.exports = Router;