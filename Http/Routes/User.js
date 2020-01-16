const express = require('express');
const router = express.Router();
const userController = require('../Controllers/Users');

// Routes related to User

// Get all users
router.get("/users", userController.getAllUsers);

// Create a new user
router.post("/users", userController.createUser);

// Get a single user
router.get("/users/:id", userController.getSingleUser);

// Delete a single user
router.delete("/users/:id", userController.deleteUser);


// Create subscription for user
router.post("/users/:id/subscriptions", userController.createSubscriptionForUser);


// Todo: route to delete subscription

module.exports = router;
