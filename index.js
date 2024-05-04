const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const fs = require('fs')

const mongoURI = 'mongodb+srv://root:root@cluster0.61nbye5.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .catch((err) => console.error("MongoDB connection error", err));

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
});
const User = mongoose.model("Id", userSchema);

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "star.html"));
  });
  
  app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "signin.html"));
  });
  app.get("/login", (req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "Login.html"));
    });
    app.get("/dest", (req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "hotel(states).html"));
    });
    app.get("/hotels", (req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "hotel(main).html"));
    });
    app.get("/feedback", (req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "feedback.html"));
    });
    app.get("/punjab", (req, res) => {
      res.sendFile(path.join(__dirname, "frontend", "punjab(main).html"));
    });
    
    
    app.post("/sign", async (req, res) => {
      try {
        const _id = await getNextSequence();
        const { name, email, password } = req.body;
        const newUser = new User({ _id, name, email, password });
        const savedUser = await newUser.save();
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.post('/log', async (req, res) => {
        const { email, password } = req.body;
        try {
            
            const user = await User.findOne({ email, password });
            if (user) {
                res.json({ success: true, message: "Congratulations ${user.name}, you have successfully logged in", user });
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } catch (error) {
            
            console.error('Error finding user:', error);
            res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }
    });

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String
});


const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submit-feedback', async (req, res) => {
  const feedbackData = req.body;


  const feedback = new Feedback(feedbackData);


  feedback.save()
      .then(() => {
          console.log('Feedback saved successfully');
          res.sendStatus(200); 
      })
      .catch((error) => {
          console.error('Error saving feedback:', error);
          res.sendStatus(500); 
      });
});
async function getNextSequence() {
  const userCount = await User.countDocuments();
  return userCount + 1;
}


const PORT = 3001;
app.listen(PORT);