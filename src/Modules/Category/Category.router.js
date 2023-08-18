import {Router} from 'express';
import * as categoryController from './Controller/Category.controller.js';
import subCategoryRouter  from '../Subcategory/Subcategory.router.js'
import { auth, roles } from '../../Middleware/auth.middleware.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Category.validation.js';
import { rolesOfThisEndPoint } from './Category.endPoint.js';
;
const router = Router();

router.use("/:categoryId/subcategory",subCategoryRouter)
router.post("/createcategory",auth(rolesOfThisEndPoint.create),fileUpload(fileValidation.image).single("image"),validation(validators.createCategorySchema),categoryController.createCategory)
router.put("/updatecategory/:categoryId",auth(Object.values(roles)),fileUpload(fileValidation.image).single("image"),validation(validators.updateCategorySchema),categoryController.updateCategory)
router.get("/getcategory/:categoryId",validation(validators.getCategorySchema),categoryController.getCategory)
router.get("/getallcategories",categoryController.getAllCategories)
export default router