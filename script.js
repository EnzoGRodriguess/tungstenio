/* STATE MANAGEMENT */
const gameState = {
  teams: [],
  currentTeamIndex: 0,
  currentRound: 1,
  maxRounds: 6,
  soundEnabled: true,
  timer: null,
  timeLeft: 0,
  currentGame: null,
  isPaused: false,
  scoreHistory: []
};

/* BANCO DE DADOS EDUCATIVO (6º ANO) */
const eduData = {
  mathSequence: [
    { label: "M2", val: "2, 4, 6, 8" },
    { label: "M3", val: "3, 6, 9, 12" },
    { label: "M5", val: "5, 10, 15, 20" },
    { label: "PRIMO", val: "2, 3, 5, 7" }
  ],
  scienceTargets: ["Célula", "Água", "Planeta", "Átomo", "Fóssil", "Energia", "Planta", "Luz"],
  portuguesePairs: [
    { id: 1, text: "Substantivo", match: "Cadeira" },
    { id: 1, text: "Cadeira", match: "Substantivo" },
    { id: 2, text: "Adjetivo", match: "Bonito" },
    { id: 2, text: "Bonito", match: "Adjetivo" },
    { id: 3, text: "Verbo", match: "Correr" },
    { id: 3, text: "Correr", match: "Verbo" },
    { id: 4, text: "Sinônimo", match: "Feliz = Contente" },
    { id: 4, text: "Feliz = Contente", match: "Sinônimo" }
  ]
};

/* SINTETIZADOR DE ÁUDIO SIMPLES (Web Audio API) */
function playSound(freq = 440, type = 'sine', duration = 0.1) {
  if (!gameState.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Falha silenciosa caso áudio não seja suportado
  }
}

/* DOM ELEMENTS */
const screens = {
  home: document.getElementById('screen-home'),
  setup: document.getElementById('screen-setup'),
  instructions: document.getElementById('screen-instructions'),
  game: document.getElementById('screen-game'),
  gameover: document.getElementById('screen-gameover')
};

const ui = {
  teamsContainer: document.getElementById('teams-inputs-container'),
  teamsCountSelect: document.getElementById('teams-count'),
  scoreboard: document.getElementById('scoreboard'),
  roundIndicator: document.getElementById('round-indicator'),
  turnIndicator: document.getElementById('turn-indicator'),
  timerDisplay: document.getElementById('timer-display'),
  minigameTitle: document.getElementById('minigame-title'),
  minigameDesc: document.getElementById('minigame-desc'),
  minigameStage: document.getElementById('minigame-stage'),
  btnStartChallenge: document.getElementById('btn-start-challenge'),
  modalResult: document.getElementById('modal-round-result'),
  roundResultDetails: document.getElementById('round-result-details'),
  soundBtn: document.getElementById('sound-toggle-btn')
};

/* NAVEGAÇÃO DE TELAS */
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
}

/* INICIALIZAÇÃO */
document.addEventListener('DOMContentLoaded', () => {
  renderTeamInputs(2);
  
  ui.teamsCountSelect.addEventListener('change', (e) => {
    renderTeamInputs(parseInt(e.target.value));
  });

  document.getElementById('btn-play').onclick = () => showScreen('setup');
  document.getElementById('btn-how-to-play').onclick = () => showScreen('instructions');
  document.getElementById('btn-instructions-back').onclick = () => showScreen('home');
  document.getElementById('btn-back-home').onclick = () => showScreen('home');
  
  document.getElementById('setup-form').onsubmit = (e) => {
    e.preventDefault();
    initGame();
  };

  ui.soundBtn.onclick = () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    ui.soundBtn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
  };

  document.getElementById('btn-next-round').onclick = () => {
    ui.modalResult.classList.add('hidden');
    advanceTurn();
  };

  document.getElementById('btn-restart').onclick = () => showScreen('setup');
  document.getElementById('btn-main-menu').onclick = () => showScreen('home');
});

/* CONFIGURAÇÃO DE EQUIPES */
function renderTeamInputs(count) {
  ui.teamsContainer.innerHTML = '';
  const defaultNames = ['Equipe Alfa', 'Equipe Beta', 'Equipe Gama', 'Equipe Delta'];
  const colors = ['#1f6beb', '#d97706', '#8957e5', '#238636'];

  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label>Nome da Equipe ${i + 1}:</label>
      <input type="text" class="team-name-input" value="${defaultNames[i]}" data-color="${colors[i]}" required>
    `;
    ui.teamsContainer.appendChild(div);
  }
}

/* LÓGICA PRINCIPAL DO JOGO */
function initGame() {
  const nameInputs = document.querySelectorAll('.team-name-input');
  gameState.teams = Array.from(nameInputs).map((input, idx) => ({
    id: idx,
    name: input.value.trim() || `Equipe ${idx + 1}`,
    color: input.dataset.color,
    score: 0
  }));

  gameState.maxRounds = parseInt(document.getElementById('rounds-count').value);
  gameState.currentRound = 1;
  gameState.currentTeamIndex = 0;

  renderScoreboard();
  showScreen('game');
  prepareRound();
}

function renderScoreboard() {
  ui.scoreboard.innerHTML = '';
  gameState.teams.forEach((team, idx) => {
    const card = document.createElement('div');
    card.className = `team-score-card ${idx === gameState.currentTeamIndex ? 'active-turn' : ''}`;
    card.style.borderColor = team.color;
    card.innerHTML = `
      <div class="team-name" style="color: ${team.color}">${team.name}</div>
      <div class="team-points">${team.score} pt</div>
    `;
    ui.scoreboard.appendChild(card);
  });
}

function prepareRound() {
  renderScoreboard();
  ui.roundIndicator.textContent = `Rodada ${gameState.currentRound}/${gameState.maxRounds}`;
  const activeTeam = gameState.teams[gameState.currentTeamIndex];
  ui.turnIndicator.innerHTML = `Vez de: <span style="color:${activeTeam.color}">${activeTeam.name}</span>`;
  ui.timerDisplay.textContent = `⏱️ --s`;

  // SELEÇÃO DO MINIJOGO BASEADO NA RODADA
  const games = ['math', 'science', 'portuguese', 'reflex'];
  const selectedGame = games[(gameState.currentRound - 1) % games.length];
  gameState.currentGame = selectedGame;

  setupMinigameUI(selectedGame);
}

function setupMinigameUI(gameType) {
  ui.minigameStage.innerHTML = '';
  ui.btnStartChallenge.classList.remove('hidden');

  if (gameType === 'math') {
    ui.minigameTitle.textContent = '🔢 Matemática: Memória Numérica';
    ui.minigameDesc.textContent = 'Observe a sequência de conceitos matemáticos e repita na ordem!';
  } else if (gameType === 'science') {
    ui.minigameTitle.textContent = '🧪 Ciências: Caça aos Elementos';
    ui.minigameDesc.textContent = 'Clique rapidamente nos elementos científicos antes que sumam!';
  } else if (gameType === 'portuguese') {
    ui.minigameTitle.textContent = '📖 Português: Pares Gramaticais';
    ui.minigameDesc.textContent = 'Encontre os pares entre as classes gramaticais e seus exemplos.';
  } else if (gameType === 'reflex') {
    ui.minigameTitle.textContent = '⚡ Ciências: Reação no Laboratório';
    ui.minigameDesc.textContent = 'Clique assim que a tela ficar VERDE. Não clique antes!';
  }

  ui.btnStartChallenge.onclick = () => {
    ui.btnStartChallenge.classList.add('hidden');
    startMinigame(gameType);
  };
}

function startMinigame(gameType) {
  if (gameType === 'math') runMathGame();
  else if (gameType === 'science') runScienceGame();
  else if (gameType === 'portuguese') runPortugueseGame();
  else if (gameType === 'reflex') runReflexGame();
}

/* --- MINIJOGO 1: MATEMÁTICA (SEQUÊNCIA) --- */
function runMathGame() {
  const grid = document.createElement('div');
  grid.className = 'sequence-grid';
  
  const items = eduData.mathSequence;
  items.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.className = 'seq-btn';
    btn.dataset.id = idx;
    btn.textContent = item.label;
    grid.appendChild(btn);
  });
  ui.minigameStage.appendChild(grid);

  let sequence = [];
  let playerStep = 0;
  const roundCount = 3 + Math.floor(gameState.currentRound / 2);

  for (let i = 0; i < roundCount; i++) {
    sequence.push(Math.floor(Math.random() * 4));
  }

  // REPRODUZ A SEQUÊNCIA
  let i = 0;
  const interval = setInterval(() => {
    const btn = grid.children[sequence[i]];
    btn.classList.add('active');
    playSound(300 + sequence[i] * 100, 'sine', 0.2);
    setTimeout(() => btn.classList.remove('active'), 400);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      enablePlayerInput();
    }
  }, 700);

  function enablePlayerInput() {
    grid.querySelectorAll('.seq-btn').forEach(btn => {
      btn.onclick = (e) => {
        const id = parseInt(e.target.dataset.id);
        playSound(300 + id * 100, 'sine', 0.1);
        if (id === sequence[playerStep]) {
          playerStep++;
          if (playerStep >= sequence.length) {
            finishRound(100, "Perfeito! Sequência correta.");
          }
        } else {
          finishRound(30, "Errou a sequência de conceitos!");
        }
      };
    });
  }
}

/* --- MINIJOGO 2: CIÊNCIAS (CLICK RUSH) --- */
function runScienceGame() {
  let score = 0;
  let timeLeft = 10;
  ui.timerDisplay.textContent = `⏱️ ${timeLeft}s`;

  const timer = setInterval(() => {
    timeLeft--;
    ui.timerDisplay.textContent = `⏱️ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      clearTargets();
      finishRound(score * 15, `Você capturou ${score} elementos!`);
    }
  }, 1000);

  function spawnTarget() {
    if (timeLeft <= 0) return;
    const target = document.createElement('div');
    target.className = 'target-node';
    
    const word = eduData.scienceTargets[Math.floor(Math.random() * eduData.scienceTargets.length)];
    target.textContent = word;

    const stageRect = ui.minigameStage.getBoundingClientRect();
    const x = Math.random() * (stageRect.width - 80);
    const y = Math.random() * (stageRect.height - 80);

    target.style.left = `${Math.max(10, x)}px`;
    target.style.top = `${Math.max(10, y)}px`;

    target.onclick = () => {
      score++;
      playSound(600, 'square', 0.05);
      target.remove();
      spawnTarget();
    };

    ui.minigameStage.appendChild(target);

    setTimeout(() => {
      if (target.parentNode) {
        target.remove();
        spawnTarget();
      }
    }, 1200);
  }

  function clearTargets() {
    ui.minigameStage.innerHTML = '';
  }

  spawnTarget();
}

/* --- MINIJOGO 3: PORTUGUÊS (MEMÓRIA / PARES) --- */
function runPortugueseGame() {
  const grid = document.createElement('div');
  grid.className = 'memory-grid';

  // DUPLICA E EMBARALHA PARES
  const cardsData = [...eduData.portuguesePairs].sort(() => Math.random() - 0.5).slice(0, 8);
  let flipped = [];
  let matches = 0;

  cardsData.forEach((data, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.id = data.id;
    card.dataset.text = data.text;
    card.textContent = '?';

    card.onclick = () => {
      if (flipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        card.textContent = data.text;
        flipped.push(card);

        if (flipped.length === 2) {
          checkMatch();
        }
      }
    };
    grid.appendChild(card);
  });

  ui.minigameStage.appendChild(grid);

  function checkMatch() {
    const [c1, c2] = flipped;
    if (c1.dataset.id === c2.dataset.id) {
      c1.classList.add('matched');
      c2.classList.add('matched');
      playSound(800, 'sine', 0.1);
      matches++;
      flipped = [];
      if (matches >= cardsData.length / 2) {
        finishRound(100, "Excelente! Todos os pares gramaticais encontrados!");
      }
    } else {
      playSound(200, 'sawtooth', 0.2);
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.textContent = '?';
        c2.textContent = '?';
        flipped = [];
      }, 1000);
    }
  }
}

/* --- MINIJOGO 4: REFLEXO CIENTÍFICO --- */
function runReflexGame() {
  const box = document.createElement('div');
  box.className = 'reflex-box waiting';
  box.textContent = 'AGUARDE O SINAL VERDE...';
  ui.minigameStage.appendChild(box);

  let startTime = 0;
  let ready = false;

  const randomDelay = Math.floor(Math.random() * 3000) + 2000;

  const timeout = setTimeout(() => {
    ready = true;
    box.className = 'reflex-box ready';
    box.textContent = 'CLIQUE AGORA!';
    startTime = Date.now();
  }, randomDelay);

  box.onclick = () => {
    if (!ready) {
      clearTimeout(timeout);
      playSound(150, 'sawtooth', 0.3);
      finishRound(0, "Queima de largada! Clicou antes da hora.");
    } else {
      const reactionTime = Date.now() - startTime;
      playSound(700, 'sine', 0.1);
      let pts = Math.max(10, 100 - Math.floor((reactionTime - 200) / 5));
      pts = Math.min(100, pts);
      finishRound(pts, `Tempo de Reação: ${reactionTime}ms`);
    }
  };
}

/* FINALIZAÇÃO DA RODADA */
function finishRound(points, message) {
  const activeTeam = gameState.teams[gameState.currentTeamIndex];
  activeTeam.score += points;

  document.getElementById('round-result-title').textContent = message;
  ui.roundResultDetails.innerHTML = `
    <p>A equipe <strong>${activeTeam.name}</strong> conquistou:</p>
    <h1 style="color: var(--primary-color); font-size: 2.5rem; margin: 10px 0;">+${points} pts</h1>
  `;

  ui.modalResult.classList.remove('hidden');
}

function advanceTurn() {
  gameState.currentTeamIndex++;
  if (gameState.currentTeamIndex >= gameState.teams.length) {
    gameState.currentTeamIndex = 0;
    gameState.currentRound++;
  }

  if (gameState.currentRound > gameState.maxRounds) {
    endGame();
  } else {
    prepareRound();
  }
}

/* FINALIZAÇÃO DO JOGO */
function endGame() {
  showScreen('gameover');
  
  // ORDENAR POR PONTUAÇÃO
  const sorted = [...gameState.teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  document.getElementById('winner-team-name').textContent = winner.name;
  document.getElementById('winner-team-name').style.color = winner.color;
  document.getElementById('winner-score-display').textContent = `Com um total de ${winner.score} pontos!`;

  const finalScoresContainer = document.getElementById('final-scoreboard');
  finalScoresContainer.innerHTML = '<h3>Placar Final:</h3>';

  sorted.forEach(t => {
    const p = document.createElement('p');
    p.style.margin = '5px 0';
    p.innerHTML = `<strong style="color:${t.color}">${t.name}:</strong> ${t.score} pontos`;
    finalScoresContainer.appendChild(p);
  });
}