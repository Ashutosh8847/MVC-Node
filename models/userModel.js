const mongoose = require('mongoose')
const {Schema} = mongoose;

const user = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    token:{
        type:String,
        default:""
    }

},
{timestamps:true}
)

const User = mongoose.model("User", user)
User.createIndexes()

module.exports = User;