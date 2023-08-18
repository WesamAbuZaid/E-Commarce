import joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js';

export const signupSchema = 
    joi.object({
        userName:joi.string().alphanum().min(3).max(20).required().messages({
            'any.required':'username is required',
            'string.empty':'username is required'
        }),
        email:generalFeilds.email,
        password:generalFeilds.password,
        cPassword:joi.string().valid(joi.ref('password')).required(),
    }).required()

    
    export const forgetPasswordSchema = 
    joi.object({
        email:generalFeilds.email,
        password:generalFeilds.password,
        cPassword:joi.string().valid(joi.ref('password')).required(),
        code:joi.string(),
    }).required()

export const loginSchema = 
    joi.object({
        email:generalFeilds.email,
        password:generalFeilds.password,
    }).required();

    export const confirmEmailSchema = 
    joi.object({
        token:joi.string().required(),
    }).required();
    
    export const sendCodeSchema = 
    joi.object({
        email:generalFeilds.email,
    }).required();