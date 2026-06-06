import express from "express"
import * as userController from "./user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/checkRole.middleware.js";

const router = express.Router()

// Middleware for all routes to verify users existence in database and ensure valid jwt credentials
router.use(verifyUser)

// Route to add a new user
router.post("/", authorize(["user.create"]), userController.createUser)

// Route to get all users
router.get("/", authorize(["user.read"]), userController.getAllUsers)

// Route to update specifc users profile
router.patch("/:id", authorize(["user.update"]), userController.updateUserProfile)

//TODO: instead of deleting user account block it coz of relations
// router.delete("/:id", authorize(["user.delete"]), userController.deleteUser)

// Route to get specific user
router.get("/:id", authorize(["user.read"]), userController.getUser)

// Route to set a users roles
router.put("/:id/roles", userController.setUserRoles)
export default router