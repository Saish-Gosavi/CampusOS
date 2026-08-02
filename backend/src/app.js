import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";

// Import Custom Middlewares
import notFoundMiddleware from "./middleware/notFound.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

// Import Routers
import authRouter from "./modules/auth/routes/auth.routes.js";
import usersRouter from "./modules/users/routes/users.routes.js";
import hostelRouter from "./modules/hostel/routes.js";
import dashboardRouter from "./modules/dashboard/routes/dashboard.routes.js";
import settingsRouter from "./modules/settings/routes/settings.routes.js";
import noticeRouter from "./modules/notice/routes/notice.routes.js";

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS configurations
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));

// 3. Logger configurations (Only log format in dev)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 4. Gzip Compression
app.use(compression());

// 5. Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 6. Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    message: "CampusOS Portal Backend is healthy.",
  });
});

// Register routers
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/hostel", hostelRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/super_admin/global-notice", noticeRouter);

// 7. Undefined route handling (404)
app.use(notFoundMiddleware);

// 8. Global exception handling (500)
app.use(errorMiddleware);

export default app;
