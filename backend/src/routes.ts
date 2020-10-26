import {Router} from 'express'
import multer from 'multer'

import uploadConfig from './config/upload'
import OrphanagesController from './controllers/OrphanagesController'

const uploads = multer(uploadConfig)
const routes = Router()

routes.post('/orphanages/new', uploads.array('images'), OrphanagesController.create)
routes.get('/orphanages',OrphanagesController.index)
routes.get('/orphanage/:id',OrphanagesController.show)

export default routes    