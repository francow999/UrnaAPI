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

        //Checamos se o professor existe
        const professor = await db.query("SELECT * FROM tb_professores WHERE id = $1", [id]);
        if (professor.rowCount === 0)
        {
            return res.status(404).json({erro: 'Professor não encontrado.'});
        }

        //Se existe, verificamos se existem votos relacionados.
        const votos = await db.query("SELECT COUNT(*) FROM tb_votos WHERE professor_id = $1", [id]);
        const total_votos = parseInt(votos.rows[0].count);
        
        //Se possui, retiramos os votos
        if (total_votos > 0)
        {
            await db.query("DELETE FROM tb_votos WHERE id = $1", [id]);
        }

        //E então, deletamos o professor.
        const resultado = await db.query("DELETE FROM tb_professores WHERE id = $1 RETURNING *", [id]);
        res.json({ mensagem: `Professor ${resultado.rows[0].nome} e seus votos foram removidos.
            Total de votos removidos: ${total_votos}`});
    } catch(erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao deletar professor.'});
    }
};

module.exports = {listarProfessores, cadastrarProfessores, deletarProfessores};