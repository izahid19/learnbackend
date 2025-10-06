require("dotenv").config();
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

// ✅ Allow both localhost and Vercel
const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-tinderrr.vercel.app",
];

// ✅ Proper CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight handler (must come before routes)
app.options(/.*/, cors());

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Test endpoint (for debugging)
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS test successful 🚀" });
});

// ✅ Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ✅ Connect DB and Start Server
connectDB()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection failed:", err);
  });
