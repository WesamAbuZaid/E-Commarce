
import mongoose, {Schema,Types,model} from 'mongoose';
const couponSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        default:1
    },
   expireDate:{type:String,required:true},
   usedBy:[{
    type:Types.ObjectId,
    ref:"User"
}],
createdBy:{
    type:Types.ObjectId,
    required:true,
    ref:"User"
},
updatedBy:{
    type:Types.ObjectId,
    required:true,
    ref:"User"
},
},
{
  
    timestamps:true
})


const couponModel = mongoose.models.Coupon ||  model('Coupon', couponSchema);
export default couponModel;