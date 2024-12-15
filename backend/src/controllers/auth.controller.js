import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import {generateToken} from "../lib/utils.js";

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
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        return res.status(400).json({ message: "Invalid user data" });
    } catch(error) {
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
            profilePic: user.profilePic
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
