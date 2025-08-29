const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
const MONGO_URI = "mongodb+srv://<username>:<Password>@cluster0.ravzlbx.mongodb.net/MessMenu?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

const data = { rating: "5", message: "good" };
app.get("/data", (req, res) => {
  res.json(data);
});

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Feedback = mongoose.model("Feedback", feedbackSchema);

app.post("/feedback", async (req, res) => {
  try {
    const { rating, message, image } = req.body;
    const newfeedback = new Feedback({ rating, message, image });
    const savedFeedback = await newfeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.log("Error saving feedback", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const getallfeedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(getallfeedback);
  } catch (error) {
    console.log("Error fetching expenses", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
  });
});
