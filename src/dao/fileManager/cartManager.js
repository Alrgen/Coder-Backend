import fs from 'fs'

export class CartManager {
    constructor(path){
        this.path = path;
        this.carts = [];
    }

    async addCart(products){
        this.carts = await this.#getCarts();

        let newCart = {
            id:1,
            products: products
        }

        if (this.carts.length === 0){
            this.carts.push(newCart);
            this.#saveData();
            return;
        }


        newCart.id = this.carts[this.carts.length - 1].id + 1;
        this.carts.push(newCart);

        this.#saveData();
    }

    async getCartById(id){
        this.carts = await this.#getCarts();

        for (let i = 0; i < this.carts.length; i++){
            if (this.carts[i].id === id){
                return this.carts[i];
            }
        }
    }

    async addProductToCart(cartId, productId){
        let cart = await this.getCartById(cartId);
        let productExist = false;

        cart.products.forEach(product => {
            if (product.id === productId){
                product.cuantity++;
                productExist = true;
            }
        });

        !productExist && cart.products.push({id: productId, cuantity:1});

        this.#saveData();
    }

    #getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const cartsData = await fs.promises.readFile(this.path, "utf-8")
                const cartsParse = JSON.parse(cartsData);
                return cartsParse;
            } else {
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    

    #saveData = () => {
        fs.writeFileSync(this.path, JSON.stringify(this.carts))
    }
}