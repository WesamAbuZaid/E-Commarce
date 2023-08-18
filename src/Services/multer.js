import multer from "multer";
import { nanoid } from "nanoid";
import path from 'path'; 
import fs from 'fs';
import {fileURLToPath} from 'url';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const fileValidation ={
    image:['image/jpeg', 'image/png'],
    file:['application/pdf']
}
function fileUpload(customPath='public',customValidation=[]){
    const fullPath=path.join(__dirname,`../upload/${customPath}`);
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true});
    }
    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,fullPath)
        },
        filename:(req,file,cb)=>{
            const suffixName = nanoid() + file.originalname;
            file.dest=`upload/${customPath}/${suffixName}`
           
            cb(null,suffixName)
        },
    })

    function fileFilter (req,file,cb){

        if(customValidation.includes(file.mimetype))
         {
            cb(null,true);
        }else{
            cb("invalid format",false);
        }
    }
    const upload = multer({fileFilter,storage});
    
    return upload;
}
export default fileUpload;
