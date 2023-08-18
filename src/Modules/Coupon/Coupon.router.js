import {Router} from 'express';
import * as couponController from './Controller/Coupon.controller.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Coupon.validation.js';
import { auth, roles } from '../../Middleware/auth.middleware.js';
;
const router = Router();
router.post("/createcoupon",auth([roles.Admin]),validation(validators.createCouponSchema),couponController.createCoupon)
router.put("/updatecoupon/:couponId",auth([roles.Admin]),validation(validators.updateCouponSchema),couponController.updateCoupon)
router.get("/getallcoupons",couponController.getAllCoupons)
router.get("/getacoupon/:couponId",validation(validators.getACouponSchema),couponController.getACoupon)
export default router