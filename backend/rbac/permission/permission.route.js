import express from "express";
import * as permissionController from "./permission.controller.js"
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/checkRole.middleware.js";

const router = express.Router()
router.use(verifyUser)
router.post('/', authorize(['permission.create']), permissionController.addPermission)
router.get('/', authorize(['permission.read']), permissionController.getAllPermissions)
router.get('/:id', authorize(['permission.read']), permissionController.getPermissionById)
router.delete('/:id', authorize(['permission.delete']), permissionController.deletePermission)
router.patch('/:id', authorize(['permission.update']), permissionController.updatePermission)

export default router