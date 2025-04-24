import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    verifyOtp : {type: String, default: ''},
    verifyOtpExpireAt : {type: String, default: 0},
    isAccountVerified : {type: String, default: false},
    resetOtp : {type: String, default: ''},
    resetOtpExpireAt : {type: String, default: 0},
    location: {type: String, default: ''},
    role: {type: String, enum: ['donor', 'volunteer', 'admin'], default: 'donor'},
    points: {type: Number,default: 0},
    bio: {type: String, default:''}
},{
    timestamps: true
  })

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel;