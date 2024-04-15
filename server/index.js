const {
    client,
    createTables,
    createUser,
    createProduct,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite,
    authenticate,
    findUserWithToken
  } = require('..server/db.js');
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  //for deployment only
  const path = require('path');
const { MdAdminPanelSettings } = require('react-icons/md');
  app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
  app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 
  
  const isLoggedIn = async(req, res, next)=> {
    try {
      req.user = await findUserWithToken(req.headers.authorization);
      next();
    }
    catch(ex){
      next(ex);
    }
  };
  
  app.post('/api/auth/login', async(req, res, next)=> {
    try {
      res.send(await authenticate(req.body));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/auth/register', async(req, res, next)=> {
    try {
      res.send(await createUser(req.body));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/auth/me', isLoggedIn, async(req, res, next)=> {
    try {
      res.send(await findUserWithToken(req.headers.authorization));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.send(await fetchFavorites(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/users/:id/favorites', isLoggedIn, async(req, res, next)=> {
    try {
      res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.delete('/api/users/:user_id/favorites/:id', isLoggedIn, async(req, res, next)=> {
    try {
      await destroyFavorite({user_id: req.params.user_id, id: req.params.id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/products', async(req, res, next)=> {
    try {
      res.send(await fetchProducts());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.use((err, req, res, next)=> {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message ? err.message : err });
  });
  
  const init = async()=> {
    const port = process.env.PORT || 3000;
    await client.connect();
    console.log('connected to database');
  
    await createTables();
    console.log('tables created');
  
    const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all([
      createUser({ email: 'spinachfilms@icloud.com', password: '1234' , admin: true}),
      createProduct({ name: 'Artframe1' , price: '100$'}),
      createProduct({ name: 'Artframe2', price: '50$' }),
      createProduct({ name: 'Artframe3', price: '25$' }),
      createProduct({ name: 'Artframe4', price: '44$' }),
      createProduct({ name: 'Artframe5', price: '222$' }),
      createProduct({ name: 'Artframe6', price: '124$' })
    ]);
  
    console.log(await fetchUsers());
    console.log(await fetchProducts());
  
    console.log(await fetchFavorites(moe.id));
    const favorite = await createFavorite({ user_id: moe.id, product_id: foo.id });
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  };
  
  init();