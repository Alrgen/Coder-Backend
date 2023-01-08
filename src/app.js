import { ProductManager } from './productManager.js';
import express from 'express'

const app = express()
const productManager = new ProductManager('../products.json')

app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.send("Página de inicio");
})

app.get('/products', async (req, res) => {
    let { limit } = req.query

    const products = await productManager.getProducts();
    const productsLimit = []

    if (limit) {
        console.log("Limite")
        for (let i = 0; i < parseInt(limit); i++){
            productsLimit.push(products[i]);
        }
        res.send({productsLimit});
        return 
    }

    res.send({products});
})

app.get('/products/:pid', async (req, res) => {
    let pid = req.params.pid

    const products = await productManager.getProducts();

    if (pid){
        const parseId = parseInt(pid)
        const product = await productManager.getProductById(parseId);
        console.log(product)

        res.send({product})
        return;
    }

    res.send({products});
})




app.listen(8080, ()=>console.log("Servidor iniciado"))