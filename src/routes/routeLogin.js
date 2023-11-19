const express = require('express');
const router = express.Router();
const users= require('../controllers/login.js');

router.post('/login', users.login)
        .post('/recovery',users.recoverPassword)
        
module.exports = router; 