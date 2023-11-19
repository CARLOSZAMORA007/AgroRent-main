const express = require('express');
const router = express.Router();
const machinery= require('../controllers/machinery.js');

router.post('/create', machinery.createMachinery)
        .get('/hideMachinery', machinery.getMachinery)
        .get('/filterCategory', machinery.filterCategory)
module.exports = router; 