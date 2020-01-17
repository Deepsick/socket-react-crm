const { join } = require('path');

const express = require('express');
const router = express.Router();

const controller = require(join(__dirname, '..', 'controllers', 'user'));

router.get('/', controller.getUsers);
router.delete('/:id', controller.deleteUser);
router.patch('/:id/permission', controller.patchPermission);

module.exports = router;