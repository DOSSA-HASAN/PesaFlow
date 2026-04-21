import express from "express"
import * as userController from "./user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/checkRole.middleware.js";

const router = express.Router()
// ensure developer / admin has a valid accessToken
router.use(verifyUser, authorize(["developer", "admin"]))
router.post("/", userController.createUser)
router.get("/", userController.getAllUsers)
router.patch("/:id", userController.updateUserProfile)
router.delete("/:id", userController.deleteUser)
router.get("/:id", userController.getUser)

export default router