import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js"; // Import the prisma instance

const PORT = env.port;

// Test the database connection on startup
prisma.$connect()
  .then(() => {
    console.log("[Database] Connected successfully to MySQL via Prisma! 🎉");
  })
  .catch((err) => {
    console.error("[Database] Prisma connection failed! 💥", err.message);
  });

const server = app.listen(PORT, () => {
  console.log(`[Server] CampusOS Portal backend running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

