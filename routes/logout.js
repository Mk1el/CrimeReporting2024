const express = require('express');
const router = express.Router();

// Handle GET request to /logout
router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');  
    });
});

module.exports = router;
