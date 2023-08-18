import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
const router =Router();

router.post('/signup',validation(validators.signupSchema),asyncHandler(AuthController.signup))
router.post('/login',validation(validators.loginSchema),asyncHandler(AuthController.login))
router.get('/confirmEmail/:token',validation(validators.confirmEmailSchema),AuthController.confirmEmail)
router.get('/newConfirmEmail/:token',validation(validators.confirmEmailSchema),AuthController.newConfirmEmail)
router.patch('/sendcode',validation(validators.sendCodeSchema),AuthController.sendCode)
router.patch('/forgetPassword',validation(validators.forgetPasswordSchema),AuthController.forgetPassword)

export default router;