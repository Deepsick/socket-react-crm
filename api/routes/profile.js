const { join } = require('path');

const express = require('express');
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) =>  {
      cb(null, 'public/assets/img/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const controller = require(join(__dirname, '..', 'controllers', 'profile'));
const router = express.Router();

router.get('/', controller.getProfile);
router.patch('/', upload.single('avatar'), controller.patchProfile);

module.exports = router;
