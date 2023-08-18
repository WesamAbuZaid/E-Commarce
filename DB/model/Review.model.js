
import mongoose, {Schema,Types,model} from 'mongoose';
const reviewSchema = new Schema ({
    comment:{ type:String , required:true } ,
    productId:{type:Types.ObjectId , required:true , ref:"Product"},
    createdBy:{ type:Types.ObjectId , required:true , ref:"User" },
    rating:{ type:Number , required:true , max:5 , min:1 },
    orderId:{ type:Types.ObjectId , required:true , ref:"Order"}
},
{
  
    timestamps:true
})
const reviewModel = mongoose.models.Review ||  model('Review', reviewSchema);
export default reviewModel;