const express = require('express');
const router = express.Router();

const { VerificarToken, VerificarAdmin, VerificarAuditor, VerificarAluno } = require('../middlewares/auth');
const { listarVotos, cadastrarVotos } = require('../controllers/votosController');

router.get('/', VerificarToken, VerificarAuditor, listarVotos);
router.post('/', VerificarToken, VerificarAdmin, cadastrarVotos);

module.exports = router;