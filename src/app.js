const express = require('express');
const app = express();
app.use(express.json());

// Intermediário entre o controller e o próprio server.

app.use('/alunos', require('./routes/alunosRoutes'));
app.use('/professores', require('./routes/professoresRoutes'));
app.use('/votos', require('./routes/votosRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/usuarios', require('./routes/usuariosRoutes'));

module.exports = app;