const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const getallusers = async (req, res, next) => {
    try {
        const getUser = await User.find();
        if (getUser) {
            res.status(200).json(getUser)
        } else {
            res.status(400).send({ success: false, msg: "User is not exists" })
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
}

const getusersbyid = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id)
        const finduser = await User.findById(id)
        console.log(finduser)
        if (finduser) {
            res.status(200).json(finduser)
        } else {
            res.status(400).send({ success: false, msg: "user doesn't exists" })
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
}

const deleteuser = async(req,res,next) =>{
    try {
        const id = req.params.id;
        console.log(id)
        const userdelete = await User.findByIdAndDelete(id)
        console.log(userdelete)
        if(userdelete){
            res.status(200).json({message:"User deleted successfully"})
        }else{
            res.status(400).send({ success: false, msg: "User is not available in this id" })     
        }
        
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })     
    }
}

const updateuser = async(req,res,next) =>{
    try {
        const id = req.params.id;
        console.log(id)
        const updateUser = await User.findByIdAndUpdate(id, {$set:(req.body)},{new:true})
        if(updateUser){
            res.status(400).send({ success: true, msg: "User data updated scuuessfully",data:updateUser })           

        }else{
            res.status(400).send({ success: false, msg: "User is not find in this id" })           
        }        
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })           
    }

}

module.exports = {
    getallusers,
    getusersbyid,
    deleteuser,
    updateuser
}





