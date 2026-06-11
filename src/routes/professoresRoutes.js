const express = require('express');
const router = express.Router();

const { VerificarToken, VerificarAdmin, VerificarAuditor } = require('../middlewares/auth');
const { listarProfessores, deletarProfessores, cadastrarProfessores } = require('../controllers/professoresController');

router.get('/', VerificarToken, VerificarAuditor, listarProfessores);
router.post('/', VerificarToken, VerificarAdmin, cadastrarProfessores);
router.delete('/:id', VerificarToken, VerificarAdmin, deletarProfessores);

module.exports = router;