import {Router} from 'express';
import * as cartController from './Controller/Cart.controller.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
// validation from '../../Middleware/validation.js'
// * as validators from './Cart.validation.js';
import { rolesOfThisEndPoint } from './Cart.endPoint.js';
;
const router = Router();

router.post("/createcart",auth(rolesOfThisEndPoint.create),cartController.createCart)


export default router