import {Router} from 'express';
import * as productController from './Controller/Product.controller.js';
import reviewRouter from '../Review/Review.router.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
import fileUpload, { fileValidation } from '../../Services/multerCloudinary.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Product.validation.js';
import { rolesOfThisEndPoint } from './Product.endPoint.js';
;
const router = Router();

router.use("/:productId/review",reviewRouter)

router.post('/addproduct',auth(rolesOfThisEndPoint.create),fileUpload(fileValidation.image).fields([
    {name:"mainImage" , maxCount:1},
    {name:"subImages" , maxCount:5}
]),productController.createProduct)

router.put('/updateproduct/:productId',auth(rolesOfThisEndPoint.create),fileUpload(fileValidation.image).fields([
    {name:"mainImage" , maxCount:1},
    {name:"subImages" , maxCount:5}
]),productController.updateProduct)

router.patch('/softdelete/:productId',auth(rolesOfThisEndPoint.create),productController.softDelete)
router.delete('/forcedelete/:productId',auth(rolesOfThisEndPoint.create),productController.forceDelete)
router.patch('/restore/:productId',auth(rolesOfThisEndPoint.create),productController.restore)
router.get('/getproduct/:productId',productController.getProduct)
router.get('/getAllProducts',productController.getAllProducts)
router.get('/getallsoftdeleteproducts',auth(rolesOfThisEndPoint.show),productController.getSoftDeleteProduct)


export default router