import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    profilephoto: {
        type: String  
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    }
},
	{ timestamps: true }
);

export const User = mongoose.model('User', userModel);