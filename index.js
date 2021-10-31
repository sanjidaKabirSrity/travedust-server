const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleWare 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bonkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("travedust_data");
      const dataCollection = database.collection("packages");
      const servicesCollection = database.collection("services");
      const bookingCollection = database.collection("booking");

      // GET Package API
      app.get('/packages' , async(req, res) => {
        const cursor = dataCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
      })

      // GET Single Package API
      app.get('/packages/:id' , async(req, res) => {
        const id = req.params.id;
        console.log("Getting specific packages " , id);
        const query = {_id:ObjectId(id)};
        const package = await dataCollection.findOne(query);
        console.log('load user with id', id);
        // res.send(package);
        res.json(package);
      })

      // const ser = {
      //   googl:"Wide Variety of Tours",
      //   descrip:"We offer a wide variety of personally picked tours with destinations a...",
      //   icon:"fab fa-watchman-monitoring"
      // }
      // const result = await bookingCollection.insertOne(ser);
      // console.log(`ser : ${result.insertedId}`);

      // GET Services API
      app.get('/services' , async(req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      })

      // GET Booking API
      app.get('/booking' , async(req, res) => {
        const cursor = bookingCollection.find({});
        const booking = await cursor.toArray();
        res.send(booking);
      })

       // Post Package Api
       app.post('/packages', async(req, res) => {
        const newPackage = req.body;
        console.log('hitting the post')
        const result = await dataCollection.insertOne(newPackage);
        console.log('got new post' , req.body);
        console.log('added user ' , result);
        res.json(result);
      })

      // Post Booking Api
      app.post('/booking' , async(req , res) => {
        const newBooking = req.body;
        console.log('Booking' , newBooking);
        const result = await bookingCollection.insertOne(newBooking);
        // res.send('Booking Processed');
        res.json(result);
    })

    } finally {
      // await client.close();
    }
  }
run().catch(console.dir);

app.get('/' , (req , res) => {
    res.send("Running Travedust Server");
});

app.listen(port , () => {
    console.log("Running server on port " , port);
})