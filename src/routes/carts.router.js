import { Router } from "express";
import { CartManager } from "../dao/mongoManager/cartManager.js";

const cartManager = new CartManager()
const router = Router();


router.post('/', async (req, res) => {
    cartManager.addCart();
    res.send("Carrito creado con exito")
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;

    const cart = await cartManager.getCartById(cid);

    res.send(cart)
})

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const product = req.body;
    
    const cart = await cartManager.addProductToCart(cartId, product);

    res.send(cart);
})

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const {newCuantity} = req.body;

    const cart = await cartManager.updateProduct(cartId, productId, newCuantity)

    res.send(cart)
})

router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.deleteProduct(cartId, productId);

    res.send(cart)
})

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    const cart = await cartManager.deleteAllProducts(cartId);

    res.send(cart);
})

export default router;