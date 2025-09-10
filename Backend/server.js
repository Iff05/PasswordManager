import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json()); // built-in, no need for body-parser
app.use(cors());
// MongoDB connection
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'passop';

// Connect to MongoDB before starting server
await client.connect();
console.log("✅ Connected to MongoDB");

// Get all the passwords
app.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a password
app.post('/', async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    await collection.insertOne(password);
    res.send({ success: true, data: password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a password (by id or some field)
app.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id; // expects an identifier
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ success: true, message: "Deleted successfully" });
    } else {
      res.json({ success: false, message: "No document found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
