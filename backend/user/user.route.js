import express from "express"
import {createUser, deleteUser, getAllUsers, getUser, updateUserProfile} from "./user.controller.js";
import {verifyUser} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/checkRole.middleware.js";

const router = express.Router()
// ensure developer / admin has a valid accessToken
router.use(verifyUser, authorize(["DEVELOPER", "ADMIN"]))
router.post("/", createUser)
router.patch("/:id", updateUserProfile)
router.delete("/:id", deleteUser)
router.get("/", getAllUsers)
router.get("/:id", getUser)

export default router