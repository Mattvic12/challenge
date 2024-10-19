const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Rota para buscar os repositórios de C# mais antigos do GitHub
app.get('/repos', async (req, res) => {
    try {
        const response = await axios.get('https://api.github.com/search/repositories', {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            },
            params: {
                q: 'language:C#',
                sort: 'created',
                order: 'asc',
                per_page: 5
            }
        });

        // Formatar os dados de saída
        const repos = response.data.items.map(repo => ({
            name: repo.full_name,
            description: repo.description || 'Sem descrição',
            avatar: repo.owner.avatar_url
        }));

        res.json(repos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar os repositórios' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
