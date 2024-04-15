const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
const { authenticate, findUserWithToken } = require('./db.js');


const client = new pg.Client(process.env.DATABASE_URL || 'postgresql:spinach:1234@localhost:1234/ho_studio')

const createTables = async () => {
    await client.connect()
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS producst;
    CREATE TABLE user(
        id  UUID DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        admin BOOLEN DEFAULT FALSE,
        PRIMARY KEY (id)
    );
    CREATE TABLE products(
        id UUID DEFAULT gen_random_uuid(),
        name VARCHAR(20),
        price VARCHAR(255),
        PRIMARY KEY (id)
    );
    CREATE TABLE favorites(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES producst(id) NOT NULL,
        CONSTRAINT unique_user_id_and_product_id UNIQUE (user_id, product_id)
    );
    `;
    await client.query(SQL);
}

const createUser = async({ email, password}) => {
    const SQL = `
    INSERT INTO users(id, email, password) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL , [uuid.v4(), email, await bcrypt.hash(password, 5)]);
    return response.rows[0];
};

const createProduct = async({ name, price, image }) => {
    const SQL = `
    INSERT INTO products(id, name, price, image) VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL , [uuid.v4(), name, price, image]);
    return response.rows[0];
};

const createFavorite = async({ user_id, product_id })=> {
    const SQL = `
      INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
    return response.rows[0];
  };
  
  const destroyFavorite = async({ user_id, id })=> {
    const SQL = `
      DELETE FROM favorites WHERE user_id=$1 AND id=$2
    `;
    await client.query(SQL, [user_id, id]);
  };
  
  const authenticate = async({ email, password })=> {
    const SQL = `
      SELECT id, password, email 
      FROM users 
      WHERE email=$1;
    `;
    const response = await client.query(SQL, [email]);
    if((!response.rows.length || await bcrypt.compare(password, response.rows[0].password))===false){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    const token = await jwt.sign({ id: response.rows[0].id}, JWT);
    return { token: token };
  };

  const findUserWithToken = async(token)=> {
    let id;
    console.log("insidefinduserwithtoken")
    console.log("passed token " + token)
    try{
      const payload = await jwt.verify(token, JWT);
      id = payload.id;
    }catch(ex){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
  
    }
    const SQL = `
      SELECT id, username FROM users WHERE id=$1;
    `;
    const response = await client.query(SQL, [id]);
    if(!response.rows.length){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  };
  
  const fetchUsers = async()=> {
    const SQL = `
      SELECT id, email FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchProducts = async()=> {
    const SQL = `
      SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchFavorites = async(user_id)=> {
    const SQL = `
      SELECT * FROM favorites where user_id = $1
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
  };

  module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite,
    authenticate,
    findUserWithToken
  };