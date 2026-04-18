import express from "express"
import * as roleController from "./role.controller.js"

const router = express.Router()

router.post('/add', roleController.addRole)

export default router