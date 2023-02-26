import { CartsModel } from "../models/carts.model.js";

export class CartManager {

    async addCart(){
        try {
            const newCart = await CartsModel.create({cuantity:1})
            return newCart;
        } catch (error) {
            console.log(error)
        }
    }

    async getCartById(cartId){
        try {
            const cart = await CartsModel.findById(cartId)
                .populate({
                    path: 'products',
                    populate: {
                        path: '_id',
                        model: 'Products'
                    }
                });
            return cart;
        } catch (error) {
            console.log(error)
        }
    }

    async addProductToCart(cartId, newProduct){
        try {
            const cart = await CartsModel.findById(cartId)

            const cuantity = parseInt(newProduct.cuantity)
            let productExist = false;

            cart.products.forEach(product => {
                if (product._id == newProduct._id.toString()){
                    product.cuantity += cuantity;
                    productExist = true;
                }
            })

            if (!productExist){
                cart.products.push({
                    _id:newProduct._id,
                    cuantity: cuantity
                });
            }
            cart.save()
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(cartId, productId, newCuantity){
        try {
            const cart = await CartsModel.findById(cartId)

            cart.products.forEach(product => {
                if (product._id.toString() == productId){
                    product.cuantity = newCuantity;
                    return
                }
            })

            cart.save()
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(cartId, productId){ 
        try {
            const cart = await CartsModel.findById(cartId);

            cart.products.pull({ _id: productId })

            cart.save()

            return cart
        } catch (error) {
            console.log(error)
        }
    }
    
    async deleteAllProducts(cartId){
        try {
            const cart = await CartsModel.findById(cartId);

            cart.products = []
            cart.save()
            return cart;
        } catch (error) {
            console.log(error)
        }
    }
}