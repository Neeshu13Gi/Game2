// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect("mongodb+srv://neeshu:YC7pQ0Unf32NKHi7@neeshu.cwxzomm.mongodb.net/Game2?retryWrites=true&w=majority&appName=neeshu", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB error:', err));

// // Schema
// const PlayerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   score: Number,
// });
// const Player = mongoose.model('Player', PlayerSchema);

// // Endpoint 1: Save user details and return the ID
// app.post('/submit', async (req, res) => {
//   console.log('Received user data:', req.body);
//   const { name, email, phone } = req.body;
//   try {
//     const newPlayer = new Player({ name, email, phone, score: 0 });
//     await newPlayer.save();
//     res.json({ message: 'User data saved!', id: newPlayer._id });
//   } catch (err) {
//     res.status(500).json({ error: 'Error saving user data' });
//   }
// });

// // ✅ Endpoint 2: Update score using _id later
// app.patch("/save-score", async (req, res) => {
//   const { id, score } = req.body;

//   if (!id || typeof score === "undefined") {
//     return res.status(400).json({ error: "Missing id or score" });
//   }

//   try {
//     const updated = await Player.findByIdAndUpdate(id, { score }, { new: true });
    

//     if (!updated) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({ message: "Score updated", user: updated });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// });


// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });











require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://neeshu:YC7pQ0Unf32NKHi7@neeshu.cwxzomm.mongodb.net/Game2?retryWrites=true&w=majority&appName=neeshu", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

// Schema
const PlayerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  score: Number,
  stars: Number // ✅ ADD this if not added yet
});


const Player = mongoose.model('Player', PlayerSchema);

// Endpoint 1: Save user details and return the ID
app.post('/submit', async (req, res) => {
  console.log('Received user data:', req.body);
  const { name, email, phone } = req.body;
  try {
    const newPlayer = new Player({ name, email, phone, score: 0 });
    await newPlayer.save();
    res.json({ message: 'User data saved!', id: newPlayer._id });
  } catch (err) {
    res.status(500).json({ error: 'Error saving user data' });
  }
});

// ✅ Endpoint 2: Update score using _id later
app.patch("/save-score", async (req, res) => {
  const { id, score, stars } = req.body;

  if (!id || typeof score === "undefined" || typeof stars === "undefined") {
    return res.status(400).json({ error: "Missing id, score or stars" });
  }

  try {
    const updated = await Player.findByIdAndUpdate(id, { score, stars }, { new: true });


    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Score and stars updated", user: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});



// Admin Login Page (Simple UI)
app.get('/admin-login', (req, res) => {
  res.send(`
    <html>
      <head><title>Admin Login</title></head>
      <body>
        <h2>Enter Admin Password</h2>
        <form onsubmit="event.preventDefault(); login();">
          <input type="password" id="pwd" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <script>
          function login() {
            const pwd = document.getElementById('pwd').value;
            window.location.href = '/admin?password=' + encodeURIComponent(pwd);
          }
        </script>
      </body>
    </html>
  `);
});

// Admin Dashboard Route with password protection
app.get('/admin', async (req, res) => {
  const adminPassword = 'Ubik@123'; // Set your admin password her

  // Check if the password provided in the query parameter is correct
  if (req.query.password !== adminPassword) {
    return res.status(401).send('Unauthorized. Incorrect password.');
  }

  try {
    const players = await Player.find(); // Fetch all player records from MongoDB
    res.send(`
      <html>
        <head>
          <title>Admin Dashboard</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Admin Dashboard</h1>
          <table>
            <tr><th>Email</th><th>Score</th><th>Phone Number</th><th>Feedback Stars</th></tr>
            ${players.map(player => `
              <tr>
                <td>${player.email}</td>
                <td>${player.score}</td>
                <td>${player.phone}</td>
                <td>${player.stars}</td>
              </tr>`).join('')}
          </table>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error fetching player data');
  }
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


