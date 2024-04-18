const btnCart = document.querySelector ('.container-cart-icon')
const btnMenu = document.querySelector ('.container-menu-icon')
const containerCartProducts = document.querySelector('.container-cart-products')
const containerMenuIcon = document.querySelector('.container-menu-list')

btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart')
});

btnMenu.addEventListener('click', () =>{
  containerMenuIcon.classList.toggle('hidden-menu')
});


/*---------CartFunction-----------*/

const cartInfo = document.querySelector('.cart-product')
const rowProduct = document.querySelector('.row-product')

const productsList = document.querySelector('.container-items')

let allProducts = []

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos')

productsList.addEventListener('click', e => {
  if(e.target.classList.contains('btn-add-cart')){
    const product = e.target.parentElement
    const infoProduct ={
      quantity:1,
      title: product.querySelector('h2').textContent,
      price: product.querySelector('p').textContent,
    }

    const exists = allProducts.some(product => product.title === infoProduct.title)

    if (exists){
      const products = allProducts.map(product => {
        if(product.title === infoProduct.title){
          product.quantity ++ ;
          return product
        } else{
          return product
        }
      });
      allProducts = [...products];
    } else{
          allProducts = [...allProducts, infoProduct]
      }
    showHTML();
  }

})


rowProduct.addEventListener('click', (e) => {
  if(e.target.classList.contains('icon-close')){
    const product = e.target.parentElement
    const title = product.querySelector('p').textContent

    allProducts = allProducts.filter( product => product.title !== title);
    showHTML();
  }
})

const showHTML = () => {

  rowProduct.innerHTML = '';

  let total = 0;
  let totalOfProducts = 0;


  allProducts.forEach(product => {
    const containerProduct = document.createElement('div')
    containerProduct.classList.add('cart-product')

    containerProduct.innerHTML = `
       <div class="info-cart-product">
        <span class="cantidad-producto-carrito">${product.quantity}</span>
        <p class ="titulo-producto-carrito">${product.title}</p>
        <span class="precio-producto-carrito">${product.price}</span>
        <img class="icon-close" src="/images/CloseVector.png" alt="CloseVector"/>
       
    `;
    rowProduct.append(containerProduct);

    total = 
    total + parseInt(product.quantity * product.price.slice(1));
    totalOfProducts = totalOfProducts + product.quantity;

  });

    valorTotal.innerText = `$${total}`
    countProducts.innerText = totalOfProducts;
};