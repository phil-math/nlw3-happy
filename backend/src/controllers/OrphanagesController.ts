import { Request, Response, } from "express"

import {getRepository} from 'typeorm'

import Orphanages from '../models/orphanages'
import orphanages_view from '../views/orphanages'

import * as yup from 'yup'

export default {

    async index(req:Request,res:Response){
        const orphanagesRepo = getRepository(Orphanages)

        const orphanages = await orphanagesRepo.find({
            relations:['images']
        })
        
        return res.status(200).json(orphanages_view.renderMany(orphanages))
    },

    async show(req:Request,res:Response){
        const orphanagesRepo = getRepository(Orphanages)

        const {id} = req.params 

        const orphanage = await orphanagesRepo.findOneOrFail(id,{
            relations:['images']
        })
        
        return res.status(200).json(orphanages_view.render(orphanage))
    },

    async create(req:Request,res:Response) {
        const orphanagesRepo = getRepository(Orphanages)

        const requestedImgaes = req.files as Express.Multer.File[]
        const images = requestedImgaes.map(image=>({path:image.filename}))

        const {
            name,
            latitude,
            longitude,
            about, 
            instructions,
            opening_hours,
            open_on_weekends
        }= req.body    

        const data = {
            name,
            latitude,
            longitude,
            about, 
            instructions,
            opening_hours,
            open_on_weekends:open_on_weekends==='true',
            images
        }
        
        const schema = yup.object().shape({
            name:yup.string().required(),
            latitude:yup.number().required(),
            longitude:yup.number().required(),
            about:yup.string().required().max(300),
            instructions:yup.string().required(),
            opening_hours:yup.string().required(),
            open_on_weekends:yup.boolean().required(),
            images:yup.array(
                yup.object().shape({
                    path:yup.string().required()
            }))
        })

        await schema.validate(data,{abortEarly:false})

        const orphanages = orphanagesRepo.create(data)
    
        await orphanagesRepo.save(orphanages)
        return res.status(201).json(orphanages)
    }
}