const express = require("express");
const emailHelper = require("./emailHelper");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let info = await emailHelper(to, subject, text);
    res.status(200).send(`Email sent: ${info.response}`);
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});

