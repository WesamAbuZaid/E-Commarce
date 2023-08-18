import mongoose from 'mongoose';

const connectDB = async ()=>{

    return await mongoose.connect(process.env.DB_LOCAL)
    
}

export default connectDB