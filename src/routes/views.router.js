import express from 'express';
import { ProductManager } from '../dao/mongoManager/productManager.js';
import socketServer from '../app.js';
import { CartManager } from '../dao/mongoManager/cartManager.js';

const router = express.Router();
const productManager = new ProductManager('../products.json');
const cartManager = new CartManager();

const cartId = "63fbe491162191fb3fb400f7"
//const cartId = "63fbe492162191fb3fb400f9"
//const cartId = "63fbe493162191fb3fb400fb"



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

router.get('/products/:p', async (req, res) => {
    const page = req.params.p;
    const pageProducts = await productManager.getProducts(5, "", {stock:"false"}, page);

    const products = pageProducts.payload.map(data => {
        return {
            title: data.title,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category,
            _id: data._id
        }
    });
    let prevLink, nextLink;

    pageProducts.hasPrevPage == true ? prevLink = `/products/${parseInt(page) - 1}` : prevLink = `/products/${parseInt(page)}`
    pageProducts.hasNextPage == true ? nextLink = `/products/${parseInt(page) + 1}` : nextLink = `/products/${parseInt(page)}`

        
    res.render('products', {
        cartId:cartId,
        products:products,
        prevPag:prevLink,
        nextPag:nextLink
    });
})

router.get('/carts/:cid', async (req, res) => {
    if (req.params.cid.length > 5){
        const cartId = req.params.cid;
    }

    const rawCart = await cartManager.getCartById(cartId);

    const cart = rawCart.products.map(data => {
        return {
            product: {
                title: data._id.title,
                description: data._id.description,
                price: data._id.price,
                stock: data._id.stock,
                category: data._id.category,
                _id: data._id._id
            },
            cuantity: data.cuantity
        }
    })
    res.render('cart', {
        cart: cart
    })
})

export default router;