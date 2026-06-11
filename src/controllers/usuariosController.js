// Usuários
const db = require('../config/db');
const bcrypt = require('bcrypt');

async function listarUsuarios(req, res) {
    try
    {
        const query = 'SELECT * FROM tb_usuarios';
        const resultado = await db.query(query);
        res.json(resultado.rows);
    } catch(erro)
    {
        console.log(erro);
        res.status().json({ erro : 'Erro interno do servidor.'});
    }
};

async function cadastrarUsuarios(req, res) {
    try
    {
        const {nome, email, senha, tipo} = req.body;
        const senhaHash = await bcrypt.hash(senha, 10);
        const query = "INSERT INTO tb_usuarios (nome, email, senha, tipo) VALUES ($1,$2,$3,$4) RETURNING *";
        const valores = [nome, email, senhaHash, tipo];
        const resultado = await db.query(query, valores);
        const usuariosInserido = resultado.rows[0];
        delete usuariosInserido.senha;

        res.status(201).json(usuariosInserido);

    } catch(erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Não foi possível realizar o cadastro do usuário.'});
    }
};

module.exports = {listarUsuarios, cadastrarUsuarios};