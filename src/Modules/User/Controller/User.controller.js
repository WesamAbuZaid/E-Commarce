import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";

export const profilePic =asyncHandler(async (req,res,next)=>{

   
    if(!req.file){
        return next(new Error("please provide a file"));
    }
    const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`user/${req.id}/profile`});
    const user = await userModel.findByIdAndUpdate(req.id,{profilePic:secure_url,profolePublicUrl:public_id}
    ,{new:false})
    if(user.profolePublicUrl){

        await cloudinary.uploader.destroy(user.profolePublicUrl);
    }
    return res.json({message:"success",user});

}) 

export const coverPic =async (req,res,next)=>{

    if(!req.files){
        return next(new Error("please provide a file"));


    }

    const coverPic=[];
    for(const file of req.files){
        coverPic.push(`${file.dest}`)
    }
    const user = await userModel.findByIdAndUpdate(req.id,{coverPic:coverPic}
    ,{new:true})
    return res.json({message:"success",user});
}


export const updatePassword=async  (req,res,next)=>{

    const {oldPassword,newPassword} = req.body;

    const user = await userModel.findById(req.id);
    const match = compare(oldPassword,user.password)
    if(!match){
        return next(new Error("invalid password "));
    }
    const hashPassword = hash(newPassword);
    await userModel.findByIdAndUpdate(req.id,{password:hashPassword});
    return res.json({message:"success"})

}

export const shareProfile = async(req,res,next)=>{

    const user = await userModel.findById(req.params.id).select('userName email ');

    if(!user){
        return next(new Error("invalid profile id"));
    }else{

        return res.json({message:'success',user});
    }

}