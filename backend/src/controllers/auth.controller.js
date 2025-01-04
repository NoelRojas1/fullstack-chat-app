import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import {decodeLinkId, encodeObjectId, generateToken, isValidLinkId} from "../lib/utils.js";
import {sendEmailVerificationEmail} from "../clients/mailer.js";

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        if(!email) return res.status(400).json({ message: "Email is required" });
        if(!fullName) return res.status(400).json({ message: "Name is required" });
        if(!password || password.length < 6) return res.status(400).json({message: "Password must be at least 6 characters"});

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser) {
            // generateToken(newUser._id, res);
            await newUser.save();
            await sendEmailVerificationEmail(newUser.email, newUser.fullName, encodeObjectId(newUser._id.toString()));
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                verified: newUser.verified,
            });
        }
        return res.status(400).json({ message: "Invalid user data" });
    } catch(error) {
        console.log("Error ", error);
        res.status(500).json({error: error.message});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email) return res.status(400).json({ message: "Email is required" });
    if(!password) return res.status(400).json({ message: "Password is required" });

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword) return res.status(400).json({ message: "Invalid Credentials" });

        generateToken(user._id, res);
        return res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            verified: user.verified,
        });
    } catch (error) {
       return res.status(500).json({error: error.message});
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(204).json({});
    } catch (error) {}
}

export const checkAuth = async (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch(error) {
        console.log("Error checking auth", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { linkId } = req.query;
        if(!linkId || !isValidLinkId(linkId)) {
            return res.status(400).json({ message: 'Your email address could not be verified' });
        }

        const userId = decodeLinkId(linkId);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { verified: true },
            {new: true}
        ).select("-password");

        if(!updatedUser) return res.status(404).json({ message: 'User not found' });

        generateToken(updatedUser._id, res);
        return res.status(201).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
            verified: updatedUser.verified,
        });
    } catch(error) {
        console.log("Error verifying email", error);
        return res.status(500).json({error: "Internal Server Error"});
    }

}
