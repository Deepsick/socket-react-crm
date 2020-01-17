const { join } = require('path');

const express = require('express');
const controller = require(join(__dirname, '..', 'controllers', 'news'));

const router = express.Router();

router.get('/', controller.getNews);
router.post('/', controller.postNews);
router.patch('/:id', controller.patchNews);
router.delete('/:id', controller.deleteNews);

module.exports = router;
