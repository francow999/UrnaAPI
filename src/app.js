const express = require('express');
const app = express();
app.use(express.json());

// Intermediário entre o controller e o próprio server.

//Alunos
app.use('/alunos', require('./routes/alunosRoutes'));

//Professores
app.use('/professores', require('./routes/professoresRoutes'));

//Votos
app.use('/votos', require('./routes/votosRoutes'));

//Autenticação
app.use('/auth', require('./routes/authRoutes'));

//Usuários
app.use('/usuarios', require('./routes/usuariosRoutes'));

//Resultados
app.use('/resultados', require('./routes/resultadosRoutes'));

module.exports = app;