import { Router } from "express";
import { CartManager } from "../dao/fileManager/cartManager.js";

const cartManager = new CartManager('../carts.json')
const router = Router();


router.post('/', async (req, res) => {
    cartManager.addCart([]);
    res.send("Carrito creado con exito")
})

router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    const parseCid = parseInt(cid);

    const cart = await cartManager.getCartById(parseCid);

    res.send(cart.products)
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const parseCid = parseInt(cid);

    const pid = req.params.pid;
    const parsePid = parseInt(pid);

    await cartManager.addProductToCart(parseCid, parsePid);

    res.send("Producto agregado con exito");
})


export default router;