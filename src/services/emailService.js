const nodemailer = require('nodemailer');

const usuario = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    auth: {
        user: `${usuario}`,
        pass: `${password}`
    }
});

async function enviarEmail(ra, codigo)
{
    //0000(RA)sp@al.educacao.sp.gov.br
    const email = '0000' + ra + 'sp@al.educacao.sp.gov.br';
    transport.sendMail({
        from: `Votacao <${usuario}>`,
        to: `${email}`,
        subject: `Código de Login`,
        text: `Este é o seu código de login: ${codigo}. Use ele para logar no sistema usando o seu RA.
        Fique atento, pois este código tem apenas 10 minutos de validade!`
    })
    .then((response) => console.log('Email enviado com sucesso.'))
    .catch((erro) => console.log('Erro ao enviar emaiL: ', erro));
}

module.exports = {enviarEmail};