const express = require( "express");
const morgan = require( "morgan");
const helmet = require( "helmet");
const cors = require( "cors");
const cookieParser = require( "cookie-parser");
const errorMiddleware = require("./middleware/errorHandler");
const authRoutes = require( "./models/Auth/auth.routes");
const ebookRoutes = require("./models/Ebook/ebook.routes");
const adminRoutes = require("./models/Admin/admin.routes");
// const userRoutes = require( "./modules/user/user.routes.js");

const app = express();

// Security Middlewares
app.use(helmet());  
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// Logger (only in dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ebooks", ebookRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/users", userRoutes);

app.use(errorMiddleware);

module.exports = app;
