// Middleware do Token
const jwt = require('jsonwebtoken');
const express = require('express');

function VerificarToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
    {
        return res.status(401).json({erro: 'Acesso negado.'});
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        req.usuarioLogado = decodificado;
        next();
    } catch(erro)
    {
        res.status(403).json({ erro: 'Sessão expirada ou Token inválido. Faça login novamente.'});
    }
}

// Middleware para validação de usuários.

function VerificarAluno(req, res, next)
{
    if (req.usuarioLogado.tipo !== 'aluno')
    {
        return res.status(403).json({erro: "Apenas alunos podem acessar."});
    }
    next();
}

function VerificarAdmin(req, res, next)
{
    if (req.usuarioLogado.tipo !== 'admin')
    {
        return res.status().json({erro: 'Apenas amdins podem acessar.'});
    }
    next();
}

function VerificarAuditor(req, res, next){
    if(req.usuarioLogado.tipo !== 'admin' && req.usuarioLogado.tipo !== 'auditor')
    {
        return res.status().json({erro: 'Apenas auditores ou admins podem acessar.'});
    }
    next();
}

module.exports = {VerificarAdmin, VerificarAluno, VerificarAuditor, VerificarToken};