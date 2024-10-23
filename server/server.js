require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const contactsRoutes = require("./routes/contacts");

app.use("/api/contacts", contactsRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

if (!HUBSPOT_API_KEY) {
  console.error("HUBSPOT_API_KEY is not set in environment variables");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Environment variables loaded:", {
    HUBSPOT_API_KEY: HUBSPOT_API_KEY ? "Present" : "Missing",
  });
});
