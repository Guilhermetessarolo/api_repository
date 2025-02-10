const express = require('express');
const axios = require('axios');
const app = express();

// Configurações do Exact Online
const clientID = '9543c370-8b88-4b15-814e-00906ff2ceef';  // Substitua pelo seu Client ID
const clientSecret = '4nsNMpyZSLrA';  // Substitua pelo seu Client Secret
const redirectUri = 'https://api-repository-gamma.vercel.app/callback';  // Verifique se está igual ao registrado no Exact Online
const authUrl = 'https://start.exactonline.nl/api/oauth2/auth';
const tokenUrl = 'https://start.exactonline.nl/api/oauth2/token';

// Rota inicial: redireciona para a página de login do Exact Online (sem state)
app.get('/', (req, res) => {
    const url = `${authUrl}?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code`;
    console.log('URL de autenticação gerada:', url);  // Log para verificar a URL gerada
    res.redirect(url);
});

// Callback para capturar o código de autorização
app.get('/callback', async (req, res) => {
    console.log('Parâmetros recebidos no callback:', req.query);  // Log para ver os parâmetros recebidos

    const authCode = req.query.code;

    if (!authCode) {
        return res.send('Erro: Código de autorização não foi recebido.');
    }

    try {
        // Troca o código de autorização pelo token de acesso
        console.log('Enviando solicitação POST com os parâmetros:');
        console.log({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: redirectUri,
            client_id: clientID,
            client_secret: clientSecret
        });

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
        console.error('Erro ao obter o token:', error.response?.data || error.message);  // Log do erro
        res.send(`Erro ao obter o token de acesso: ${error.response?.data?.error_description || error.message}`);
    }
});

// Inicializando o servidor
module.exports = app;
