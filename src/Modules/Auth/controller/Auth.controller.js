import { customAlphabet } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../Services/generateAndVerifyToken.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import { loginSchema, signupSchema } from "../Auth.validation.js";
import { asyncHandler } from "../../../Services/errorHandling.js";


export const signup= async (req,res,next)=>{ 
    const {userName,email,password} = req.body; 
    const user = await userModel.findOne({email});
    if(user){
        return next(new Error("email already exists"),{cause:409});
    }
    const token = generateToken({email},process.env.SGIN_UP_TOKEN,60*5);
    const refreshToken = generateToken({email},process.env.SGIN_UP_TOKEN,60*60*24);
    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const rlink =`${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`
    const html =`<a href="${link}">verify your email</a> <br/><br/> <a href="${rlink}">verify your email new once</a>`
    await sendEmail(email,'confirm email',html);
    const hashPassword = hash(password);
    const createUser = await userModel.create({userName,email,password:hashPassword});
    return res.status(201).json({message:"sucsses",user:createUser._id});
}
export const confirmEmail = async(req,res,next)=>{
    const {token} = req.params;
    const decoded = verifyToken(token,process.env.SGIN_UP_TOKEN);
    if(!decoded?.email){return next(new Error("invalid token payload"),{cause:400})}  
    const user = await userModel.updateOne({email:decoded.email},{confirmEmail:true});
    if(user.modifiedCount){return res.status(200).redirect('https://www.facebook.com')}
    else{ return next(new Error("this email already verify"),{cause:409})}   
}
export const newConfirmEmail = async(req,res,next)=>{
    const {token} = req.params;
    const {email} = verifyToken(token,process.env.SGIN_UP_TOKEN);
    if(!email){return next(new Error("there is no payload",{couse:400}))}
   const user = await userModel.findOne({email})
   if(!user){return next(new Error("this user is not reqister",{couse:400}))}
   if(user.confirmEmail){return next(new Error("email is already verfy",{couse:400}))}
   const newToken = generateToken({email},process.env.SGIN_UP_TOKEN,60*5);
   const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
   const html =`<a href="${link}">verify your email</a>`;
   await sendEmail(email,'confirm email',html);
   return res.status(200).send(`<p> new confirm email is send to your inbox</p>`)
    
}
export const login = async(req,res,next)=>{
        const {email,password} = req.body;
      
        const user = await userModel.findOne({email});
        if(!user){
            return next(new Error("email not exists"));
        }else {
            if(!user.confirmEmail){
                return next(new Error("plz verify your email"));
            }
            const match = compare(password,user.password);
            if(!match){
                return next(new Error("in valid password"));
            }else {
                const token =generateToken({id:user._id,role:user.role},process.env.LOGIN_TOKEN,'1h');
                const rToken =generateToken({id:user._id,role:user.role},process.env.LOGIN_TOKEN,60*60*24*365);
                return res.status(200).json({message:"success",token,rToken});
            }
        
    }
    
}
export const sendCode = async(req,res,next)=>{
    const {email} = req.body
    const code = customAlphabet('1234567890abcdef', 4)
   const verifyCode = code() 

   const user = await userModel.findOneAndUpdate({email},{code:verifyCode},{new:true})
   const html =`<p> the code is ${verifyCode}</p>`
   sendEmail(email,"Verify code",html)
   return res.json({message:"success",user})

}

export const forgetPassword = asyncHandler(async(req,res,next)=>{
    const {email,password,code} = req.body
    const user = await userModel.findOne({email})
    if(!user){return next(new Error("this email is not found"))}
    if(code!=user.code || !code){return next(new Error("this code is wrong"))}
    const hashPassword = hash(password)
    user.password=hashPassword
    user.code=null
    user.changeTime = Date.now()
    await user.save()
    return res.json({message:"success", user})
})