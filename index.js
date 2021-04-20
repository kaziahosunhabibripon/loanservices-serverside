const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3msfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const servicesCollection = client.db("loanServicesDB").collection("loanServices");
  const loanCollection = client.db("loanServicesDB").collection("loanApplication");
  const reviewCollection = client.db("loanServicesDB").collection("review");
  
   app.post('/addService', (req, res) => {
       const newEvent = req.body;
       servicesCollection.insertOne(newEvent)
      .then(result => {
        
        res.send(result.insertedCount > 0);
      })

   })
   app.post('/review', (req, res)=>{
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result=>{
        res.send(result.insertedCount > 0);
    })
    

})
  app.get('/reviewUser', (req, res)=>{
    reviewCollection.find({})
    .toArray((err, items)=>{
      res.send(items)
    })
  })

   app.get('/service', (req, res)=>{
     servicesCollection.find({})
     .toArray((err, items)=>{
       res.send(items)
      
     })
     
   })

   app.get('/service/:name', (req, res)=>{  
     servicesCollection.find({name : req.params.name})
    
     .toArray((err, items)=>{
       res.send(items);
     })
    
   })
 
  
  app.post('/loanOrder', (req, res)=>{
      const order = req.body;
      loanCollection.insertOne(order)
      .then(result=> {
        res.send(result.insertedCount> 0);
      })
  })

  app.get('/bookingList', (req, res)=>{
   
    loanCollection.find({email: req.query.email})
    .toArray((err, items)=>{
      res.send(items) 
    })
    
  })
  // app.delete('/delete/:id', (req, res) => {
  //   bookCollection.deleteOne({ _id: ObjectId(req.params.id) })
  //       .then(result => {
  //           res.send(result.deletedCount > 0);
  //       })


        
  //     })

      


  console.log("collection error", err);
});

app.get('/', (req, res) => {
    res.send('Welcome to Loan Service!')
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})