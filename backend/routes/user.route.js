import express from "express"
import {createUser, deleteUser, getAllUsers, getUser, updateUserProfile} from "../controllers/user.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js";
import {roleChecker} from "../middlewares/checkRole.middleware.js";

const router = express.Router()
// ensure developer / admin has a valid accessToken
router.use(verifyUser, roleChecker(["DEVELOPER", "ADMIN"]))
router.post("/register", createUser)
router.post("profile/update/:id", updateUserProfile)
router.post("user/delete/:id", deleteUser)
router.post("user/all", getAllUsers)
router.post("/user/get/:id", getUser)

export default router