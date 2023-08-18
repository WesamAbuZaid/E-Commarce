import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../Services/errorHandling.js";
import { verifyToken } from "../Services/generateAndVerifyToken.js";

export const roles ={
    Admin:'Admin',
    User:'User'
}

export const auth = (accessRoles=[]) =>{

    return asyncHandler( async(req,res,next)=>{
                const {authorization} = req.headers;
        
                if(!authorization?.startsWith(process.env.BEARERKEY)){
                    return res.json({message:"invalid bearer key"});
                }
                const token = authorization.split(process.env.BEARERKEY)[1];
                if(!token){
                    return res.json({message:"invalid token"})
                }
                const decoded = verifyToken(token,process.env.LOGIN_TOKEN);
                const authUser = await userModel.findById(decoded.id);
                if(!authUser){
                    return res.status(401).json({message:"not register account"});
                }
                if(!accessRoles.includes(authUser.role)){return next(new Error("cant have access to do this",{cause:403}))}
                if(authUser.changeTime.getTime()>decoded.iat*1000){
                    return next(new Error("please login again",{cause:400}))
                }
                req.user = authUser
                next();

    })
}



