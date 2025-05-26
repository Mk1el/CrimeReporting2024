const express = require('express');
const db = require('../config/models'); 
const registerController = require('../controllers/register');
const router = express.Router();

router.post('/' ,registerController.login)
module.exports = router;
