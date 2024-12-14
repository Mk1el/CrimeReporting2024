const express = require('express');
const router = express.Router();

// GET route for the landing page
router.get('/', (req, res) => {
    res.render('index'); // Render the landing page
});

// Optional: Add more routes for about, contact, etc.
router.get('/about', (req, res) => {
    res.render('about'); // Create an about page
});
router.get('/register', (req,res)=>{
    res.render('register');
})
router.get('/login', (req,res)=>{
    res.render('login');
})
router.get('/report',(req,res)=>{
    res.render('report');
})
router.get('/contact',(req,res)=>{
    res.render('contact');
})
module.exports = router;
