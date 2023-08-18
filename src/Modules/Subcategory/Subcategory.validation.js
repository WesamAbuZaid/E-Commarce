import { generalFeilds } from "../../Middleware/validation.js";
import joi from 'joi';

export const createSubCategorySchema = 
joi.object({
    name:joi.string().min(3).required(),
    file:generalFeilds.file.required(),
    categoryId:generalFeilds.id.required()
}).required()

export const updateSubCategorySchema = 
joi.object({
    name:joi.string().min(3),
    file:generalFeilds.file,
    categoryId:generalFeilds.id.required(),
    subcategoryId:generalFeilds.id.required()
}).required()

export const getSubCategorySchema = 
joi.object({
    categoryId:generalFeilds.id.required()
}).required()