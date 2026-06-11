const express = require('express');
const router = express.Router();

const { authAdmin_or_Auditor } = require('../controllers/authController');

router.post('/admin_or_auditor', authAdmin_or_Auditor);

module.exports = router;