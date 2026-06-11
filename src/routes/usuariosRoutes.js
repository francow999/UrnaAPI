const express = require('express');
const router = express.Router();

const {cadastrarUsuarios, listarUsuarios} = require('../controllers/usuariosController');

router.post('/', cadastrarUsuarios);
router.get('/', listarUsuarios);

module.exports = router;