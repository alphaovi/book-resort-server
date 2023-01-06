const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5002;
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

        app.get("/book", async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        })

        app.get("/book/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const book = await booksCollection.findOne(query);
            res.send(book);
        })

        // POST

        app.post("/book", async (req, res) => {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook);
            res.send(result);
        })

        // DELETE
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await booksCollection.deleteOne(query);
            res.send(result);
        })


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
