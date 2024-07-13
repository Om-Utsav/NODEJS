const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user');

// Custom Error Class (advanced)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // For differentiating operational errors

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global Error Handling Middleware (advanced)
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (advanced)
  console.error(err.stack);

  // Set appropriate status code based on error type (advanced)
  let statusCode = 500; // Internal Server Error (default)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') { // Handle Mongoose validation errors
    statusCode = 400; // Bad Request
    err.message = 'Validation failed: ' + JSON.stringify(err.errors, null, 2);
  } else if (err.name === 'CastError') { // Handle Mongoose casting errors (e.g., invalid ID)
    statusCode = 400; // Bad Request
    err.message = 'Invalid data format';
  } else if (err.name === 'MongoError' && err.code === 11000) { // Handle duplicate key errors
    statusCode = 409; // Conflict
    err.message = 'Duplicate key error';
  }

  // Send a user-friendly error message back to the client (advanced)
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error', // Provide a fallback message
    status: statusCode,
  });
};

// Connect to MongoDB (assuming you have a connection string)
mongoose.connect('mongodb://localhost:3000/omutsav', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const app = express();
app.use(express.json()); // Parse incoming JSON data

// CRUD Routes with Error Handling (using async/await and error handling middleware)

// Create
app.post('/users', async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser); // Created (201) status code
  } catch (err) {
    next(new AppError('Error creating user', 400)); // Pass to global error handler
  }
});

// Read All
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(new AppError('Error retrieving users', 500));
  }
});

// Read One
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  } catch (err) {
    next(err); // Pass error to global handler for consistent handling
  }
});

// Update
app.put('/users/:id', async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Return updated data
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});
