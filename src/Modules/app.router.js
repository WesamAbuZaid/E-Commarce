
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from './Category/Category.router.js';
import SubCategoryRouter from './Subcategory/Subcategory.router.js';
import CouponRouter from './Coupon/Coupon.router.js';
import BrandRouter from './Brand/Brand.router.js';
import ProductRouter from './Product/Product.router.js';
import CartRouter from './Cart/Cart.router.js';
import OrderRouter from './Order/Order.router.js';
import ReviewRouter from './Review/Review.router.js';
import cors from 'cors'


const initApp=(app,express)=>{
    connectDB();
    app.use(express.json());
    app.use(cors())
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use("/category",CategoryRouter)
    app.use("/subcategory",SubCategoryRouter)
    app.use("/coupon",CouponRouter)
    app.use("/brand",BrandRouter)
    app.use("/product",ProductRouter)
    app.use("/cart",CartRouter)
    app.use("/order",OrderRouter)
    app.use("/review",ReviewRouter)
    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;