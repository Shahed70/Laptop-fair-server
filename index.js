require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('express');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.em8kw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express()
app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(cors())

app.get('/',(req, res)=>{
    res.send('ok')
})

client.connect(err => {
    const productCollection = client.db("productsdb").collection("products");
    app.post('/addProduct', (req, res)=>{
      const product = req.body
      productCollection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

    })

    app.get('/getProduct', (req, res)=>{
      productCollection.find({})
      .toArray((err, docs)=>{
        res.send(docs)
      })
    })

    app.get('/getOne/:id', (req, res)=>{
      productCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result =>{
          res.send(result)
      })
    })

    app.get('/deleteProduct', (req, res)=>{
      productCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result =>{
          res.send(result)
      })
    })
    
  });

app.listen(port, ()=> console.log('Server is listening successfully on ' + port))