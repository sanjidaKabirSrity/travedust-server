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

client.connect(err => {
    const collection = client.db('travedust_data').collection("packages");
    console.log('Hitting the database');
    client.close();
})

async function run() {
    try {
      await client.connect();
      const database = client.db("travedust_data");
      const dataCollection = database.collection("packages");

      const doc = {name:"nadia", email:"nadiaaktaer@gmail.com"}

      const result = await dataCollection.insertOne(doc);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);

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