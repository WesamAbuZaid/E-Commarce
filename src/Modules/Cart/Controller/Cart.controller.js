import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from'slugify'
import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";


export const getcart = asyncHandler(async(req,res,next)=>{
    const{cartId} = req.params
    const cart = await cartModel.findById(cartId)
    return res.json({message:"sucsses",cart})
})

export const getAllCategories = asyncHandler(async(req,res,next)=>{
    
     const categories = await cartModel.find().populate({
        path:"subcart",
        select:"name"
     })
     return res.json({message:"sucsses",categories})
})

export const createCart = asyncHandler(async(req,res,next)=>{

    const {productId,qty} = req.body
    const product = await productModel.findById(productId)
    if(!product){return next(new Error("this product is not avilable",{cause:404}))}
    if(qty > product.stock){return next(new Error("this qty is not avilable",{cause:400}))}
    const cart = await cartModel.findOne({userId:req.user._id})
    if(!cart){
        const newCart = await cartModel.create({
            userId:req.user._id,
            products:[{qty,productId}]
        })
        return res.status(201).json({newCart})
    }
    let count=0;
    
    for(let i=0; i<cart?.products?.length;i++){
        if(cart.products[i].productId.toString() == productId){
            cart.products[i].qty=qty
            count++
            break;
        }
    }
    
    if(count==0){
        cart.products.push([{productId,qty}])
    }
    await cart.save()
    return res.status(200).json({message:"success",cart})



})

export const updatecart = asyncHandler(async(req,res,next)=>{

    const {name} = req.body
    const {cartId} = req.params
    const cart = await cartModel.findById(cartId)
    if(!cart){return next(Error("this cart is not exist",{cause:400}))}
    if(cart.name!=name && !await cartModel.findOne({name})){

        cart.name = name;
        cart.slug =slugify(name)

    }else{return next(Error("this name already exist",{cause:409}))}
    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/cart`})
        await cloudinary.uploader.destroy(cart.image.public_id)
        cart.image = {public_id,secure_url}
    }
    cart.updatedBy = req.user._id
        cart.save()
    return res.json({message:"sucsses",cart})
})