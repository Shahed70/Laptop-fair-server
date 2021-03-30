require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('express');
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
    const collection = client.db("productsdb").collection("products");
    
  });

app.listen(port, ()=> console.log('connected'))