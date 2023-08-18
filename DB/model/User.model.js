

import mongoose, {Schema,model} from 'mongoose';
const userSchema = new Schema ({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
  image:{
    type:Object
},
phone:{
    type:String
},
role:{
    type:String,
    enum:['User','Admin'],
    default:'User'
},
status:{
    type:String,
    enum:['Active','Not_Active'],
    default:'Active'
},
gender:{
    type:String,
    enum:['Male','Female']
},
address:{
    type:String
},
code:{
    type:String,
    default:null
},
changeTime:{type:Date}
},
{
    timestamps:true
})
const userModel = mongoose.models.User ||  model('User', userSchema);
export default userModel;


