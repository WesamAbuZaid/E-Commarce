import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from'slugify'
import productModel from "../../../../DB/model/Product.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import brandModel from "../../../../DB/model/brand.model.js";


export const createProduct = asyncHandler(async(req,res,next)=>{
    const {name,price,discount,subCategoryId,categoryId,brandId,description,stock,colors,size} = req.body;
    const subCategory = await subCategoryModel.findOne({_id:subCategoryId,categoryId})
    if(!subCategory){return next(new Error("invalid subcategory",{cause:400}))}
    const brand = await brandModel.findById(brandId)
    if(!brand){return next(new Error("invalid brand",{cause:400}))}
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.ProjectName}/main_image`})
   const subImages = []
    for(const file of req.files.subImages)
    {
        const{secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.ProjectName}/sub_images`})
         subImages.push({secure_url,public_id})
    }
    const createdBy = req.user._id
    const updatedBy = req.user._id
    const slug = slugify(name)
    const finalPrice = price - (price*((discount||0)/100))

    const product = await productModel.create({name,slug,description,stock,price,discount,finalPrice,mainImage:{secure_url,public_id},subImages,
        subCategoryId,categoryId,brandId,createdBy,updatedBy,colors,size})

    return res.json(product)
})

export const updateProduct = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const newProduct = await productModel.findById(productId)
    if(!newProduct){return next(new Error("this product is not found",{cause:404}))}
    const {name,price,discount,subCategoryId,categoryId,brandId,description,stock,colors,size} = req.body;
    //------------------------------------------------------------------------
    if(subCategoryId&&categoryId){
        const subCategory = await subCategoryModel.findOne({_id:subCategoryId,categoryId})
             if(!subCategory){return next(new Error("invalid subcategory or category",{cause:400}))}
                newProduct.subCategoryId = subCategoryId;
                newProduct.categoryId = categoryId;
    }else if(subCategoryId){
            const subCategory = await subCategoryModel.findOne({_id:subCategoryId})
                if(!subCategory){return next(new Error("invalid subcategory",{cause:400}))}

                newProduct.subCategoryId = subCategoryId;
        }else{return next(new Error("plz choose sub category",{cause:400}))}
    //-----------------------------------------------------------------------
    if(price&&discount){
        newProduct.price = price
        newProduct.discount = discount
        newProduct.finalPrice = price - (price*((discount||0)/100))
    }else if(price){
        newProduct.price = price
        newProduct.finalPrice = price - (price*((newProduct.discount)/100))
    }else if(discount){
        newProduct.discount = discount
        newProduct.finalPrice = newProduct.price - (newProduct.price*((discount||0)/100))
    }
    //-----------------------------------------------------------------------
    if(req.files.mainImage.length){
            const {public_id,secure_url} = await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.ProjectName}/main_image`})
            await cloudinary.uploader.destroy(newProduct.mainImage.public_id)
            newProduct.mainImage = {public_id,secure_url}
    }
    //-----------------------------------------------------------------------
    if(req.files.subImages.length){  
        // for(image of newProduct.subImages){
        //     await cloudinary.uploader.destroy(image.public_id)
        // }
        const subImages = []
        for(const file of req.files.subImages)
        {
            const{secure_url,public_id} = await cloudinary.uploader.upload(file.path,{folder:`${process.env.ProjectName}/sub_images`})
             subImages.push({secure_url,public_id})
        }
        newProduct.subImages = subImages
    }
    //------------------------------------------------------------------------
    if(description){newProduct.description = description}
    //--------------------------------------------------------------------
    if(stock){newProduct.stock = stock}
    //---------------------------------------------------------------
    if(colors){newProduct.colors = colors}
    //------------------------------------------------------------
    if(size){newProduct.size = size}
    //---------------------------------------------------------
    if(name){
        newProduct.name = name
        newProduct.slug = slugify(name)
    }
    //---------------------------------------------
    if(brandId){
        const brand = await brandModel.findById(brandId)
    if(!brand){return next(new Error("invalid brand",{cause:400}))}
    newProduct.brandId = brandId
    }
    //------------------------------------------------
    newProduct.updatedBy = req.user._id
    //---------------------------------------
   newProduct.save()
     return res.json({message:"sucsses",newProduct})
})

export const softDelete = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const product = await productModel.findOneAndUpdate({_id:productId,deleted:false},{deleted:true},{new:true})
    if(!product){ return next(new Error("this product is not exist",{cause:404}))}
return res.status(200).json({message:"success",product})
})

export const forceDelete = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const product = await productModel.findOneAndDelete({_id:productId,deleted:true})
    if(!product){ return next(new Error("this product is not exist",{cause:404}))}
return res.status(200).json({message:"success",product})
})

export const restore = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const product = await productModel.findOneAndUpdate({_id:productId,deleted:true},{deleted:false},{new:true})
    if(!product){ return next(new Error("this product is not exist",{cause:404}))}
return res.status(200).json({message:"success",product})
})

export const getProduct = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const product = await productModel.findById(productId).populate('reviews')
    if(!product){ return next(new Error("this product is not exist",{cause:404}))}
return res.status(200).json({message:"success",product})
})

export const getAllProducts = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const product = await productModel.find().populate("reviews")
    if(!product){ return next(new Error("this product is not exist",{cause:404}))}
return res.status(200).json({message:"success",product})
})

export const getSoftDeleteProduct = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params
    const product = await productModel.find({deleted:true})
    if(!product){ return next(new Error("this product is not exist",{cause:404}))}
return res.status(200).json({message:"success",product})
})