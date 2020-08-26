const express = require('express');

const { convertFile } = require('../controllers/filetotext');

const router = express.Router();

router.post('/', convertFile);

module.exports = router;