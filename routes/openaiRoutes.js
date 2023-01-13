const express = require('express');
const {generateImage, generateVideoScript} = require('../controllers/openaiController');
const router = express.Router();

router.post('/generateimage', generateImage);

router.post('/generateVideoScript', generateVideoScript);

module.exports = router;


