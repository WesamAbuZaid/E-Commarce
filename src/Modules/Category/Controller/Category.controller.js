import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from'slugify'
import categoryModel from "../../../../DB/model/Category.model.js";

export const getCategory = asyncHandler(async(req,res,next)=>{
    const{categoryId} = req.params
    const category = await categoryModel.findById(categoryId)
    return res.json({message:"sucsses",category})
})

export const getAllCategories = asyncHandler(async(req,res,next)=>{
    
     const categories = await categoryModel.find().populate({
        path:"subCategory",
        select:"name"
     })
     return res.json({message:"sucsses",categories})
})

export const createCategory = asyncHandler(async(req,res,next)=>{
    const {name} = req.body;
    if(await categoryModel.findOne({name})){return next(Error("this category already exist",{cause:409}))}
    const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/category`})

    const category = await categoryModel.create({name,slug:slugify(name),image:{public_id,secure_url},createdBy:req.user._id,updatedBy:req.user._id})

    return res.json({message:"sucsses",category})
})

export const updateCategory = asyncHandler(async(req,res,next)=>{

    const {name} = req.body
    const {categoryId} = req.params
    const category = await categoryModel.findById(categoryId)
    if(!category){return next(Error("this category is not exist",{cause:400}))}
    if(category.name!=name && !await categoryModel.findOne({name})){

        category.name = name;
        category.slug =slugify(name)

    }else{return next(Error("this name already exist",{cause:409}))}
    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/category`})
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = {public_id,secure_url}
    }
    category.updatedBy = req.user._id
        category.save()
    return res.json({message:"sucsses",category})
})