//Professores 
const db = require('../config/db');

async function listarProfessores(req, res)
{
    try
    {
        const resultado = await db.query('SELECT * FROM tb_professores');
        res.json(resultado.rows);
    } catch (erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }   
};

async function cadastrarProfessores(req, res) {
    try {
        const { nome, descricao } = req.body;
        const query = 'INSERT INTO tb_professores (nome, descricao) VALUES ($1,$2) RETURNING *';
        const valores = [nome, descricao];

        const resultado = await db.query(query, valores);
        res.status(201).json(resultado.rows[0]);
    } catch (erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar professor' });
    }
};

async function deletarProfessores(req, res) {
    try{
        const {id} = req.params;
        await db.query("DELETE FROM tb_votos WHERE id = $1", [id]);
        const resultado = await db.query("DELETE FROM tb_professores WHERE id = $1 RETURNING *", [id]);
        if (resultado.rowCount == 0)
        {
            return res.status(404).json({ mensagem: 'Não há professores a serem deletados.'});
        }
        res.json({ mensagem: `Professor ${resultado.rows[0].nome} e seus votos foram removidos.`});
    } catch(erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao deletar professor.'});
    }
};

module.exports = {listarProfessores, cadastrarProfessores, deletarProfessores};