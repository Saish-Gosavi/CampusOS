import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.port;

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
