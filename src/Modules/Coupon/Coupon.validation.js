import { generalFeilds } from "../../Middleware/validation.js";
import joi from 'joi';

export const createCouponSchema = 
    joi.object({
        name:joi.string().min(3).required(),
        amount:joi.number().positive(),
        expireDate:joi.required()
    }).required()

    export const updateCouponSchema =
    joi.object({
        couponId:generalFeilds.id,
        name:joi.string().min(3),
        amount:joi.number().positive(),

    }).required()

    export const getACouponSchema =
    joi.object({
        couponId:generalFeilds.id,
    }).required()
    
