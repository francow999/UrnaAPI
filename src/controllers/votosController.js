//Votos
const db = require('../config/db');

async function listarVotos(req, res) {
    try{
        const resultado = await db.query("SELECT * FROM tb_votos");
        res.json(resultado.rows);
    } catch (erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
};

async function cadastrarVotos(req, res) {
    try
    {
        const aluno_id = req.usuarioLogado.id;
        const usuario_tipo = req.usuarioLogado.tipo;
        const {professores_id} = req.body;

        if (!professores_id || professores_id.length !== 5)
        {
            return res.status(400).json({ erro: 'A quantidade de professores deve ser 5!'});
        }

        const checagem = await db.query("SELECT votou FROM tb_alunos WHERE id = $1", [aluno_id]);
        if (checagem.rows[0].votou === true)
        {
            return res.status(403).json({erro: 'Você já registrou seu voto!'});
        }
        for (let i = 0; i < 5; i++)
        {
            const posicao = 5-i;
            const query = "INSERT INTO tb_votos (aluno_id, professor_id, posicao) VALUES ($1,$2,$3)";
            const valores = [aluno_id, professores_id[i], posicao];
            await db.query(query, valores);
        }

        await db.query("UPDATE tb_alunos SET votou = true WHERE id = $1", [aluno_id]);

        res.status(201).json({mensagem: 'Voto registrado com sucesso!'});

    } catch (erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar votos.'});
    }
};

module.exports = {listarVotos, cadastrarVotos};