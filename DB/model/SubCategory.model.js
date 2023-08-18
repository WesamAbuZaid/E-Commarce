import mongoose, {Schema,Types,model} from 'mongoose';
const subCategorySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        type:Object
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
    categoryId:{
        type:Types.ObjectId,
        ref:'Category'
    },
    
    

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
subCategorySchema.virtual('products',{
    localField:"_id",
    foreignField:"subCategoryId",
    ref:"Product"
})
const subCategoryModel = mongoose.models.Subcategory ||  model('Subcategory', subCategorySchema);
export default subCategoryModel;