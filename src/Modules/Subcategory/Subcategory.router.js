import {Router} from 'express';
import * as subCategoryController from './Controller/Subcategory.controller.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Subcategory.validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
;
const router = Router({mergeParams:true});

router.post("/createsubcategory",auth([roles.Admin]),fileUpload(fileValidation.image).single("image"),validation(validators.createSubCategorySchema),subCategoryController.createSubCategory)
router.put("/updatesubcategory/:subcategoryId",auth([roles.Admin]),fileUpload(fileValidation.image).single("image"),validation(validators.updateSubCategorySchema),subCategoryController.updateSubCategory)
router.get("/getsubcategory/:categoryId",validation(validators.getSubCategorySchema),subCategoryController.getSubCategory)
router.get("/getallsubcategories",subCategoryController.getAllSubCategories)
router.get("/:idSubCategory",subCategoryController.getAllProducts)
export default router