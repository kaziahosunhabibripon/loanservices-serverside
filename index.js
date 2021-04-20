const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// var serviceAccount = require("./loan-services-6cd72-firebase-adminsdk-3lpu8-4acbe66945.json");
var serviceAccount = {
  "type": "service_account",
  "project_id": "loan-services-6cd72",
  "private_key_id": "4acbe66945152e24eb1c58070e763148e6a7c0b6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDu6sHCsfPxX/k+\nzu+0JJuSfnE80cfAPsQmmFtyXJpJv1P2IE4U3dgtvHFSn3twQiIDQa6JfF8X9xl9\nq+bQD/YXA81Z24dIjP6ez9Mrj8MH8aljoqQOi5l4/M6ft6SEz05th3P1JjgT/yR6\nalRMtzNcAXxBx87cTxMbbAudTTMrs4oox6fEB5Nd3wIijl6lOsXFQvQY5ns1ZImt\n5E+kEX1gMkYUj0zUcUGszXGDdY4qG8BEhbqdr7izpqqHGpCE0mvzPBUWlViF91Zb\nPQgcUmMGTuqVNod4929R9msW38umWQzrBKgpGRtuqy0+zbQTHUjxxBOz5/HGfLQH\nFluYaPAZAgMBAAECggEAFlunuEWY84yssYECE5Sdbm8gv7VOASKejpIRdLlPwvkB\nrXXGeNNt6JHK9RVxosa9khpyb/FQoNiB7S3KEsx7lhnH/NG7bkGrjkcalugEM1kd\nJfLRcX8E5Lqbx3yTC86uozda1aU2+EAXNNGAhBFc4A5Ph4RgSmOoARfyWk0gLcWY\nLBp2+rWi0rp9Q3f4MjZhEWV/QHK+9h5ufENQU1mqGccydum5VRfzlzu2vuPh8Zuy\n5KkxXwJcENJV8TtwsBV2qfy5wuognc3ZIlFmz2E5SEdcJSEVez3o0gscxBHWINje\njs6O+9RNAcDLU+1Ng0WGaLyYXWqZDBaICQXAfUZ7UQKBgQD7SvqhZd5aWBikp0WH\nc2C5oi4EUGHNm9wsAerW/GrUjlUxg3gzJA/ZE+CAO2CgM7RjmT9vdGyHT4xgLzUr\nlOvocseNGF7G5XfwEXQV0QBwtUst4mizW7vqaofby3ghtqjerWf7T4AdtFg/xMVr\ng3Ug8WuVTGLJ1zwbsu3cQ23N5QKBgQDzZG6aNWVO4Tzz61m31t+LqpevdkmuMJQR\n7IPcePwLJN/zS1UeKbX9ZdJFSCOWc7nygXI0R0koqNWCq6e0LqGmoRSpZrJPWC6h\n7gPWlklHR+4OPaBYwTfX401iH20U+XSuppY2ygQl7CvlY/dxfEmKtXYgPDxhomHb\nl78UOO6WJQKBgGxWEONQJaJRZJ5ntuQEa+jb8HbPqLqZvTwDv5jbzbrBeh0UjteN\nbn+pwBnIf4nRgK2Hvf9w8/EJ7HzzHTsiwum9wiYkIYgiGakX/TICnuv4XOb1OypI\nHCWds+CgQbRXKUqG+9MunQ8xVvJ3BJ2rWO3Q5w7Alb5q2nEenMlfEJG5AoGAZ4TV\nzdzcA9qktBHrjNdlKOAbt9MVr3KV57Gyu7jxakP6xF3MDBIth2MhNbpi+ICsG8qW\nqkmPgi2c8gDUSTx0IIzuXsaBHGIjI1g6ZbBx5lFfnMr1QgqcF8Rji1JWcM9Qo1/T\nD+aIMSDr4prMCYaVONvJLBiyjcwk1uMJsC4uu8kCgYAnEE3SR4bLj1igH70lW70Z\nyAh/zIaieqF/k6VS4Y4PwuMTiVcf+jdepgg2WA7lMtg2xnLEdm/KdPGogocRcGNU\ndCKdh57SdzDdlFSRhm4re5saOQ9iY8NbKkahSvdsmiWsIileWqlF+aT4SUwVfTA+\nf7emqvlX23HXtLcfpsKraw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-3lpu8@loan-services-6cd72.iam.gserviceaccount.com",
  "client_id": "114817083575118280150",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3lpu8%40loan-services-6cd72.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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
  app.post('/review', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0);
      })


  })
  app.get('/reviewUser', (req, res) => {
    reviewCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/service', (req, res) => {
    servicesCollection.find({})
      .toArray((err, items) => {
        res.send(items)

      })

  })

  app.get('/service/:name', (req, res) => {
    servicesCollection.find({ name: req.params.name })

      .toArray((err, items) => {
        res.send(items);
      })

  })


  app.post('/loanOrder', (req, res) => {
    const order = req.body;
    loanCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/bookingList', (req, res) => {

    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if (tokenEmail == queryEmail) {
            loanCollection.find({ email: queryEmail })
              .toArray((err, items) => {
                res.send(items)
              })
          }
          else{
            res.status(401).send('Unauthorized Access');
          }

        })
        .catch((error) => {

        });

    }




  })
  app.delete('/delete/:_id', (req, res) => {
    
    loanCollection.deleteOne({ _id: ObjectId(req.params._id) })
        .then(result => {
            res.send(result.deletedCount > 0);
        })
      })


    app.get('/bookingList/:_id', (req, res) => {
      loanCollection.find({ _id: ObjectId(req.params._id)})
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
    })


    

  console.log("collection error", err);
});

app.get('/', (req, res) => {
  res.send('Welcome to Loan Service!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})