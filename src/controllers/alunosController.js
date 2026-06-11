//Alunos
const express = require('express');
const db = require('../config/db');

async function listarAlunos(req, res)  {
    try 
    {
        const resultado = await db.query('SELECT * FROM tb_alunos');
        res.json(resultado.rows);

    } catch(erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
};

async function cadastrarAlunos(req, res)  {
    try 
    {
        const {nome, email, ra, serie} = req.body;
        const votou = false;

        const query = "INSERT INTO tb_alunos (nome,email,ra,votou,serie) VALUES ($1,$2,$3,$4,$5) RETURNING *";
        const valores = [nome, email, ra, votou, serie];
        const resultado = await db.query(query, valores);

        const aluno_criado = resultado.rows[0];

        res.status(201).json(aluno_criado);
    } catch(erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar aluno' });
    }
};

module.exports = {listarAlunos, cadastrarAlunos};