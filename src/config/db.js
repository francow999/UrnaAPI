const { Pool } = require('pg');
require('dotenv').config(); // Carrega as variáveis do .env

// Cria a configuração do banco usando as variáveis secretas
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Testa a conexão logo na inicialização
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.stack);
    }
    console.log('Conexão com o PostgreSQL estabelecida com sucesso!');
    release(); // Libera o cliente de volta para o Pool
});

// Exporta o pool para ser usado em outras partes do projeto
module.exports = pool;