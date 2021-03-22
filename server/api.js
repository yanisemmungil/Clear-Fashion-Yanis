/*const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
*/
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db= require('./db/index.js')
const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});
/*app.get('/products/:id',async (request,response)=>{
  _id=request.params.id;
  res=await db.find({_id},1,1);
  if(res.result.length>0){
  console.log(res.result);
  response.send(res.result);
  }
  else{
    console.log("id not found")
    response.send({"res":"id not found"});
  }
});
*/

app.get('/products/search', async (request, response) => {
  let limit = request.query.limit;
  let brand = request.query.brand;
  let price = request.query.price;
  if(brand != null && price != null && limit != null)
  {
    limit = parseInt(limit);
    price = parseInt(price);
    const result = await db.find({'brand': brand, 'price': {$lt : price}}, limit);
    return response.send(result);
  }
  if(brand != null && price != null)
  {
    price = parseInt(price);
    const result = await db.find({'brand': brand, 'price': {$lt : price}}, 12);
    return response.send(result);
  }
  if(brand != null && limit != null)
  {
    limit = parseInt(limit);
    const result = await db.find({'brand': brand}, limit);
    return response.send(result);
  }
  if(price != null && limit != null)
  {
    limit = parseInt(limit);
    price = parseInt(price);
    const result = await db.find({'price': {$lt : price}}, limit);
    return response.send(result);
  }
  if(brand != null)
  {
    const result = await db.find({'brand': brand}, 12);
    return response.send(result);
  }
  if(price != null)
  {
    price = parseInt(price);
    const result = await db.find({'price': {$lt : price}}, 12);
    return response.send(result);
  }
  if(limit != null)
  {
    limit = parseInt(limit);
    const result = await db.find({}, limit);
    return response.send(result);
  }
  const result = await db.find();
  return response.send(result) 
});

app.get('/products/:id', async (request, response) => {
  const result = await db.find({'_id': `${request.params.id}`});
  response.send(result);
});


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);