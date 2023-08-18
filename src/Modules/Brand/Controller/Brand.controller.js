import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import brandModel from "../../../../DB/model/brand.model.js";

export const getAllBrands = asyncHandler(async(req,res,next)=>{
    
    const{brandId} = req.params
    const brands = await brandModel.find({brandId})
    return res.json({message:"sucsses",brands})
})

export const createbrand = asyncHandler(async(req,res,next)=>{
    const {name,categoryId} = req.body;
    if(await brandModel.findOne({name})){return next(Error("this brand already exist",{cause:409}))}
    const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/brand`})

    const brand = await brandModel.create({name,image:{public_id,secure_url},categoryId,createdBy:req.user._id,updatedBy:req.user._id})

    return res.json({message:"sucsses",brand})
})

export const updatebrand = asyncHandler(async(req,res,next)=>{

    const {name} = req.body
    const {brandId} = req.params
    const brand = await brandModel.findById(brandId)
    if(!brand){return next(Error("this brand is not exist",{cause:400}))}
    if(brand.name!=name && !await brandModel.findOne({name})){

        brand.name = name;

    }else{return next(Error("this name already exist",{cause:409}))}
    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/brand`})
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand.image = {public_id,secure_url}
    }
    brand.updatedBy = req.user._id
        brand.save()
    return res.json({message:"sucsses",brand})
})