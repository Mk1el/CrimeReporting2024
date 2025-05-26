// routes/profile.js
const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

// GET request for the profile page
router.get('/profile', profileController.getProfile);

// POST request for updating the profile
router.post('/profile', profileController.updateProfile);

module.exports = router;
