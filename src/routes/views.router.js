import express from 'express';
import { ProductManager } from '../dao/mongoManager/productManager.js';
import socketServer from '../app.js';

const router = express.Router();
const productManager = new ProductManager('../products.json');


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();

    res.render('home', {
        products:products,
        style:'style.css'
    });
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();

    socketServer.on('connection', async (socket) => {
        console.log(`Cliente conectado - ${socket.id}`)
        socket.emit('updateProducts', await productManager.getProducts());
    })


    res.render('realTimeProducts', {
        products:products,
        style:'style.css'
    })
})

export default router;