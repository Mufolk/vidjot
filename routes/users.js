const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//User Login Route
router.get('/users/login', (req,res) => {
    res.send('login');
});

//User Register Route
router.get('/users/register', (req,res) => {
    res.send('register');
});

module.exports = router;