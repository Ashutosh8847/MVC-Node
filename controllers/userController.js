const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// TO Generate the secure password
const securePassword = async (password) => {
    try {
        const passwordHassed = await bcrypt.hash(password, saltRounds);
        console.log("hassedpassword", passwordHassed)
        return passwordHassed;
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" })
    }
}
// to generate the Auth JWT Token
const createtoken = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, process.env.JWT_SECREAT, { expiresIn: "10h" })
        return token;
    } catch (error) {
        console.log("****", error)
        res.status(400).json({ message: "Token is invalid or incorrect" })
    }
}

const registeruser = async (req, res, next) => {
    try {
        const { password, Cpassword } = req.body
        console.log("password", password)
        console.log("Cpassword", Cpassword)

        const spassword = await securePassword(req.body.password)
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: spassword,
            mobile: req.body.mobile,
            image: req.file.filename
        })
        const usersaved = await User.findOne({ email: req.body.email })
        try {
            if (password !== Cpassword) {
                res.status(401).json({ message: "Password and confirm password didn't match" })
            }
            else if (usersaved) {
                res.status(200).json({ message: "Email already exist in database" })
            }
            else {
                const saveduser = await newUser.save()
                res.status(200).json(saveduser)
            }

        } catch (error) {
            console.log("**error**", error)
            res.status(500).json({ message: "Internal Server Error" })

        }
    } catch (error) {
        console.log("Error", error)
        res.status(400).send({ success: false, msg: error.message })
    }
}

const loginuser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const userdata = await User.findOne({ email })
        console.log("*****", userdata)
        if (userdata) {
            const passwordmatch = await bcrypt.compare(password, userdata.password)
            console.log("***p**", password)
            console.log("***pm***", userdata.password)
            if (passwordmatch) {
                const tokenData = await createtoken(userdata._id)
                const userresult = {
                    _id: userdata._id,
                    name: userdata.name,
                    email: userdata.email,
                    image: userdata.image,
                    mobile: userdata.mobile,
                    createdAt: userdata.createdAt,
                    updatedAt: userdata.updatedAt,
                    __v: userdata.__v,
                    token: tokenData
                }
                const response = {
                    success: true,
                    msg: "User Details",
                    data: userresult
                }
                res.status(200).json(response)
            } else {
                res.status(404).json({ message: "password is not matched" })
            }
        } else {
            res.status(404).json({ message: "Email is no register in the db" })
        }
    } catch (error) {
        console.log("**error**", error)
        res.status(400).send({ success: false, msg: error.message })
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const user_id = req.body.user_id
        console.log("UserID", user_id)
        const password = req.body.password
        console.log("***pasword get from body***", password)
        if (user_id === "" || user_id.length < 24) {
            res.status(404).json({ message: "Invalid user id " })
        }
        const userID = await User.findOne({ _id: user_id })
        console.log("***find the user id in DB", userID)
        if (userID) {
            const newPassword = await securePassword(password)
            console.log("***newPaswword***", newPassword)
            const usernewpassword = await User.findByIdAndUpdate({ _id: user_id }, {
                $set: {
                    password: newPassword,
                }
            },
                { new: true })
            console.log("**usernewpassword**", usernewpassword)

            if (usernewpassword) {
                res.status(200).json({ message: "User password updated successfully" })
            } else {
                res.status(400).json({ message: "User password is not updated" })

            }
        } else {
            res.status(404).json({ message: "User is not found in DB" })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, msg: error.message })

    }
}

// For Forgot password 
const nodemailer = require("nodemailer");
const randomstring = require('randomstring')
const sendResetPasswordmail = (req, res, name, email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "ashutosh@smartbots.ai",
            pass: "dzzu shsk xxpr iqao",
        },
    });

    const mailoption = {
        from: 'ashutosh@smartbots.ai',
        to: email,
        subject: 'Password Reset',
        html: `<h2>Password Reset</h2><p>Hello ${name},</p><p>We received a request to reset your password. Click the link below to reset your password:</p><a href="http://localhost:4500/api/auth/reset-password?token=${token}">http://localhost:4500/api/auth/reset-password?token=${token}</a><p>If you did not request a password reset, you can ignore this email.</p><p>Thanks,<br>Your Application Team</p>`   
    }
    console.log("****mail body****", mailoption)
    transporter.sendMail(mailoption, function (info, error) {
        if (!err) {
            console.log("mail has been sent to", info.response)
        } else {
            console.log("Err", error);
        }
    })
}
const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        console.log("**email**", email)
        const saveuser = await User.findOne({ email: email })
        if (saveuser) {
            const randomString = randomstring.generate()
            const data = await User.updateOne({ email: email }, { $set: { token: randomString } })
            console.log("***data***", data)
            if (data) {
                sendResetPasswordmail(req, res, saveuser.name, saveuser.email, randomString);
                res.status(200).send(`Email sent successfully to ${saveuser.name}`)
            } else {
                res.status(401).send("Email send is failed due to some error")
            }

        } else {
            res.status(404).json({ message: "This Email id is not in DB" })
        }
    } catch (error) {
        console.log("Error", error)
        res.status(400).send({ success: false, msg: error.message })
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const token = req.query.token;
        const tokendata = await User.findOne({ token: token })
        if (tokendata) {
            const password = req.body.password
            const newpassword = await securePassword(password)
            const newdata = await User.findByIdAndUpdate({ _id: tokendata._id }, { $set: { password: newpassword, token: '' } }, { new: true })
            console.log("***newData***", newdata)
            res.status(200).send({ success: true, msg: "Password reset successfully", data: newdata })

        } else {
            res.status(400).send({ success: false, msg: "Link is Expired" })
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })

    }
}
module.exports = {
    registeruser,
    loginuser,
    updatePassword,
    forgotPassword,
    resetPassword
}