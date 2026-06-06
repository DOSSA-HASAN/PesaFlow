import express from "express"
import * as userController from "../user/user.controller.js"

const router = express.Router()

// Login route for all users
router.post("/login", userController.login)

export default router