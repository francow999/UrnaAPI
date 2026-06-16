//Relatório de Resultados
const db = require('../config/db');

async function listarResultados(req, res) {
    try {
        // Pedimos para o banco contar os votos separando pelas "posições" (pesos)
        const query = `SELECT 
        p.id, 
        p.nome, 
        SUM(CASE WHEN v.posicao = 1 THEN 1 ELSE 0 END) AS votos_1_lugar,
        SUM(CASE WHEN v.posicao = 2 THEN 1 ELSE 0 END) AS votos_2_lugar,
        SUM(CASE WHEN v.posicao = 3 THEN 1 ELSE 0 END) AS votos_3_lugar,
        SUM(CASE WHEN v.posicao = 4 THEN 1 ELSE 0 END) AS votos_4_lugar,
        SUM(CASE WHEN v.posicao = 5 THEN 1 ELSE 0 END) AS votos_5_lugar
        FROM 
            tb_professores p
        LEFT JOIN 
            tb_votos v ON p.id = v.professor_id
        GROUP BY 
            p.id, p.nome;
        `;

        const resultado = await db.query(query);
        const dados = resultado.rows;

        // Agora, nós separamos os dados no formato exato de "5 listas"
        const relatorioFinal = {
            lista_1_lugar: [...dados].sort((a, b) => b.votos_1_lugar - a.votos_1_lugar),
            lista_2_lugar: [...dados].sort((a, b) => b.votos_2_lugar - a.votos_2_lugar),
            lista_3_lugar: [...dados].sort((a, b) => b.votos_3_lugar - a.votos_3_lugar),
            lista_4_lugar: [...dados].sort((a, b) => b.votos_4_lugar - a.votos_4_lugar),
            lista_5_lugar: [...dados].sort((a, b) => b.votos_5_lugar - a.votos_5_lugar)
        };

        res.status(200).json(relatorioFinal);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno ao gerar o ranking da eleição.' });
    }
};

async function listarResultadosNominal(req, res) {
    const {serie, posicao} = req.params;
    try
    {
        const query = `
            SELECT 
                tb_alunos.serie, 
                tb_alunos.nome AS nome_aluno, 
                tb_professores.nome AS nome_professor
            FROM 
                tb_votos 
            JOIN 
                tb_alunos ON tb_votos.aluno_id = tb_alunos.id
            JOIN 
                tb_professores ON tb_votos.professor_id = tb_professores.id
            WHERE 
                tb_alunos.serie = $1 AND tb_votos.posicao = $2
            ORDER BY 
                tb_alunos.nome ASC;
        `;
        const resultado = await db.query(query, [serie, posicao]);

        res.status(200).json({
            relatorio: `Relatório da Opção ${posicao}`,
            turma: `${serie}`,
            total_votos: resultado.rowCount,
            lista: resultado.rows
        });
    } catch(erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao gerar o relatório nominal'});
    }
};

module.exports = {listarResultados, listarResultadosNominal};