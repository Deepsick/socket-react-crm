const { join } = require('path');

const express = require('express');
const controller = require(join(__dirname, '..', 'controllers', 'auth'));

const router = express.Router();

router.post('/registration', controller.postRegistration);
router.post('/login', controller.postLogin);
router.post('/refresh-token', controller.postRefreshToken);

module.exports = router;