const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Portal backend running on port ${PORT}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

