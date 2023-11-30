const express = require('express')
const user_route = express.Router();
// const bodyparser = require('body-parser')
// user_route.use(bodyparser.json())
const multer = require('multer');
const path = require('path')
user_route.use(express.static('public'))
const auth = require('../middleware/auth')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the destination directory for uploaded files
      cb(null, path.join(__dirname,'../public/userImages'),function(success,err){
        if(err){
            console.log("error",err)
        }
      });
    },
    filename: function (req, file, cb) {
      // Specify how the file should be named
      const name = Date.now() + "-" + file.originalname
      cb(null, name,function(success,err){
        if(err){
            console.log("***error***",err)
        }
      });
    },
  });
  // Create a Multer instance with the storage configuration
  const upload = multer({ storage: storage });

  const userController  = require('../controllers/userController')
  // for user register puprpose
  user_route.post('/register',upload.single('image'),userController.registeruser)
  // for login purpose
  user_route.post('/login',userController.loginuser)
  // for update-password purpose
  user_route.post('/update-password',auth,userController.updatePassword)
  // For forgot-password 
  user_route.post('/forgot-password',userController.forgotPassword)
  // Reset the password
  user_route.get('/reset-password',userController.resetPassword)




  module.exports = user_route;