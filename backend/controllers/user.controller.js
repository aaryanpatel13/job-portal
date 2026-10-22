import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


//register
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        };

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "This email already exisits.",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile :{
                profilePhoto : cloudResponse.secure_url,
            }
        });
        return res.status(201).json({
            message: "Account created successfully",
            succes: true,
        });
    } catch (error) {
        console.log(error)
    }

}



// login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        let user = await User.findOne({ email });     // user exists or not?

        if (!user) {                                    // user not exists
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); // if entered password is correct or not?

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        if (user.role !== role) {
            return res.status(400).json({
                message: "Account does not exisits for this role",
                success: false,
            });
        }

        const tokenData = {
            userId: user.id,
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back, ${user.fullname}`,
            user,
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
};


// logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
        }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};


// update profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        //cloudinary aaega idhr


        let skillsArray;
        if (skills){
            skillsArray = skills.split(",");
        }

        const userId = req.id; // authenticated user's ID

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Update basic profile details
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (bio)user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        //resume 
        if (cloudResponse){
            user.profile.resume = cloudResponse.secure_Url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // save the original name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };
        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            succes: true,
        });

    
    } catch (error) {
        console.error("Update profile error:", error);

    }
};