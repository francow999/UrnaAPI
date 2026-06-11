const express = require('express');
const router = express.Router();

const { VerificarToken, VerificarAdmin, VerificarAuditor } = require('../middlewares/auth');
const { listarResultados, listarResultadosNominal } = require('../controllers/resultadosController');

router.get('/', VerificarToken, VerificarAuditor, listarResultados);
router.get('/:serie/:posicao', VerificarToken, VerificarAuditor, listarResultadosNominal);

module.exports = router;