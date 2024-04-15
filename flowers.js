function App() {
    const [selectedProductId, setSelectedProductId] = useState(null);
    const selectedProduct = Inventory.find((product) => product.id === selectedProductId);
  
    function handleClick(product) {
      console.log("Product name: ", product.name);
      setSelectedProductId(product.id);
    }
    
    return (
      <div className='App'>
        {
          Inventory.map((product) => {
            return <p onClick={() => handleClick(product)} key={product.id}>{product.name} {product.price}</p>;
          })
        }
        {selectedProduct && 
          <div>
            <h2>{selectedProduct.name}</h2>
            <ul>
              <li>Name: {selectedProduct.name}</li>
              <li>Price: {selectedProduct.price}</li>
            </ul>
          </div>
        }
      </div>
    );
  }
  
  export default App;