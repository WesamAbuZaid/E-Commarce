import {Router} from 'express';
import * as orderController from './Controller/Order.controller.js';
import { auth} from '../../Middleware/auth.middleware.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Order.validation.js';
import { rolesOfThisEndPoint } from './Order.endPoint.js';
;
const router = Router();

router.post('/create',auth(rolesOfThisEndPoint.create),orderController.createOrder)
router.post('/additemsfromcarttoorder',auth(rolesOfThisEndPoint.create),orderController.addItemsFromCartToOrder)
router.patch('/cancel/:orderId',auth(rolesOfThisEndPoint.create),orderController.cancelOrder)
router.patch('/changestatus/:orderId',auth(rolesOfThisEndPoint.create),orderController.changeStatus)


export default router