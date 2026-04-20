import express from "express";
import * as permissionController from "./permission.controller.js"

const router = express.Router()

router.post('/', permissionController.addPermission)
router.get('/', permissionController.getAllPermissions)
router.get('/:id', permissionController.getPermissionById)
router.delete('/:id', permissionController.deletePermission)
router.patch('/:id', permissionController.updatePermission)

export default router