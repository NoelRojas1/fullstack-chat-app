import User from '../models/user.model.js';
import cloudinary from "../lib/cloudinary.js";

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic) return res.status(400).json({ message: 'Profile picture is required' });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            {new: true}
        );
        return res.status(200).json(updatedUser);
    } catch(error) {
        console.log("Error updating profile", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}