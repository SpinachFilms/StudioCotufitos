const btnCart = document.querySelector ('.cartVector')
const constainerCartProducts = document.querySelector('.container-cart-products')

btnCart.addEventListener('click', () => {
  constainerCartProducts.classList.toggle('hidden-cart')
});



