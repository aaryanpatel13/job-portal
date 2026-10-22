import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// register company
router.route("/register").post(isAuthenticated, registerCompany);

// get companies of logged-in user
router.route("/get").get(isAuthenticated, getCompany);

// get companies by Id
router.route("/get/:id").get(isAuthenticated,getCompanyById);

// update company
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompany);


export default router;