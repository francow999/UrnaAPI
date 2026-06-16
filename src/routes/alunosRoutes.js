const express = require('express');
const router = express.Router();

/*
Usamos o router para listar as funções dos controllers e depois
enviamos esse router para o app, com o objetivo de centralizar tudo.
*/

// Puxamos as funções de MiddleWare e Token
const { VerificarToken, VerificarAdmin, VerificarAuditor } = require('../middlewares/auth');
// Junto com as funções do controller específico (Nesse caso, os alunos).
const { listarAlunos, cadastrarAlunos } = require('../controllers/alunosController');

//Então, passamos os middlewares com as funções no determinado papel (get, post, etc).
router.get('/', VerificarToken, VerificarAuditor, listarAlunos);
router.post('/', VerificarToken, VerificarAdmin, cadastrarAlunos);

module.exports = router;