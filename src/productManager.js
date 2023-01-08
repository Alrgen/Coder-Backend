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
            console.log("Producto agregado");
            return;
        }

        if (this.#valuesValidation(newItem)) {
            console.log("Faltan campos vacios.")
            return;
        }

        if (this.#codeValidation(newItem.code)) {
            console.log("El codigo ingresado ya esta en uso.");
            return;
        }

        newItem.id = this.products.length + 1;

        this.products.push(newItem);
        this.#saveData();
        console.log("Producto agregado");
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
                    this.products[i] = newProduct;
                    this.products[i].id = id;
                    this.#saveData();
                    console.log("Producto modificado con exito");
                    return;
                }
            }
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
                console.log("elemento eliminado");
            } else {
                console.log("Elemento no encontrado");
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
