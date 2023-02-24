import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index:true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        unique: true,
        index:true
    },
    thumbnail:{
        type: String
    },
    category:{
        type: String,
        required: true
    }
})
productsSchema.plugin(mongoosePaginate);
export const ProductsModel = mongoose.model('Products', productsSchema);