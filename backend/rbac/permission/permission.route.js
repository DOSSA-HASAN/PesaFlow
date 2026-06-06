import express from "express";
import * as permissionController from "./permission.controller.js"
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/checkRole.middleware.js";

const router = express.Router()

// Middleware for all routes to verify users existence in database and ensure valid jwt credentials
router.use(verifyUser)

// Route to add permission
router.post('/', authorize(['permission.create']), permissionController.addPermission)

// Route to view all permissions
router.get('/', authorize(['permission.read']), permissionController.getAllPermissions)

// Route to view specific permission
router.get('/:id', authorize(['permission.read']), permissionController.getPermissionById)

// Route to delete specific permission
router.delete('/:id', authorize(['permission.delete']), permissionController.deletePermission)

// Route to update specific permission
router.patch('/:id', authorize(['permission.update']), permissionController.updatePermission)

export default router