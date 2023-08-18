import mongoose, {Schema,Types,model} from 'mongoose';
const cartSchema = new Schema ({

userId:{type:Types.ObjectId,required:true,ref:"User",unique:true},

products:[{
    productId:{type:Types.ObjectId,required:true,ref:"Product"},
    qty:{type:Number,default:1,required:true}
}]
},
{

    timestamps:true
})


const cartModel = mongoose.models.Cart ||  model('Cart',cartSchema);
export default cartModel;