const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5002;
// JWT Token 
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json())

// Database Connction
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://booksaw:wW6aWE7fYPIlJ2il@complete-projects.f8rypku.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const booksCollection = client.db("booksaw").collection("book");
        // order collection
        const orderCollection = client.db("booksaw").collection("order");

        // AUTH
        app.post("/login", async(req, res) => {
            const user = req.body;
            const accesToken = jwt.sign(user, "89e8a8d9ec14fa879dd8e27f61019868a4e62ccd06dccf589acd7a10f17252154098a3da34ee92d7ecc67308ac19767f3eb72468ff4034dcf89b41e8587d8ce7", {
                expiresIn: "1d"
            });
            res.send({accesToken})
        })

        // find the books from the server
        app.get("/book", async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })

        // find the individual book for detail purpose
        app.get("/book/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const book = await booksCollection.findOne(query);
            res.send(book);
        })

        // POST API for add new product

        app.post("/book", async (req, res) => {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result);
        })

        // DELETE or remove books from the database
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.deleteOne(query);
            res.send(result);
        })

        // get the orders list from the database for collection the order which are stored in the database

        app.get("/order", async(req, res) => {

            const email = req.query.email;
            console.log(email);
            const query = {email: email}; 
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // order inserted api (create order collection api for store the orders)
        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        // pagination api
        // app.get("/bookCount", async (req, res) => {
        //     const query = {};
        //     const cursor = booksCollection.find(query);
        //     const count = await cursor.count();
        //     //  One to convert in JSON file
        //     //  res.json(count) 
        //     res.send({ count });
        // })

    }
    finally {

    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Booksaw server is running")
})

app.listen(port, () => {
    console.log("We are listening PORT", port)
})
