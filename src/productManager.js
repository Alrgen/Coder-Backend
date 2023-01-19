import fs from 'fs'

export class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(product) {
        this.products = await this.getProducts();
        let newItem = { ...product, id: 1 }

        if (this.products.length === 0) {
            this.products.push(newItem);
            this.#saveData();
            return "Producto agregado";
        }

        if (this.#valuesValidation(newItem)) {
            return "Faltan campos por completar.";
        }

        if (this.#codeValidation(newItem.code)) {
            return "El codigo ingresado ya esta en uso.";
        }

        newItem.id = this.products[this.products.length - 1].id + 1;

        this.products.push(newItem);
        this.#saveData();
        return "Producto agregado";
    }

    #saveData = () => {
        fs.writeFileSync(this.path, JSON.stringify(this.products))
    }

    #valuesValidation = (item) => {
        let values = Object.values(item);

        for (let i = 0; i < values.length; i++) {
            if (values[i] === undefined) {
                return true;
            }
        }
        return false;
    }
    #codeValidation = (code) => {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].code === code) {
                return true;
            }
        }
        return false;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const productsData = await fs.promises.readFile(this.path, "utf-8")
                const productsParse = JSON.parse(productsData);
                return productsParse;
            } else {
                console.log([])
                return []
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(id) {
        try {
            this.products = await this.getProducts();
            let productFilter;
            if (this.products.length > 0) {
                let b = false;
                this.products.forEach(product => {
                    if (product.id === id) {
                        b = true;
                        productFilter = product;
                        return 
                    };
                });
                if (!b){
                    return "Not Found"
                }
                return productFilter;
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    async updateProduct(id, newProduct) {
        try {
            this.products = await this.getProducts();
            
            for(let i = 0; i < this.products.length; i++){
                if (this.products[i].id === id){
                    this.products[i] = {...this.products[i], ...newProduct};
                    this.products[i].id = id;
                    this.#saveData();
                    
                    return `Producto modificado con exito`;
                }
            }

            return 'Ocurrio un error inesperado'
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    async deleteProduct(id) {
        this.products = await this.getProducts();
        try {
            const index = this.products.findIndex((product) => product.id === id);
            if (index >= 0){
                this.products.splice(index, 1);
                this.#saveData();
                return "Producto eliminado con exito"
            } else {
                return "El id no corresponde con ningun producto"
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
}

const productManager = new ProductManager("products.json");


async function prueba() {
    /*
    //Obtener productos guardados
    console.log(await productManager.getProducts());

    //Añadir un producto
    productManager.addProduct({
        title: "producto prueba",
        description: "Este es un producto de prueba",
        price: 10,
        thumbnail: "sin imagen",
        code: "abc125",
        stock: 20
    })

    //Obtener un producto por id
    productManager.getProductById(5);

    //Actualizar un producto
    productManager.updateProduct(2, {
        title: "producto Modificado",
        description: "Este es un producto de prueba modificado",
        price: 150,
        thumbnail: "sin imagen",
        code: "abc125",
        stock: 20
    })

    //Remover un producto
    productManager.deleteProduct(6)
    */
}

prueba()
