import mongoose, {Schema,Types,model} from 'mongoose';
const brandSchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:Object,
        required:true

    },
    categoryId:{
        type:Types.ObjectId,
        ref:"Category",
        required:true
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

    timestamps:true
})


const brandModel = mongoose.models.Brand ||  model('Brand', brandSchema);
export default brandModel;