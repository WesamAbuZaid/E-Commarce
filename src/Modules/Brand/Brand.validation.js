import { generalFeilds } from "../../Middleware/validation.js";
import joi from 'joi';

export const createbrandSchema = 
    joi.object({
        name:joi.string().min(3).required(),
        file:generalFeilds.file.required(),
        categoryId:generalFeilds.id.required()
    }).required()

    export const updatebrandSchema =
    joi.object({
        brandId:generalFeilds.id,
        name:joi.string().min(3),
        file:generalFeilds.file,

    }).required()
    
    export const getbrandSchema = 
    joi.object({
        categoryId:generalFeilds.id
    })
