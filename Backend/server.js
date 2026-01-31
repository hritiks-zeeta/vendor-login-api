const express = require("express");
const cors = require("cors");
const path = require("path");
const { loginUser } = require("./sheets");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../Frontend")));

// Login API
app.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        status: "error",
        message: "UserID and Password are required"
      });
    }

    const result = await loginUser(userId, password);
    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error"
    });
  }
});

// ROOT ROUTE ✅
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/Index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});