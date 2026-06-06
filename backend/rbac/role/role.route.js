import express from "express"
import * as roleController from "./role.controller.js"
import { authorize } from "../../middlewares/checkRole.middleware.js"
import { verifyUser } from "../../middlewares/auth.middleware.js"

const router = express.Router()

// Middleware for all routes to verify users existence in database and ensure valid jwt credentials
router.use(verifyUser)

// Route to add role
router.post('/', authorize(['role.create']), roleController.addRole)

// Route to get all existing roles
router.get('/', authorize(['role.read']), roleController.getAllRoles)

// Route to get specific role (by ID)
router.get('/id/:id', authorize(['role.read']), roleController.getRoleById)

// Route to get specific role (By name)
router.get('/name/:name', authorize(['role.read']), roleController.getRoleByName)

// Route to delete specific role
router.delete('/:id', authorize(['role.delete']), roleController.deleteRole)

// Route to update specific role
router.patch('/:id', authorize(['role.update']), roleController.updateRole)

// Route to assign roles to a permission
router.post('/:id/permissions', authorize(['role.assign']), roleController.assignPermission)

export default router