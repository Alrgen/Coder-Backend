import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);



app.get('/', (req, res) => {
    res.send("Página de inicio");
})


app.listen(8080, ()=>console.log("Servidor iniciado"))