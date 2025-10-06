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

// ✅ Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-tinderrr.vercel.app",
];

// ✅ Proper, production-safe CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    // allow REST tools / direct requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed for this origin"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// 🧠 Apply CORS middleware BEFORE routes
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight requests
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).send("✅ DevTinder backend is up and running!");
});

// ✅ Connect to DB and start server
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
