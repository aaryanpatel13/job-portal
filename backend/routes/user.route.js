import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();


// register
router.route("/register").post(singleUpload,register);

// logi-n
router.route("/login").post(login);

//log-out
router.route("/logout").get(logout);

//update profile
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);


export default router;