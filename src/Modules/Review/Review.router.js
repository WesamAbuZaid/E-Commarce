import {Router} from 'express';
import * as reviewController from './Controller/Review.controller.js';
import { auth} from '../../Middleware/auth.middleware.js';
import validation from '../../Middleware/validation.js'
import * as validators from './Review.validation.js';
import { rolesOfThisEndPoint } from './Review.endPoint.js';
;
const router = Router({mergeParams:true});

router.post('/create',auth(rolesOfThisEndPoint.create),reviewController.createReview)
router.patch('/update/:reviewId',auth(rolesOfThisEndPoint.create),reviewController.updateReview)



export default router