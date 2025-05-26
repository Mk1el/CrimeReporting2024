const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/models'); // Adjust the path according to your setup

// GET request for registration page
router.get('/', (req, res) => {
    res.render('register');  // Render registration page
});

// POST request for registration form submission
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate the input (you can improve this validation)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the password before storing it
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.execute(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
