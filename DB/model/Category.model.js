import mongoose, {Schema,Types,model} from 'mongoose';
const categorySchema = new Schema ({
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

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
categorySchema.virtual('subCategory', {
    localField:'_id',
    foreignField:'categoryId',
    ref:"Subcategory"
  });

const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;