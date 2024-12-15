import express from 'express';
import {updateProfile} from "../controllers/users.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/update-profile", protectRoute, updateProfile);

export default router;