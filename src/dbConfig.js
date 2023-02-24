import mongoose from "mongoose";

const URI_MONGO = "mongodb+srv://admin:admin@cluster0.w0detpt.mongodb.net/dataBase?retryWrites=true&w=majority"

mongoose.connect(URI_MONGO, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Servidor conectado a la base de datos")
    }
})