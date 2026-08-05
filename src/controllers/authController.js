// Login
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {enviarEmail} = require('../services/emailService');
const crypto = require('crypto');

// Autenticaçã de Alunos ainda em construção.

async function solicitarOTP(req, res) {
    try
    {
        const {ra} = req.body;
        
        //OTP + OTP_Data
        const codigo = crypto.randomInt(100000, 999999);
        const dataCriacao = (new Date()).toISOString();
        const verifica = await db.query('SELECT * FROM tb_alunos WHERE ra = $1', [ra]);  
        //Verificamos se existe o código OTP para evitar emails desnecessários...
        if (verifica.rows.length === 0)
        {
            return res.status(404).json({mensagem: 'Aluno não encontrado'});
        }
        const Aluno = verifica.rows[0];
        if (Aluno.otp_data !== null)
        {
            const otpdata = new Date(Aluno.otp_data);
            const agora = new Date();
            const diferenca = Math.abs(otpdata.getTime() - agora.getTime());

            if (Aluno.otp !== null && diferenca < 600000)
            {
                return res.status(400).json({erro: `O OTP já existe! Verifique a caixa de entrada
                    de emails ou espere 10 minutos para solicitar outro código.`});
            }

        }
        if(Aluno.votou)
        {
            return res.status(403).json({erro: `Aluno já votou nesta eleição.`});
        }
        //Em seguida, mandamos um código para o email do RA fornecido e também marcamos os dados no banco.
        const banco = await db.query(`UPDATE tb_alunos SET otp = $1, otp_data = $2 WHERE ra = $3`, [codigo, dataCriacao, ra]);
        await enviarEmail(ra, codigo);
        res.status(200).json({
            mensagem: 'OTP solicitado com sucesso!'
        });
    } catch(erro)
    {
        console.log(erro);
        res.status(500).json({erro: 'Não foi possível solicitar o OTP.'});
    }
}

async function verificarOTP(req, res)
{
    //Necessário verificar:
    //Comparação entre a data do otp e a data de verificação
    //Verificar se o OTP está de acordo.
    try {
        const {ra, otp} = req.body;
        const verifica_otp = await db.query('SELECT * FROM tb_alunos WHERE otp = $1 AND ra = $2', [otp, ra]);
        if (verifica_otp.rows.length === 0)
        {
            return res.status(400).json({mensagem: 'Não foi possível encontrar o OTP.'});
        }
        const Aluno = verifica_otp.rows[0];
        const otpdata = new Date(Aluno.otp_data);
        const agora = new Date();
        const diferenca = Math.abs(otpdata.getTime() - agora.getTime());
        if(diferenca >= 600000)
        {
            return res.status(400).json({mensagem: 'O OTP passou de dez minutos! Crie outra requisição de email.'});
        }
        //Até aqui, encontramos um OTP válido, o que significa que podemos validar o login do aluno.
        if (Aluno.votou)
        {
            return res.status(403).json({mensagem: `Seu voto já foi computado nesta eleição.`});
        }

        const deletar = await db.query(`UPDATE tb_alunos SET otp = NULL, otp_data = NULL WHERE ra = $1`, [ra]);

        const TokenUrna = jwt.sign(
            { id: Aluno.id, tipo: 'aluno', serie: Aluno.serie},
            process.env.JWT_SECRET,
            { expiresIn: '30m'}
        );

        res.status(200).json({
            mensagem: 'Autenticado com sucesso via OTP!',
            token: TokenUrna,
            aluno: {
                nome: Aluno.nome,
                serie: Aluno.serie 
            }
        });
    } catch(erro)
    {
        console.log(erro);
        return res.status(500).json({erro: 'Não foi possível verificar o OTP.'});
    }
}

//Autenticação de Admin ou Auditor

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

module.exports = {authAdmin_or_Auditor, solicitarOTP, verificarOTP};