// Login
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Autenticaçã de Alunos ainda em construção.

/*
async function authGoogle(req, res) {
    const { idToken } = req.body;
    try
    {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const emailDoGoogle = payload.email;
        const nomeDoGoogle = payload.name;

        if (!emailDoGoogle.endsWith('@al.educacao.sp.gov.br'))
        {
            return res.status(403).json({ mensagem: 'Acesso negado. Use o email institucional.' });
        }
        //0000(RA)sp@al.educacao.sp.gov.br
        const resultadoRegex = emailDoGoogle.match(/^0000(\d+)sp@/);
        const raExtraido = resultadoRegex ? resultadoRegex[1] : null;

        if (!raExtraido)
        {
            return res.status(400).json({ erro: 'Formato de email institucional inválido.'});
        }
        const buscaAluno = await db.query('SELECT * FROM tb_alunos WHERE tb_alunos.ra =  $1', [raExtraido]);
        if (buscaAluno.rows.length === 0)
        {
            return res.status(404).json({erro: 'Aluno não foi encontrado.'});
        }

        const Aluno = buscaAluno.rows[0];

        if (Aluno.votou)
        {
            return res.status(403).json({erro: 'Seu voto já foi computado nessa eleição.'});
        }

        const TokenUrna = jwt.sign(
            { id: aluno.id, tipo: 'aluno', serie: Aluno.serie},
            process.env.JWT_SECRET,
            { expiresIn: '30m'}
        );

        res.status(200).json({
            mensagem: 'Autenticado com sucesso via Google!',
            token: TokenUrna,
            aluno: {
                nome: Aluno.nome,
                serie: Aluno.serie 
            }
        });
    }
    catch (erro)
    {
        console.error(erro);
        res.status(401).json({ erro: 'Falha na autenticação com o Google.'});
    }
};
*/

async function authAdmin_or_Auditor(req, res) {

    try{
        const {email, senha} = req.body;
        let usuarioEncontrado = null;
        let tipoDeAcesso;

        let resultado = await db.query("SELECT * FROM tb_usuarios WHERE email = $1", [email]);

        if (resultado.rows.length > 0)
        {
            usuarioEncontrado = resultado.rows[0];
            tipoDeAcesso = usuarioEncontrado.tipo;
        }

        if (!usuarioEncontrado)
        {
            return res.status(404).json({erro: 'Não foi possível encontrar usuário.'});
        }

        const senha_valida = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senha_valida)
        {
            return res.status(401).json({erro: 'Senha incorreta.'});
        }

        const token = jwt.sign(
            { id: usuarioEncontrado.id, tipo: tipoDeAcesso },
            process.env.JWT_SECRET,
            { expiresIn: '8h'}
        );

        delete usuarioEncontrado.senha;

        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token: token,
            usuario: usuarioEncontrado,
            tipo: tipoDeAcesso
        });

    } catch (erro)
    {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno ao realizar o login'});
    }
};

// Assim que implementar o login do aluno, exportá-lo para o router.
module.exports = {authAdmin_or_Auditor};