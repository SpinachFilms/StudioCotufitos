import React from 'react';
import { Inventory } from './data'; 

function ProductList() {
  return (
    <div className="product-list">
      <h1>Product List</h1>
      <div className="products">
        {Inventory.map(product => (
          <div className="product" key={product.id}>
            <img src='../images/BannerPromo.png' alt='BannerPromo'/>
            <h2>{product.name}</h2>
            <p>Price: {product.price}</p>
            <p>Quantity: {product.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
