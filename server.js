const express = require('express');
const axios = require('axios');
const app = express();

// Configurações do Exact Online
const clientID = 'SEU_CLIENT_ID';  // Substitua pelo seu Client ID
const clientSecret = 'SEU_CLIENT_SECRET';  // Substitua pelo seu Client Secret
const redirectUri = 'https://seuprojeto.vercel.app/callback';  // Atualizaremos após o deploy
const authUrl = 'https://start.exactonline.nl/api/oauth2/auth';
const tokenUrl = 'https://start.exactonline.nl/api/oauth2/token';

// Rota inicial: redireciona para a página de login do Exact Online
app.get('/', (req, res) => {
    const url = `${authUrl}?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&state=xyz123`;
    res.redirect(url);
});

// Callback para capturar o código de autorização
app.get('/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        res.send('Erro: Código de autorização não foi recebido.');
        return;
    }

    try {
        // Troca o código de autorização pelo token de acesso
        const response = await axios.post(tokenUrl, null, {
            params: {
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: redirectUri,
                client_id: clientID,
                client_secret: clientSecret
            }
        });

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        res.send(`
            <h2>Token de Acesso Obtido com Sucesso!</h2>
            <p><strong>Access Token:</strong> ${accessToken}</p>
            <p><strong>Refresh Token:</strong> ${refreshToken}</p>
        `);
    } catch (error) {
        res.send(`Erro ao obter o token de acesso: ${error.message}`);
    }
});

// Inicializando o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
