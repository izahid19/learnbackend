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
const PORT = 7777;

const allowedOrigins = [
  "http://localhost:5173",           // Local dev
  "https://dev-tinderrr.vercel.app", // Vercel frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests globally
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.patch("/api/test", (req, res) => {
  res.json({ success: true, data: req.body, message: "CORS works ✅" });
});

// ✅ DB connection + server start
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