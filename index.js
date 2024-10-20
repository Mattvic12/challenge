const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

        const carrossel = {
            itemType: "application/vnd.lime.document-select+json",
            items: response.data.items.map(repo => ({
                header: {
                    type: "application/vnd.lime.media-link+json",
                    value: {
                        title: repo.full_name,
                        text: repo.description || 'Sem descrição',
                        type: "image/jpeg",
                        uri: repo.owner.avatar_url
                    }
                }
            }))
        };

        res.json(carrossel); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar os repositórios' });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
