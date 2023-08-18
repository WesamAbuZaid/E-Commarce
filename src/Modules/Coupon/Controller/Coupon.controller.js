import { asyncHandler } from "../../../Services/errorHandling.js";
import couponModel from "../../../../DB/model/coupon.model.js";

export const getACoupon = asyncHandler(async(req,res,next)=>{
    
    const coupon = await couponModel.findById(req.params.couponId)
    return res.json({message:"sucsses",coupon})
})

export const getAllCoupons = asyncHandler(async(req,res,next)=>{
    
    const coupons = await couponModel.find()
    return res.json({message:"sucsses",coupons})
})


export const createCoupon = asyncHandler(async(req,res,next)=>{
    const {name,expireDate} = req.body;
    
    const date = new Date(expireDate)
    const now = new Date()
    if(date<=now){
        return next(new Error("this date is along",{cause:400}))
    }
    req.body.expireDate = date.toLocaleDateString()
    req.body.createdBy = req.user._id
    req.body.updatedBy = req.user._id
    if(await couponModel.findOne({name})){return next(Error("this coupon already exist",{cause:409}))}
    const coupon = await couponModel.create(req.body)
    return res.json({message:"sucsses",coupon})
})

export const updateCoupon = asyncHandler(async(req,res,next)=>{
    const {name} = req.body
    const {couponId} = req.params
    const coupon = await couponModel.findById(couponId)
    if(!coupon){return next(Error("this coupon is not exist",{cause:400}))}
    if(coupon.name!=name && !await couponModel.findOne({name})){

        coupon.name = name;

    }else{return next(Error("this name already exist",{cause:409}))}

    if(req.body.amount){
   
        coupon.amount = req.body.amount
    }
    coupon.updatedBy = req.user._id
        coupon.save()
    return res.json({message:"sucsses",coupon})
})