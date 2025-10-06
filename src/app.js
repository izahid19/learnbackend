require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./router/auth.js");
const { profileRouter } = require("./router/profile.js");
const { requestRouter } = require("./router/request.js");
const { userRouter } = require("./router/user.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 7777;

// ✅ Allowed frontend URLs (update if needed)
const allowedOrigins = [
  "http://localhost:5173",            // local dev
  "https://dev-tinderrr.vercel.app"   // production frontend on Vercel
];

// ✅ Simplified and reliable CORS setup
const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // allow cookies / auth headers
};

// ✅ Enable CORS for all routes
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// ✅ Body parser & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ✅ Basic health check route (optional but helpful)
app.get("/", (req, res) => {
  res.send("✅ Backend is running fine!");
});

// ✅ Connect to DB & start server
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err);
  });
