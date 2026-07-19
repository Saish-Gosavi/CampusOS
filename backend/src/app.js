const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// Module Routes
const hostelRouter = require('./modules/hostel/routes');
const libraryRouter = require('./modules/library/routes');
const inventoryRouter = require('./modules/inventory/routes');

const app = express();

// Standard request parsers & security middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    message: 'College Management Portal Backend is healthy.'
  });
});

// Mount module routers
app.use('/api/v1/hostel', hostelRouter);
app.use('/api/v1/library', libraryRouter);
app.use('/api/v1/inventory', inventoryRouter);

// Undefined API handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
