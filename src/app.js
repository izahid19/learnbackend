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

const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-tinderrr.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// ✅ optional fallback (regex instead of "*")
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "CORS test successful 🚀" });
});

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Something went wrong while connecting to DB:", err);
  });
