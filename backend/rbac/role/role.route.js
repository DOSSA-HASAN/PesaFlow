import express from "express"
import * as roleController from "./role.controller.js"

const router = express.Router()

router.post('/', roleController.addRole)
router.get('/', roleController.getAllRoles)
router.get('/:field', roleController.getRoleByIdOrName)
router.delete('/:id', roleController.deleteRole)
router.patch('/:id', roleController.updateRole)
router.post('/:id/permissions', roleController.assignPermission)

export default router