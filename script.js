const perguntas = [
{
pergunta: "Qual é a menor unidade que forma os seres vivos?",
alternativas: [
"O órgão",
"A célula",
"O tecido",
"O sistema"
],
correta: 1
},

{
    pergunta: "Qual órgão é responsável por bombear o sangue pelo corpo?",
    alternativas: [
        "Pulmão",
        "Estômago",
        "Coração",
        "Cérebro"
    ],
    correta: 2
},

{
    pergunta: "Qual destes animais é um consumidor na cadeia alimentar?",
    alternativas: [
        "Capim",
        "Alga",
        "Coelho",
        "Árvore"
    ],
    correta: 2
},

{
    pergunta: "A água em forma de gelo está em qual estado físico?",
    alternativas: [
        "Gasoso",
        "Líquido",
        "Plasmático",
        "Sólido"
    ],
    correta: 3
},

{
    pergunta: "Qual é o planeta conhecido como Planeta Vermelho?",
    alternativas: [
        "Marte",
        "Júpiter",
        "Saturno",
        "Vênus"
    ],
    correta: 0
},

{
    pergunta: "Qual gás é essencial para a respiração dos seres humanos?",
    alternativas: [
        "Oxigênio",
        "Gás carbônico",
        "Hélio",
        "Nitrogênio"
    ],
    correta: 0
},

{
    pergunta: "Qual parte da planta normalmente absorve água e sais minerais do solo?",
    alternativas: [
        "Flor",
        "Raiz",
        "Fruto",
        "Semente"
    ],
    correta: 1
},

{
    pergunta: "O que acontece com a água quando ela passa do estado líquido para o gasoso?",
    alternativas: [
        "Congelamento",
        "Fusão",
        "Evaporação",
        "Solidificação"
    ],
    correta: 2
},

{
    pergunta: "Qual sistema do corpo humano é responsável pela digestão dos alimentos?",
    alternativas: [
        "Sistema digestório",
        "Sistema respiratório",
        "Sistema nervoso",
        "Sistema circulatório"
    ],
    correta: 0
},

{
    pergunta: "Em uma cadeia alimentar, os vegetais são geralmente classificados como:",
    alternativas: [
        "Consumidores",
        "Predadores",
        "Produtores",
        "Decompositores"
    ],
    correta: 2
}


];

let questaoAtual = 0;
let pontuacao = 0;
let vidas = 3;
let respondeu = false;

// Elementos da página
const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const telaFinal = document.getElementById("tela-final");

const btnIniciar = document.getElementById("btn-iniciar");
const btnProxima = document.getElementById("btn-proxima");
const btnReiniciar = document.getElementById("btn-reiniciar");

const perguntaElemento = document.getElementById("pergunta");
const alternativasElemento = document.getElementById("alternativas");
const feedbackElemento = document.getElementById("feedback");

const pontuacaoElemento = document.getElementById("pontuacao");
const vidasElemento = document.getElementById("vidas");
const questaoElemento = document.getElementById("questao-atual");
const barraProgresso = document.getElementById("barra-progresso");

const pontuacaoFinal = document.getElementById("pontuacao-final");
const mensagemResultado = document.getElementById("mensagem-resultado");
const tituloResultado = document.getElementById("titulo-resultado");
const classificacao = document.getElementById("classificacao");
const emojiResultado = document.getElementById("emoji-resultado");

// Iniciar jogo
btnIniciar.addEventListener("click", iniciarJogo);

function iniciarJogo() {
questaoAtual = 0;
pontuacao = 0;
vidas = 3;

atualizarPlacar();

mostrarTela(telaJogo);

carregarPergunta();


}

// Exibir uma tela e esconder as outras
function mostrarTela(tela) {
document.querySelectorAll(".tela").forEach(elemento => {
elemento.classList.remove("ativa");
});

tela.classList.add("ativa");


}

// Carregar pergunta atual
function carregarPergunta() {
respondeu = false;

const dados = perguntas[questaoAtual];

perguntaElemento.textContent = dados.pergunta;
questaoElemento.textContent = questaoAtual + 1;

feedbackElemento.textContent = "";
feedbackElemento.className = "feedback";

btnProxima.classList.add("escondido");

alternativasElemento.innerHTML = "";

dados.alternativas.forEach((alternativa, indice) => {

    const botao = document.createElement("button");

    botao.classList.add("alternativa");
    botao.textContent = alternativa;

    botao.addEventListener("click", () => {
        verificarResposta(indice, botao);
    });

    alternativasElemento.appendChild(botao);
});

atualizarBarra();


}

// Verificar resposta
function verificarResposta(indiceEscolhido, botaoEscolhido) {

if (respondeu) {
    return;
}

respondeu = true;

const respostaCorreta = perguntas[questaoAtual].correta;
const botoes = document.querySelectorAll(".alternativa");

botoes.forEach(botao => {
    botao.disabled = true;
});

// Mostrar a resposta correta
botoes[respostaCorreta].classList.add("correta");

if (indiceEscolhido === respostaCorreta) {

    pontuacao += 10;

    botaoEscolhido.classList.add("correta");

    feedbackElemento.textContent =
        "🎉 Muito bem! Você acertou! +10 pontos";

    feedbackElemento.classList.add("acerto");

} else {

    vidas--;

    botaoEscolhido.classList.add("errada");

    feedbackElemento.textContent =
        "😯 Quase! A resposta correta está destacada.";

    feedbackElemento.classList.add("erro");
}

atualizarPlacar();

// Se perdeu todas as vidas, encerra o jogo
if (vidas === 0) {

    feedbackElemento.textContent =
        "💔 Você ficou sem vidas!";

    setTimeout(() => {
        finalizarJogo();
    }, 1200);

    return;
}

btnProxima.classList.remove("escondido");


}

// Próxima questão
btnProxima.addEventListener("click", () => {

questaoAtual++;

if (questaoAtual >= perguntas.length) {
    finalizarJogo();
} else {
    carregarPergunta();
}


});

// Atualizar placar
function atualizarPlacar() {

pontuacaoElemento.textContent = pontuacao;

vidasElemento.textContent =
    "❤️".repeat(vidas) +
    "🖤".repeat(3 - vidas);


}

// Atualizar barra de progresso
function atualizarBarra() {

const progresso =
    ((questaoAtual + 1) / perguntas.length) * 100;

barraProgresso.style.width = `${progresso}%`;


}

// Finalizar jogo
function finalizarJogo() {

pontuacaoFinal.textContent = pontuacao;

definirResultado();

mostrarTela(telaFinal);


}

// Definir mensagem de acordo com a pontuação
function definirResultado() {

if (pontuacao >= 90) {

    emojiResultado.textContent = "🏆";
    tituloResultado.textContent = "Cientista incrível!";
    mensagemResultado.textContent =
        "Uau! Você mostrou que entende muito de Ciências!";
    classificacao.textContent =
        "🔬 Grande Cientista, conhecimento de campeão!";

} else if (pontuacao >= 60) {

    emojiResultado.textContent = "🌟";
    tituloResultado.textContent = "Muito bem!";
    mensagemResultado.textContent =
        "Você foi muito bem no desafio!";
    classificacao.textContent =
        "🧪 Cientista em treinamento, continue estudando!";

} else if (pontuacao >= 30) {

    emojiResultado.textContent = "😊";
    tituloResultado.textContent = "Bom trabalho!";
    mensagemResultado.textContent =
        "Você já sabe bastante, mas ainda pode aprender mais!";
    classificacao.textContent =
        "📚 Aprendiz da Ciência, não pare de aprender!";

} else {

    emojiResultado.textContent = "💪";
    tituloResultado.textContent = "Continue tentando!";
    mensagemResultado.textContent =
        "Cada erro é uma oportunidade para aprender e melhorar.";
    classificacao.textContent =
        "🌱 Pequeno Cientista, estude e tente novamente!";
}


}

// Reiniciar
btnReiniciar.addEventListener("click", iniciarJogo);