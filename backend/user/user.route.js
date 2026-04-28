import express from "express"
import * as userController from "./user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/checkRole.middleware.js";

const router = express.Router()
// ensure developer / admin has a valid accessToken
router.use(verifyUser)
router.post("/", authorize(["user.create"]), userController.createUser)
router.get("/", authorize(["user.read"]), userController.getAllUsers)
router.patch("/:id", authorize(["user.update"]), userController.updateUserProfile)
router.delete("/:id", authorize(["user.delete"]), userController.deleteUser)
router.get("/:id", authorize(["user.read"]), userController.getUser)
router.put("/:id/roles", userController.setUserRoles)
export default router