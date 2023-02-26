import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products:[
        {
            _id:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products'
            },
            cuantity:{
                    type: Number,
            }
        }
    ]
   
})

export const CartsModel = mongoose.model('Carts', cartsSchema);