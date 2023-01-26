import { Router } from "express";
import { ProductManager } from '../productManager.js';
import socketServer from "../app.js";


const router = Router();

const productManager = new ProductManager('../products.json')


router.get('/', async (req, res) => {
    let { limit } = req.query

    const products = await productManager.getProducts();
    const productsLimit = []

    if (limit) {
        for (let i = 0; i < parseInt(limit); i++){
            productsLimit.push(products[i]);
        }
        res.send({productsLimit});
        return 
    }

    res.send({products});
})

router.get('/:pid', async (req, res) => {
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


router.post('/', async (req, res) => {
    let productEntry = req.body;

    let product = {
        title: undefined,
        description: undefined,
        code: undefined,
        price: undefined,
        status: true,
        stock: undefined,
        category: undefined,
        thumbnails: '/'
    }

    product = {...product, ...productEntry}
    
    res.send(await productManager.addProduct(product));
    socketServer.emit('updateProducts', await productManager.getProducts());
})

router.put('/:pid', async (req, res) => {

    let pid = req.params.pid
    let id = parseInt(pid)
    let product = req.body

    
    res.send(await productManager.updateProduct(id, product));
    socketServer.emit('updateProducts', await productManager.getProducts());
})

router.delete('/:pid', async (req, res) => {

    let pid = req.params.pid;
    let id = parseInt(pid);

    
    res.send(await productManager.deleteProduct(id));
    socketServer.emit('updateProducts', await productManager.getProducts());
})

export default router;