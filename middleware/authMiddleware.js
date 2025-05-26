const express = require('express');
const router = express.Router();

function authMiddleware(req, res, next) {
    // Check if session id exists
    if (!req.session.id) {
        return res.redirect('/login'); // Redirect to login if no session id
    }
    next();  // Proceed to the next middleware or route
}
module.exports = function (req, res, next) {
    if (!req.session.id) {
        return res.redirect('/login');  // If no session id, redirect to login page
    }
    next();
};

