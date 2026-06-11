const express = require('express');
const router = express.Router();

const { VerificarToken, VerificarAdmin, VerificarAuditor } = require('../middlewares/auth');
const { listarAlunos, cadastrarAlunos } = require('../controllers/alunosController');

router.get('/', VerificarToken, VerificarAuditor, listarAlunos);
router.post('/', VerificarToken, VerificarAdmin, cadastrarAlunos);

module.exports = router;