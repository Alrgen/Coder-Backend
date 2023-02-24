import { Router } from "express";
//import { ProductManager } from '../dao/fileManager/productManager.js';
import { ProductManager } from "../dao/mongoManager/productManager.js";
import socketServer from "../app.js";


const router = Router();

const productManager = new ProductManager()


router.get('/', async (req, res) => {
    let { limit, sort, category, stock, page } = req.query

    const query = {category, stock}

    const products = await productManager.getProducts(limit, sort, query, page);
    res.send({products});
})

router.get('/:pid', async (req, res) => {
    let pid = req.params.pid
    const product = await productManager.getProductById(pid);

    res.send({product})
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
        thumbnails: '/',
        category: undefined
    }

    product = {...product, ...productEntry}

    res.send(await productManager.addProduct(product));
    socketServer.emit('updateProducts', await productManager.getProducts());
})

router.put('/:pid', async (req, res) => {
    let pid = req.params.pid
    let product = req.body

    
    res.send(await productManager.updateProduct(pid, product));
    socketServer.emit('updateProducts', await productManager.getProducts());
})

router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    
    res.send(await productManager.deleteProduct(pid));
    socketServer.emit('updateProducts', await productManager.getProducts());
})

export default router;