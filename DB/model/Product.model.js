
import mongoose, {Schema,Types,model} from 'mongoose';
const productSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    slug:{
        type:String,
        required:true
    },
    description:String,
    stock:{
        type:Number,
        default:1
    },
    price:{
        type:Number,
        required:true,
        default:1
    },
    discount:{
        type:Number,
        default:0
    },
    finalPrice:{
        type:Number,
        default:1
    },
    colors:[String],
    size:[{type:String,enum:['s','m','lg','xl']}],
    mainImage:{
        type:Object,
        required:true
    },
    subImages:{
        type:Object,
        required:true
    },
    categoryId:{
        type:Types.ObjectId,
        required:true,
        ref:'Category'
    },
    subCategoryId:{
        type:Types.ObjectId,
        required:true,
        ref:'Subcategory'
    },
    couponId:{
        type:Types.ObjectId,
        ref:'Coupon'
    },
    brandId:{
        type:Types.ObjectId,
        required:true,
        ref:'Brand'
    },
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
    deleted:{
        type:Boolean,
        default:false
    }

},
{
    toJSON:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps:true
})
 productSchema.virtual("reviews",{
    localField:"_id",
    ref:"Review",
    foreignField:"productId"
 })



const productModel = mongoose.models.Product ||  model('Product', productSchema);
export default productModel;