import express from 'express';
import session from 'express-session';
import verificarAutenticacao from './seguranca/autenticar.js';

const app = express();
const porta = 3000;
const host = '0.0.0.0';

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'MinhaChaveSecretaSuperSecreta',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 }
}));

app.use(express.static('Public'));
app.post('/login', (requisicao, resposta) => {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (email === 'admin@gmail.com' && senha === 'admin') {
        requisicao.session.autenticado = true;
        resposta.redirect('/menu.html');
    } else {
        resposta.send('Login inválido! </span> <a href="/login.html">Tentar novamente</a>');
    }

});
app.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect('/login.html');
});


app.use(express.static('Public'));
app.use(verificarAutenticacao, express.static('Private'));


app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});