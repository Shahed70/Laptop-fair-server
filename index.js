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
    const ordersCollection = client.db("productsdb").collection("orders");
    app.post('/addProduct', (req, res)=>{
      const product = req.body
      productCollection.insertOne(product)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

    })

    app.post('/orderInfo', (req, res)=>{
      const info = req.body;
      ordersCollection.insertOne(info)
      .then(result =>{
        console.log(result.insertedCount);
      })
    
    })

    app.get('/getOrderInfo', (req, res)=>{
      ordersCollection.find({})
      .toArray((err, docs)=>{
        res.send(docs)
      })
    })

    app.post('/deleteOrderInfo/:id', (req, res)=>{
      ordersCollection.deleteOne({_id:ObjectId(req.params.id)})
         .then(result => {
           res.send(result)
         })
    })

    app.get('/getProduct', (req, res)=>{
      productCollection.find({})
      .toArray((err, docs)=>{
        res.send(docs)
      })
    })

    app.get('/getSingleProduct/:id', (req, res)=>{
      productCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err, docs)=> {
          res.send(docs[0])
        })
    })

    app.post('/deleteProduct/:id', (req, res)=>{
      productCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result =>{
          res.send(result)
      })
    })
    
  });

app.listen(port, ()=> console.log('Server is listening successfully on ' + port))