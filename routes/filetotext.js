const express = require('express');

const { convertFile, convertFileWithAWS } = require('../controllers/filetotext');

const router = express.Router();

router.post('/', convertFile);
router.post('/use_aws', convertFileWithAWS)

module.exports = router;