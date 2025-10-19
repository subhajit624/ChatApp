import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import generateTokenAndSetCookie from '../utils/generateToke.js';


export const register = async(req, res) => {
    try {
        const {fullname, gmail, password, gender} = req.body;
        if(!fullname || !gmail || !password || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const createdUser = await User.findOne({gmail});
        if(createdUser){
            return res.status(400).json({ message: "You have a account, please login" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${fullname}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${fullname}`;

       const user = await User.create({
                    fullname,
                    gmail,
                    password: hashPassword,
                    profilephoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
                    gender
                });

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            message: "Registered successfully",
            success: true,
            user
        });

    } catch (error) {
        console.log("error occur in register controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const login = async(req, res) => {
    try {
        const {gmail, password} = req.body;
        if(!gmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({gmail});
        if(!user) {
            return res.status(400).json({ message: "User not found, please register" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({ message: "Wrong Password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            message: "Login successful",
            success: true,
            user
        });

    } catch (error) {
        console.log("error occur in login controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
	try {
		res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getAllUser = async (req, res) => {
        try {
        const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        if (filteredUsers.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
		res.status(200).json(filteredUsers);
        } catch (error) {
            console.log("Error in getUser controller", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
}