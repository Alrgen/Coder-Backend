const buttons = document.querySelectorAll(".add-to-cart-button");
const cartButton = document.getElementById("cart")

const cart_id = cartButton.getAttribute("_id")

console.log(cart_id)

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        let product_id = button.getAttribute("_id")

        let product = {
            _id: product_id,
            cuantity: 1
        }

        fetch(`/api/carts/${cart_id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok){
                    console.log("Producto agregado")
                    return;
                }
                throw new Error('Error al agregar el producto')
            })
            .catch((error) => {
                console.log(error)
            });
    })
});