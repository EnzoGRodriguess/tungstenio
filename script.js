document.addEventListener('DOMContentLoaded', () => {

    const Sound = {
        enabled: true,
        ctx: null,

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
        },

        playTone(freq, type = 'sine', duration = 0.15) {
            if (!this.enabled) return;
            this.init();
            if (!this.ctx) return;

            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {}
        },

        playCorrect() {
            this.playTone(523.25, 'triangle', 0.1);
            setTimeout(() => this.playTone(659.25, 'triangle', 0.2), 100);
        },

        playWrong() {
            this.playTone(220, 'sawtooth', 0.2);
            setTimeout(() => this.playTone(180, 'sawtooth', 0.25), 150);
        },

        playClick() {
            this.playTone(400, 'sine', 0.05);
        },

        playVictory() {
            const notes = [440, 554.37, 659.25, 880];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 'triangle', 0.25), i * 150);
            });
        }
    };

    const QUESTION_BANK = {
        math: [
            { q: "Qual é o valor da fração 3/4 em número decimal?", opts: ["0,75", "0,50", "0,25", "0,80"], ans: 0 },
            { q: "Qual o resultado de 7² + 5?", opts: ["19", "54", "49", "14"], ans: 1 },
            { q: "Qual é o menor número primo?", opts: ["0", "1", "2", "3"], ans: 2 },
            { q: "Um retângulo tem largura 4m e comprimento 6m. Qual seu perímetro?", opts: ["24m", "10m", "20m", "16m"], ans: 2 },
            { q: "Qual é o MDC (Máximo Divisor Comum) entre 12 e 18?", opts: ["6", "3", "2", "12"], ans: 0 },
            { q: "Quanto é 15% de 200?", opts: ["20", "30", "15", "40"], ans: 1 },
            { q: "Qual fração é equivalente a 1/2?", opts: ["2/3", "3/6", "4/5", "2/5"], ans: 1 },
            { q: "Qual é o resultado de 144 ÷ 12?", opts: ["10", "11", "12", "14"], ans: 2 },
            { q: "O número 45 é múltiplo de qual dos números abaixo?", opts: ["2", "6", "9", "8"], ans: 2 },
            { q: "Qual é o valor da expressão: 3 + 4 × 2?", opts: ["14", "11", "10", "18"], ans: 1 },
            { q: "Quanto mede um ângulo reto?", opts: ["45°", "180°", "360°", "90°"], ans: 3 },
            { q: "Se x + 7 = 15, qual é o valor de x?", opts: ["8", "7", "9", "22"], ans: 0 },
            { q: "Quantos centímetros existem em 2,5 metros?", opts: ["25 cm", "250 cm", "2500 cm", "0,25 cm"], ans: 1 },
            { q: "Qual o resultado de 0,5 + 0,75?", opts: ["1,25", "1,15", "1,00", "0,80"], ans: 0 },
            { q: "Um triângulo que possui todos os lados iguais é chamado de:", opts: ["Isósceles", "Escaleno", "Equilátero", "Retângulo"], ans: 2 }
        ],
        science: [
            { q: "Qual órgão do corpo humano é responsável por bombear o sangue?", opts: ["Pulmão", "Cérebro", "Coração", "Estômago"], ans: 2 },
            { q: "O processo pelo qual as plantas produzem seu próprio alimento é a:", opts: ["Respiração", "Fotossíntese", "Digestão", "Transpiração"], ans: 1 },
            { q: "A passagem da água do estado líquido para o gasoso chama-se:", opts: ["Evaporação", "Fusão", "Solidificação", "Condensação"], ans: 0 },
            { q: "Qual planeta do Sistema Solar é conhecido como o 'Planeta Vermelho'?", opts: ["Vênus", "Júpiter", "Marte", "Saturno"], ans: 2 },
            { q: "O movimento da Terra ao redor do próprio eixo gera:", opts: ["As estações do ano", "O dia e a noite", "Os eclipses", "As marés"], ans: 1 },
            { q: "Qual gás é essencial para a respiração dos seres humanos?", opts: ["Gás Carbônico", "Nitrogênio", "Gás Oxigênio", "Hélio"], ans: 2 },
            { q: "Os animais que se alimentam exclusivamente de plantas são chamados de:", opts: ["Carnívoros", "Herbívoros", "Onívoros", "Decompositores"], ans: 1 },
            { q: "Qual é a camada mais externa do planeta Terra?", opts: ["Manto", "Núcleo", "Crosta Terrestre", "Magma"], ans: 2 },
            { q: "A renovação celular e o crescimento do corpo dependem de qual nutriente?", opts: ["Proteínas", "Açúcares", "Gorduras", "Vitaminas"], ans: 0 },
            { q: "Qual das opções é um recurso natural renovável?", opts: ["Petróleo", "Carvão Mineral", "Energia Solar", "Gás Natural"], ans: 2 },
            { q: "Quantos estados físicos fundamentais da matéria estudamos no 6º ano?", opts: ["2", "3", "4", "5"], ans: 1 },
            { q: "Os fungos e bactérias atuam na cadeia alimentar como:", opts: ["Produtores", "Consumidores", "Decompositores", "Predadores"], ans: 2 },
            { q: "O esqueleto humano de um adulto é formado por quantos ossos em média?", opts: ["206", "150", "300", "100"], ans: 0 },
            { q: "O movimento da Terra ao redor do Sol leva cerca de:", opts: ["24 horas", "28 dias", "365 dias", "100 dias"], ans: 2 },
            { q: "Qual instrumento é utilizado para observar células microscópicas?", opts: ["Telescópio", "Microscópio", "Lupa de mão", "Termômetro"], ans: 1 }
        ],
        portuguese: [
            { q: "Qual das palavras abaixo é um substantivo próprio?", opts: ["cidade", "Brasil", "livro", "menino"], ans: 1 },
            { q: "Qual é o sinônimo da palavra 'rápido'?", opts: ["Lento", "Devagar", "Veloz", "Calmo"], ans: 2 },
            { q: "Assinale a alternativa com a grafia CORRETA:", opts: ["Exceção", "Eceção", "Excessão", "Esceção"], ans: 0 },
            { q: "Qual é o plural da palavra 'girassol'?", opts: ["Girassols", "Girassóis", "Girassoles", "Girassóes"], ans: 1 },
            { q: "Qual é o verbo na frase: 'Os alunos estudaram para a arena.'?", opts: ["alunos", "arena", "estudaram", "para"], ans: 2 },
            { q: "A palavra 'Felicidade' é qual classe gramatical?", opts: ["Verbo", "Adjetivo", "Substantivo", "Pronome"], ans: 2 },
            { q: "Qual sinal de pontuação indica uma pergunta direta?", opts: ["Ponto final", "Ponto de interrogação", "Vírgula", "Exclamação"], ans: 1 },
            { q: "Qual é o antônimo de 'corajoso'?", opts: ["Valente", "Destemido", "Cevado", "Medroso"], ans: 3 },
            { q: "Identifique o adjetivo na frase: 'O carro azul correu bastante.'", opts: ["carro", "azul", "correu", "bastante"], ans: 1 },
            { q: "Qual palavra é oxítona?", opts: ["Café", "Lápis", "Música", "Mesa"], ans: 0 },
            { q: "Assinale a frase com pontuação adequada:", opts: ["Maria comprou: pão leite e café.", "Maria comprou pão, leite e café.", "Maria, comprou pão leite, e café", "Maria comprou pão leite e café"], ans: 1 },
            { q: "Qual palavra contém um encontro consonantal?", opts: ["Prato", "Mesa", "Bolo", "Casa"], ans: 0 },
            { q: "Qual é o pronome pessoal na frase: 'Nós fomos ao parque'?", opts: ["parque", "fomos", "Nós", "ao"], ans: 2 },
            { q: "A palavra 'Infelizmente' possui qual prefixo que indica negação?", opts: ["In-", "Mente-", "Feliz-", "Ez-"], ans: 0 },
            { q: "Qual das opções é uma frase exclamativa?", opts: ["Que dia maravilhoso!", "Onde você vai?", "Eu estudo muito.", "Feche a porta."], ans: 0 }
        ]
    };

    const gameState = {
        currentScreen: 'home',
        soundEnabled: true,
        config: {
            team1Name: 'Mestres do Saber',
            team2Name: 'Gênios da Arena',
            subject: 'all',
            turnTime: 30,
            totalRounds: 3,
            minigames: ['quiz', 'memory', 'pairs', 'reflex', 'click']
        },
        match: {
            currentRound: 1,
            activeTeam: 1,
            scores: { team1: 0, team2: 0 },
            history: [],
            isTieBreaker: false,
            isPaused: false,
            isTurnActive: false,
            timeLeft: 30,
            timerInterval: null,
            currentMinigame: null,
            turnPoints: 0
        }
    };

    const DOM = {
        screens: {
            home: document.getElementById('screen-home'),
            setup: document.getElementById('screen-setup'),
            game: document.getElementById('screen-game'),
            gameover: document.getElementById('screen-gameover')
        },
        modals: {
            how: document.getElementById('modal-how'),
            pause: document.getElementById('modal-pause'),
            quit: document.getElementById('modal-quit'),
            turnResult: document.getElementById('modal-turn-result')
        },
        btnAudioToggle: document.getElementById('btn-audio-toggle'),
        audioIcon: document.getElementById('audio-icon'),
        btnHomeStart: document.getElementById('btn-home-start'),
        btnHomeHow: document.getElementById('btn-home-how'),
        btnCloseHow: document.getElementById('btn-close-how'),
        setupForm: document.getElementById('setup-form'),
        team1Input: document.getElementById('team1-name'),
        team2Input: document.getElementById('team2-name'),
        selectSubject: document.getElementById('select-subject'),
        selectTurnTime: document.getElementById('select-turn-time'),
        selectRounds: document.getElementById('select-rounds'),
        setupError: document.getElementById('setup-error'),
        btnSetupBack: document.getElementById('btn-setup-back'),
        btnSetupStart: document.getElementById('btn-setup-start'),
        cardTeam1: document.getElementById('card-team1'),
        cardTeam2: document.getElementById('card-team2'),
        scoreT1Name: document.getElementById('score-t1-name'),
        scoreT2Name: document.getElementById('score-t2-name'),
        scoreT1Pts: document.getElementById('score-t1-pts'),
        scoreT2Pts: document.getElementById('score-t2-pts'),
        roundIndicator: document.getElementById('round-indicator'),
        timerDisplay: document.getElementById('timer-display'),
        turnAnnouncer: document.getElementById('turn-announcer'),
        minigameTitle: document.getElementById('minigame-title'),
        interactiveArena: document.getElementById('interactive-arena'),
        turnFeedback: document.getElementById('turn-feedback'),
        btnStartTurn: document.getElementById('btn-start-turn'),
        btnPause: document.getElementById('btn-pause'),
        btnQuit: document.getElementById('btn-quit'),
        btnResume: document.getElementById('btn-resume'),
        btnConfirmQuit: document.getElementById('btn-confirm-quit'),
        btnCancelQuit: document.getElementById('btn-cancel-quit'),
        btnNextTurn: document.getElementById('btn-next-turn'),
        resultTurnTitle: document.getElementById('result-turn-title'),
        resultTeamName: document.getElementById('result-team-name'),
        resultTurnPts: document.getElementById('result-turn-pts'),
        resultTurnDesc: document.getElementById('result-turn-desc'),
        winnerTitle: document.getElementById('winner-title'),
        winnerName: document.getElementById('winner-name'),
        finalT1Name: document.getElementById('final-t1-name'),
        finalT1Pts: document.getElementById('final-t1-pts'),
        finalT2Name: document.getElementById('final-t2-name'),
        finalT2Pts: document.getElementById('final-t2-pts'),
        historyTbody: document.getElementById('history-tbody'),
        btnRestart: document.getElementById('btn-restart'),
        btnMenu: document.getElementById('btn-menu')
    };

    function showScreen(screenKey) {
        Object.keys(DOM.screens).forEach(key => {
            DOM.screens[key].classList.toggle('active', key === screenKey);
        });
        gameState.currentScreen = screenKey;
    }

    function toggleModal(modalKey, show) {
        if (DOM.modals[modalKey]) {
            DOM.modals[modalKey].classList.toggle('hidden', !show);
        }
    }

    function init() {
        registerEvents();
        showScreen('home');
    }

    function registerEvents() {
        DOM.btnAudioToggle.addEventListener('click', () => {
            gameState.soundEnabled = !gameState.soundEnabled;
            Sound.enabled = gameState.soundEnabled;
            DOM.audioIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
        });

        DOM.btnHomeStart.addEventListener('click', () => {
            Sound.playClick();
            showScreen('setup');
        });

        DOM.btnHomeHow.addEventListener('click', () => {
            Sound.playClick();
            toggleModal('how', true);
        });

        DOM.btnCloseHow.addEventListener('click', () => {
            Sound.playClick();
            toggleModal('how', false);
        });

        DOM.btnSetupBack.addEventListener('click', () => {
            Sound.playClick();
            showScreen('home');
        });

        DOM.btnSetupStart.addEventListener('click', validateAndStartGame);

        DOM.btnStartTurn.addEventListener('click', () => {
            Sound.playClick();
            startTurnChallenge();
        });

        DOM.btnPause.addEventListener('click', pauseGame);
        DOM.btnResume.addEventListener('click', resumeGame);

        DOM.btnQuit.addEventListener('click', () => {
            Sound.playClick();
            pauseGame();
            toggleModal('quit', true);
        });

        DOM.btnCancelQuit.addEventListener('click', () => {
            Sound.playClick();
            toggleModal('quit', false);
            resumeGame();
        });

        DOM.btnConfirmQuit.addEventListener('click', () => {
            Sound.playClick();
            toggleModal('quit', false);
            stopTimer();
            showScreen('home');
        });

        DOM.btnNextTurn.addEventListener('click', () => {
            Sound.playClick();
            toggleModal('turnResult', false);
            switchTeamTurn();
        });

        DOM.btnRestart.addEventListener('click', () => {
            Sound.playClick();
            startGame();
        });

        DOM.btnMenu.addEventListener('click', () => {
            Sound.playClick();
            showScreen('home');
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && gameState.currentScreen === 'game' && gameState.match.isTurnActive && !gameState.match.isPaused) {
                pauseGame();
            }
        });
    }

    function validateAndStartGame() {
        const team1 = DOM.team1Input.value.trim() || 'Equipe Azul';
        const team2 = DOM.team2Input.value.trim() || 'Equipe Laranja';
        
        const chks = document.querySelectorAll('.minigame-checkboxes input:checked');
        const selectedMinigames = Array.from(chks).map(c => c.value);

        if (selectedMinigames.length === 0) {
            DOM.setupError.classList.remove('hidden');
            return;
        }

        DOM.setupError.classList.add('hidden');

        gameState.config = {
            team1Name: team1,
            team2Name: team2,
            subject: DOM.selectSubject.value,
            turnTime: parseInt(DOM.selectTurnTime.value),
            totalRounds: parseInt(DOM.selectRounds.value),
            minigames: selectedMinigames
        };

        startGame();
    }

    function startGame() {
        gameState.match = {
            currentRound: 1,
            activeTeam: 1,
            scores: { team1: 0, team2: 0 },
            history: [],
            isTieBreaker: false,
            isPaused: false,
            isTurnActive: false,
            timeLeft: gameState.config.turnTime,
            timerInterval: null,
            currentMinigame: null,
            turnPoints: 0
        };

        DOM.scoreT1Name.textContent = gameState.config.team1Name;
        DOM.scoreT2Name.textContent = gameState.config.team2Name;

        showScreen('game');
        prepareTurn();
    }

    function prepareTurn() {
        stopTimer();
        gameState.match.isTurnActive = false;
        gameState.match.turnPoints = 0;
        gameState.match.timeLeft = gameState.config.turnTime;

        DOM.scoreT1Pts.textContent = gameState.match.scores.team1;
        DOM.scoreT2Pts.textContent = gameState.match.scores.team2;

        const isT1 = gameState.match.activeTeam === 1;
        DOM.cardTeam1.classList.toggle('active-turn', isT1);
        DOM.cardTeam2.classList.toggle('active-turn', !isT1);

        const activeTeamName = isT1 ? gameState.config.team1Name : gameState.config.team2Name;
        DOM.turnAnnouncer.textContent = `Vez de: ${activeTeamName}`;

        if (gameState.match.isTieBreaker) {
            DOM.roundIndicator.textContent = "🔥 RODADA DE DESEMPATE!";
        } else {
            DOM.roundIndicator.textContent = `Rodada ${gameState.match.currentRound} / ${gameState.config.totalRounds}`;
        }

        DOM.timerDisplay.textContent = gameState.match.timeLeft;
        DOM.timerDisplay.classList.remove('danger');

        const availableGames = gameState.config.minigames;
        const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)];
        gameState.match.currentMinigame = randomGame;

        renderMinigamePreview(randomGame);

        DOM.btnStartTurn.style.display = 'inline-flex';
        DOM.turnFeedback.textContent = 'Pressione "Iniciar Desafio" para começar a valer o tempo!';
    }

    function renderMinigamePreview(gameKey) {
        const gameTitles = {
            quiz: "⚡ Desafio RelâMPAGO",
            memory: "🧩 Memória de Padrões",
            pairs: "🃏 Encontre os Pares",
            reflex: "🎯 Reflexo Relâmpago",
            click: "💥 Click Rush"
        };

        const gameDescs = {
            quiz: "Responda corretamente o maior número de perguntas escolares antes que o tempo acabe!",
            memory: "Observe a sequência de luzes e repita na mesma ordem!",
            pairs: "Vire as cartas e encontre todos os pares correspondentes!",
            reflex: "Espere o sinal VERDE e clique o mais rápido possível! Cuidado para não se precipitar.",
            click: "Clique nos alvos VERDES rapidamente. Evite os alvos VERMELHOS!"
        };

        DOM.minigameTitle.textContent = gameTitles[gameKey] || "Desafio da Arena";
        DOM.interactiveArena.innerHTML = `
            <div style="text-align: center; max-width: 500px;">
                <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--color-blue);">${gameTitles[gameKey]}</h3>
                <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.5;">${gameDescs[gameKey]}</p>
            </div>
        `;
    }

    function startTurnChallenge() {
        DOM.btnStartTurn.style.display = 'none';
        gameState.match.isTurnActive = true;
        DOM.turnFeedback.textContent = "Desafio em andamento!";

        startTimer();

        switch (gameState.match.currentMinigame) {
            case 'quiz': initQuizMinigame(); break;
            case 'memory': initMemoryMinigame(); break;
            case 'pairs': initPairsMinigame(); break;
            case 'reflex': initReflexMinigame(); break;
            case 'click': initClickMinigame(); break;
        }
    }

    function startTimer() {
        stopTimer();
        gameState.match.timerInterval = setInterval(() => {
            if (gameState.match.isPaused) return;

            gameState.match.timeLeft--;
            DOM.timerDisplay.textContent = gameState.match.timeLeft;

            if (gameState.match.timeLeft <= 5) {
                DOM.timerDisplay.classList.add('danger');
                Sound.playTone(800, 'sine', 0.05);
            }

            if (gameState.match.timeLeft <= 0) {
                finishTurnRound("⏱️ Tempo Esgotado!");
            }
        }, 1000);
    }

    function stopTimer() {
        if (gameState.match.timerInterval) {
            clearInterval(gameState.match.timerInterval);
            gameState.match.timerInterval = null;
        }
    }

    function pauseGame() {
        if (!gameState.match.isTurnActive) return;
        gameState.match.isPaused = true;
        toggleModal('pause', true);
    }

    function resumeGame() {
        gameState.match.isPaused = false;
        toggleModal('pause', false);
    }

    function addTurnPoints(pts) {
        gameState.match.turnPoints = Math.max(0, Math.min(100, gameState.match.turnPoints + pts));
    }

    function finishTurnRound(reasonMessage = "Turno Concluído!") {
        stopTimer();
        gameState.match.isTurnActive = false;

        const isT1 = gameState.match.activeTeam === 1;
        if (isT1) {
            gameState.match.scores.team1 += gameState.match.turnPoints;
        } else {
            gameState.match.scores.team2 += gameState.match.turnPoints;
        }

        const activeName = isT1 ? gameState.config.team1Name : gameState.config.team2Name;
        gameState.match.history.push({
            round: gameState.match.isTieBreaker ? 'Desempate' : gameState.match.currentRound,
            team: activeName,
            game: DOM.minigameTitle.textContent,
            pts: gameState.match.turnPoints
        });

        DOM.resultTurnTitle.textContent = reasonMessage;
        DOM.resultTeamName.textContent = activeName;
        DOM.resultTurnPts.textContent = `+${gameState.match.turnPoints} pts`;
        DOM.resultTurnDesc.textContent = `Excelente desempenho no desafio ${DOM.minigameTitle.textContent}!`;

        Sound.playVictory();
        toggleModal('turnResult', true);
    }

    function switchTeamTurn() {
        if (gameState.match.activeTeam === 1) {
            gameState.match.activeTeam = 2;
            prepareTurn();
        } else {
            if (gameState.match.isTieBreaker) {
                checkGameWinner();
            } else if (gameState.match.currentRound < gameState.config.totalRounds) {
                gameState.match.currentRound++;
                gameState.match.activeTeam = 1;
                prepareTurn();
            } else {
                if (gameState.match.scores.team1 === gameState.match.scores.team2) {
                    gameState.match.isTieBreaker = true;
                    gameState.match.activeTeam = 1;
                    prepareTurn();
                } else {
                    checkGameWinner();
                }
            }
        }
    }

    function checkGameWinner() {
        showScreen('gameover');

        const s1 = gameState.match.scores.team1;
        const s2 = gameState.match.scores.team2;

        DOM.finalT1Name.textContent = gameState.config.team1Name;
        DOM.finalT1Pts.textContent = `${s1} pts`;
        DOM.finalT2Name.textContent = gameState.config.team2Name;
        DOM.finalT2Pts.textContent = `${s2} pts`;

        if (s1 > s2) {
            DOM.winnerTitle.textContent = "🏆 EQUIPE VENCEDORA!";
            DOM.winnerName.textContent = gameState.config.team1Name;
            DOM.winnerName.style.color = "var(--color-blue)";
        } else if (s2 > s1) {
            DOM.winnerTitle.textContent = "🏆 EQUIPE VENCEDORA!";
            DOM.winnerName.textContent = gameState.config.team2Name;
            DOM.winnerName.style.color = "var(--color-orange)";
        } else {
            DOM.winnerTitle.textContent = "🤝 EMPATE PERFEITO!";
            DOM.winnerName.textContent = "Ambas as equipes deram um show!";
            DOM.winnerName.style.color = "var(--color-yellow)";
        }

        DOM.historyTbody.innerHTML = gameState.match.history.map(item => `
            <tr>
                <td>${item.round}</td>
                <td><strong>${item.team}</strong></td>
                <td>${item.game}</td>
                <td style="color: var(--color-green); font-weight: bold;">+${item.pts}</td>
            </tr>
        `).join('');

        Sound.playVictory();
    }

    function initQuizMinigame() {
        let pool = [];
        if (gameState.config.subject === 'all') {
            pool = [...QUESTION_BANK.math, ...QUESTION_BANK.science, ...QUESTION_BANK.portuguese];
        } else {
            pool = [...(QUESTION_BANK[gameState.config.subject] || [])];
        }

        pool.sort(() => Math.random() - 0.5);
        let qIndex = 0;

        function renderQuestion() {
            if (!gameState.match.isTurnActive) return;

            if (qIndex >= pool.length) {
                finishTurnRound("🎉 Você respondeu todas as perguntas disponíveis!");
                return;
            }

            const currentQ = pool[qIndex];
            DOM.interactiveArena.innerHTML = `
                <div class="quiz-container">
                    <span class="quiz-header-tag">Pergunta ${qIndex + 1}</span>
                    <h3 class="quiz-question-text">${currentQ.q}</h3>
                    <div class="quiz-options-grid">
                        ${currentQ.opts.map((opt, idx) => `
                            <button class="quiz-opt-btn" data-idx="${idx}">${opt}</button>
                        `).join('')}
                    </div>
                </div>
            `;

            const btns = DOM.interactiveArena.querySelectorAll('.quiz-opt-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (!gameState.match.isTurnActive) return;

                    const chosen = parseInt(e.target.getAttribute('data-idx'));
                    btns.forEach(b => b.disabled = true);

                    if (chosen === currentQ.ans) {
                        e.target.classList.add('correct');
                        Sound.playCorrect();
                        addTurnPoints(20);
                        DOM.turnFeedback.textContent = "✨ Correto! +20 pontos!";
                    } else {
                        e.target.classList.add('wrong');
                        btns[currentQ.ans].classList.add('correct');
                        Sound.playWrong();
                        DOM.turnFeedback.textContent = "❌ Resposta incorreta!";
                    }

                    setTimeout(() => {
                        qIndex++;
                        renderQuestion();
                    }, 1200);
                });
            });
        }

        renderQuestion();
    }

    function initMemoryMinigame() {
        const colors = ['#f87171', '#60a5fa', '#4ade80', '#facc15', '#c084fc', '#fb923c'];
        let sequence = [];
        let playerStep = 0;
        let isDisplayingPattern = false;

        DOM.interactiveArena.innerHTML = `
            <div style="text-align:center;">
                <p style="margin-bottom:15px; color:var(--text-muted);">Observe a sequência luminosa:</p>
                <div class="pattern-grid">
                    ${colors.map((col, i) => `
                        <button class="pattern-btn" data-idx="${i}" style="background-color: ${col}; color:${col};"></button>
                    `).join('')}
                </div>
            </div>
        `;

        const btns = DOM.interactiveArena.querySelectorAll('.pattern-btn');

        function addNextSequence() {
            sequence.push(Math.floor(Math.random() * colors.length));
            playSequence();
        }

        function playSequence() {
            isDisplayingPattern = true;
            playerStep = 0;
            DOM.turnFeedback.textContent = "👀 Preste atenção na sequência...";

            sequence.forEach((colorIdx, i) => {
                setTimeout(() => {
                    if (!gameState.match.isTurnActive) return;
                    flashButton(btns[colorIdx]);
                    if (i === sequence.length - 1) {
                        setTimeout(() => {
                            isDisplayingPattern = false;
                            DOM.turnFeedback.textContent = "👉 Sua vez! Repita os botões na ordem.";
                        }, 500);
                    }
                }, (i + 1) * 700);
            });
        }

        function flashButton(btn) {
            btn.classList.add('active');
            Sound.playTone(300 + parseInt(btn.getAttribute('data-idx')) * 80, 'sine', 0.2);
            setTimeout(() => btn.classList.remove('active'), 400);
        }

        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!gameState.match.isTurnActive || isDisplayingPattern) return;

                const clickedIdx = parseInt(e.target.getAttribute('data-idx'));
                flashButton(e.target);

                if (clickedIdx === sequence[playerStep]) {
                    playerStep++;
                    if (playerStep === sequence.length) {
                        Sound.playCorrect();
                        addTurnPoints(25);
                        DOM.turnFeedback.textContent = "🌟 Sequência concluída! +25 pontos!";
                        setTimeout(addNextSequence, 1000);
                    }
                } else {
                    Sound.playWrong();
                    DOM.turnFeedback.textContent = "❌ Errou a sequência!";
                    finishTurnRound("Fim da tentativa de memória!");
                }
            });
        });

        addNextSequence();
    }

    function initPairsMinigame() {
        const symbols = ['🐱', '🐶', '🦊', '🐸', '🚀', '⭐'];
        const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

        let firstCard = null;
        let secondCard = null;
        let lockBoard = false;
        let pairsFound = 0;

        DOM.interactiveArena.innerHTML = `
            <div class="memory-cards-grid">
                ${deck.map((sym, i) => `
                    <div class="memory-card" data-sym="${sym}" data-idx="${i}">❓</div>
                `).join('')}
            </div>
        `;

        const cards = DOM.interactiveArena.querySelectorAll('.memory-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (!gameState.match.isTurnActive || lockBoard || card === firstCard || card.classList.contains('matched')) return;

                card.classList.add('flipped');
                card.textContent = card.getAttribute('data-sym');
                Sound.playClick();

                if (!firstCard) {
                    firstCard = card;
                    return;
                }

                secondCard = card;
                lockBoard = true;

                if (firstCard.getAttribute('data-sym') === secondCard.getAttribute('data-sym')) {
                    Sound.playCorrect();
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    addTurnPoints(20);
                    pairsFound++;
                    DOM.turnFeedback.textContent = "🎯 Par encontrado! +20 pontos!";
                    resetCards();

                    if (pairsFound === symbols.length) {
                        finishTurnRound("🎉 Incrível! Encontrou todos os pares!");
                    }
                } else {
                    Sound.playWrong();
                    DOM.turnFeedback.textContent = "❌ Não formam um par!";
                    setTimeout(() => {
                        if (firstCard) {
                            firstCard.classList.remove('flipped');
                            firstCard.textContent = "❓";
                        }
                        if (secondCard) {
                            secondCard.classList.remove('flipped');
                            secondCard.textContent = "❓";
                        }
                        resetCards();
                    }, 900);
                }
            });
        });

        function resetCards() {
            [firstCard, secondCard] = [null, null];
            lockBoard = false;
        }
    }

    function initReflexMinigame() {
        DOM.interactiveArena.innerHTML = `
            <div id="reflex-box" class="reflex-box wait">
                AGUARDE O SINAL VERDE...
            </div>
        `;

        const box = document.getElementById('reflex-box');
        let startTime = 0;
        let timeoutId = null;
        let state = 'wait';

        function startAttempt() {
            state = 'wait';
            box.className = 'reflex-box wait';
            box.textContent = 'AGUARDE O SINAL VERDE...';
            DOM.turnFeedback.textContent = 'Mantenha a atenção total!';

            const randomDelay = Math.floor(Math.random() * 3000) + 2000;

            timeoutId = setTimeout(() => {
                if (!gameState.match.isTurnActive) return;
                state = 'ready';
                box.className = 'reflex-box ready';
                box.textContent = 'CLIQUE AGORA! 🔥';
                startTime = Date.now();
                Sound.playTone(880, 'sine', 0.1);
            }, randomDelay);
        }

        box.addEventListener('click', () => {
            if (!gameState.match.isTurnActive) return;

            if (state === 'wait') {
                clearTimeout(timeoutId);
                box.className = 'reflex-box early';
                box.textContent = 'PRECIPITADO! -10 PTS';
                Sound.playWrong();
                addTurnPoints(-10);
                DOM.turnFeedback.textContent = '❌ Clicou antes da hora!';
                setTimeout(startAttempt, 1500);
            } else if (state === 'ready') {
                const reactionTime = Date.now() - startTime;
                Sound.playCorrect();
                
                let pts = 0;
                if (reactionTime < 250) pts = 35;
                else if (reactionTime < 400) pts = 25;
                else pts = 15;

                addTurnPoints(pts);
                box.textContent = `${reactionTime} ms! (+${pts} pts)`;
                DOM.turnFeedback.textContent = `⚡ Excelente tempo de reação: ${reactionTime}ms!`;

                setTimeout(startAttempt, 1500);
            }
        });

        startAttempt();
    }

    function initClickMinigame() {
        DOM.interactiveArena.innerHTML = `<div id="click-area" class="click-rush-area"></div>`;
        const area = document.getElementById('click-area');
        let spawnInterval = null;

        function spawnTarget() {
            if (!gameState.match.isTurnActive || !area) return;

            const target = document.createElement('div');
            const isGood = Math.random() > 0.3;

            target.className = `rush-target ${isGood ? 'good' : 'bad'}`;
            target.textContent = isGood ? '⭐' : '💣';

            const areaWidth = area.clientWidth - 60;
            const areaHeight = area.clientHeight - 60;

            target.style.left = `${Math.max(10, Math.floor(Math.random() * areaWidth))}px`;
            target.style.top = `${Math.max(10, Math.floor(Math.random() * areaHeight))}px`;

            target.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!gameState.match.isTurnActive) return;

                if (isGood) {
                    Sound.playCorrect();
                    addTurnPoints(15);
                    DOM.turnFeedback.textContent = '💥 Alvo acertado! +15 pts';
                } else {
                    Sound.playWrong();
                    addTurnPoints(-10);
                    DOM.turnFeedback.textContent = '💣 Bomba acertada! -10 pts';
                }
                target.remove();
            });

            area.appendChild(target);

            setTimeout(() => {
                if (target.parentNode) target.remove();
            }, 1200);
        }

        spawnInterval = setInterval(spawnTarget, 700);

        const originalStopTimer = stopTimer;
        stopTimer = function() {
            clearInterval(spawnInterval);
            originalStopTimer();
        };
    }

    init();
});