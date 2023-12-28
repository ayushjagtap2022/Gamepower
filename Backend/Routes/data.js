const express = require('express');
const { users_Mid } = require('../Middleware/userMiddleware');
const infoSchema = require('../mongoose/Information/infoSchema');
const Router = express.Router();
Router.use(express.json());
Router.get('/specificdetails',users_Mid,async (req,res) => {
 try{
    let userId = req.userData.payload.user._id;
    let findDetails = await infoSchema.find({user:userId})
    if(!findDetails){
        res.send(400).send({Error:"Result not found"})
    }else{
        res.send(findDetails)
    }
 }catch(err){
    res.status(500).send({ Error: err+"lol"});
 }
})
Router.post('/savedetails', users_Mid, async (req, res) => {
  try {
    let userId = req.userData.payload.user._id;
    const requiredFields = ['title', 'description', 'thumbnail', 'platforms'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({ Error: `Missing required field: ${field}` });
      }
    }
    const infoSave = new infoSchema({
      user: userId,
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      platforms: req.body.platforms,
    });
    await infoSave.save().then((result)=>{
        res.status(201).send(result);
    });
} catch (error) {
    res.status(500).send({ Error: error.message });
  }
});
Router.delete('/deletedetails/:_id', users_Mid, async (req, res) => {
    try {
          let deletedetail_query = await infoSchema.findByIdAndDelete(req.params._id.trim())
          if (!deletedetail_query) {
                res.status(400).send({ Error: "User not found" });
          } else {
                res.status(200).send(deletedetail_query)
          }
    } catch (error) {
          res.status(500).send({ Error: "Internal Server Error" })
    }
})
module.exports = Router;
