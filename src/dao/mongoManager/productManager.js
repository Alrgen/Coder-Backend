import { ProductsModel } from "../models/products.model.js";

export class ProductManager {

    async getProducts(limit, sort, query, page) {
        try {
            let Limit, Page, Sort

            const {category, stock} = query;

            let Query = {};

            if (category != undefined && category != 'undefined') Query.category = category;
            if (stock.toLowerCase() === 'true') Query.stock = {$gte: 1};

            console.log(Query)

            switch (sort) {
                case "asc":
                    Sort = {price: 1}
                    break;
                case "desc":
                    Sort = {price : -1}
                    break;
                default:
                    Sort = {};
                    break
            }

            if (page === undefined){
                Page = 1
            } else {
                Page = parseInt(page)
            }
            if (limit === undefined){
                Limit = 10;
            } else {
                Limit = parseInt(limit)
            }

            

            const productsData = await ProductsModel.paginate(Query, {limit:Limit, page:Page, sort:Sort});
            const { totalDocs, totalPages, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage } = productsData

            const products = {
                status: "success",
                payload: productsData.docs,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: Page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: hasPrevPage ? `localhost:8080/api/products?limit=${limit}&page=${Page - 1}&sort=${sort}&stock=${stock}&category=${category}` : null,
                nextLink: hasNextPage ? `localhost:8080/api/products?limit=${limit}&page=${Page + 1}&sort=${sort}&stock=${stock}&category=${category}` : null
            }
            return products;
        } catch (error) {
            console.log(error)
            return "Error desconocido al obtener los productos."
        }
    }

    async addProduct(product) {
        try {

            if (this.#valuesValidation(product)) {
               return "Faltan campos por completar."
            }

            if (await this.#codeValidation(product.code)){
                return "El codigo ingresado ya esta en uso."
            }
            
            const newProduct = await ProductsModel.create(product);
            return newProduct;
        } catch (error) {
            console.log(error)
            return "Error al intentar agregar el producto."
        }
    }

    async getProductById(productId) {
        try {
            const product = await ProductsModel.findById(productId);
            return product
        } catch (error) {
            console.log(error)
            return "Producto no encontrado."
        }
    }

    async updateProduct(productId, newProduct){
        try {
            const product = await ProductsModel.updateOne({_id:productId}, newProduct);
            return product
        } catch (error) {
            console.log(error)
            return "Error al actualizar el producto."
        }
    }

    async deleteProduct(productId){
        try {
            const product = await ProductsModel.deleteOne({_id:productId});
            return product            
        } catch (error) {
            console.log(error)
            return "Error al eliminar el producto."
        }
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
    #codeValidation = async (code) => {
        let products = await this.getProducts();
        for (let i = 0; i < products.length; i++) {
            if (products[i].code === code) {
                return true;
            }
        }
        return false;
    }

}