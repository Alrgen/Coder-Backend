const socket = io();
const productsList = document.getElementById("productsList");

socket.on("updateProducts", (products) => {
    productsList.innerHTML = '';

    products.forEach(product => {
        productsList.innerHTML += 
        `<li>
            <h2>${product.title}</h2>
            <h3>$${product.price}</h3>
            <span>ID: ${product.id}</span>
        </li>`
    });
})