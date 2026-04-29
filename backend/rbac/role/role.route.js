import express from "express"
import * as roleController from "./role.controller.js"
import { authorize } from "../../middlewares/checkRole.middleware.js"
import { verifyUser } from "../../middlewares/auth.middleware.js"

const router = express.Router()
router.use(verifyUser)
router.post('/', authorize(['role.create']), roleController.addRole)
router.get('/', authorize(['role.read']), roleController.getAllRoles)
router.get('/id/:id', authorize(['role.read']), roleController.getRoleById)
router.get('/name/:name', authorize(['role.read']), roleController.getRoleByName)
router.delete('/:id', authorize(['role.delete']), roleController.deleteRole)
router.patch('/:id', authorize(['role.update']), roleController.updateRole)
router.post('/:id/permissions', authorize(['role.assign']), roleController.assignPermission)

export default router