import { asyncHandler } from "../../../Services/errorHandling.js";
import orderModel from "../../../../DB/model/Order.model.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const createReview = asyncHandler(async(req,res,next)=>{

    const {productId} = req.params
    const {rating,comment} = req.body
    const order = await orderModel.findOne({
        userId:req.user._id,
        status:"delivered",
        "products.productId":productId
    })

    if(!order){return next(new Error("you can't review befor recevie it",{cause:400}))}


    const checkReview = await reviewModel.findOne({createdBy:req.user._id,productId})
    if(checkReview){return next(new Error("you already review",{cause:400}))}
   

    const review = await reviewModel.create({
        createdBy:req.user._id,
        orderId:order._id,
        rating,
        comment,
        productId
    })
    return res.status(201).json({message:"success",review})
})

export const updateReview = asyncHandler(async(req,res,next)=>{

const {productId,reviewId} = req.params
const review = await reviewModel.findOneAndUpdate({_id:reviewId,createdBy:req.user._id,productId:productId},req.body,{new:true})

return res.status(200).json({message:"success",review})
})

