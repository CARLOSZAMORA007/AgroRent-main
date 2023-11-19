const express = require('express');
const router = express.Router();
const users= require('../controllers/users.js');

router.get('/users', users.getUsers)
        .post('/create', users.createUsers)
        .put('/update', users.pacthUser)
        .patch('/hideUser', users.updateStatus)
        .get('/filterIdUsuario', users.filterIdUser)
module.exports = router; 