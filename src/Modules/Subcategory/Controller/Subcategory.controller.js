import { asyncHandler } from "../../../Services/errorHandling.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from'slugify'
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";


export const getSubCategory = asyncHandler(async(req,res,next)=>{
    const{categoryId} = req.params
    const subCategory = await subCategoryModel.find({categoryId})
    return res.json({message:"sucsses",subCategory})
})

export const getAllSubCategories = asyncHandler(async(req,res,next)=>{
     const categories = await subCategoryModel.find({}).select("-_id").populate(
        {
            path:"categoryId",
            select:"-_id name"
        }
        )
     return res.json({message:"sucsses",categories})
})

 export const createSubCategory = asyncHandler(async(req,res,next)=>{
     const {name} = req.body;
     const {categoryId} = req.params
     if(await subCategoryModel.findOne({name})){return next(Error("this category already exist",{cause:409}))}
     const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/subCategory`})

     const subCategory = await subCategoryModel.create({name,slug:slugify(name),image:{public_id,secure_url},categoryId,createdBy:req.user._id,updatedBy:req.user._id})

     return res.json({message:"sucsses",subCategory})
 })

export const updateSubCategory = asyncHandler(async(req,res,next)=>{

    const {name} = req.body
    const {categoryId,subcategoryId} = req.params
    if(!await subCategoryModel.findOne({_id:subcategoryId,categoryId}))
    {return next(Error("this subcategory is not found"),{cause:404})}

    const subCategory = await subCategoryModel.findById(subcategoryId)

    if(subCategory.name!=name && !await subCategoryModel.findOne({name})){

        subCategory.name = name;
        subCategory.slug =slugify(name)

    }else{return next(Error("this name already exist",{cause:409}))}

    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.ProjectName}/subCategory`})
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        subCategory.image = {public_id,secure_url}
    }
    subCategory.updatedBy = req.user._id
    subCategory.save()
    return res.json({message:"sucsses",subCategory})
})
export const getAllProducts = asyncHandler(async(req,res,next)=>{
    const{idSubCategory} = req.params
    const products = await subCategoryModel.findById(idSubCategory).populate({
        path:'products',
        match:{deleted:{$eq:false}},
        populate:{path:"reviews"}

    })
    return res.status(200).json({message:"sucsses",products})
})