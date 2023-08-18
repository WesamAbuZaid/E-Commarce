import {Router} from 'express';
import * as brandController from './Controller/Brand.controller.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Brand.validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
;
const router = Router();

router.post("/createbrand",auth([roles.Admin]),fileUpload(fileValidation.image).single("image"),validation(validators.createbrandSchema),brandController.createbrand)
router.put("/updatebrand/:brandId",auth([roles.Admin]),fileUpload(fileValidation.image).single("image"),validation(validators.updatebrandSchema),brandController.updatebrand)
router.get("/getallbrands/:categoryId",validation(validators.getbrandSchema),brandController.getAllBrands)
export default router