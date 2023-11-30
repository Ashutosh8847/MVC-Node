const express = require('express')
const updateuser_route = express.Router();
const multer = require('multer');
const path = require('path')
const auth = require('../middleware/auth')
const updateuserController  = require('../controllers/updateuserControllers')

// Get all user's in db
updateuser_route.get('/allusers',updateuserController.getallusers)

// Get user's by  their id
updateuser_route.get('/getusers/:id',auth,updateuserController.getusersbyid)

// Delete user by their id:
updateuser_route.delete('/delete/:id',auth,updateuserController.deleteuser)

// Update the user data through put method
updateuser_route.put('/updateuser/:id',auth,updateuserController.updateuser)








module.exports = updateuser_route;