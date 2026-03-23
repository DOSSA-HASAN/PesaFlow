import express from "express"
import {createUser, deleteUser, getAllUsers, getUser, updateUserProfile} from "./user.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js";
import {roleChecker} from "../middlewares/checkRole.middleware.js";

const router = express.Router()
// ensure developer / admin has a valid accessToken
router.use(verifyUser, roleChecker(["DEVELOPER", "ADMIN"]))
router.post("/register", createUser)
router.patch("profile/update/:id", updateUserProfile)
router.delete("user/delete/:id", deleteUser)
router.get("user/all", getAllUsers)
router.get("/user/get/:id", getUser)

export default router