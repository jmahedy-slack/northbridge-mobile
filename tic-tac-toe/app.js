import { applyMove, bestMove, createBoard, opponent, outcome } from './engine.js';

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');
const modeAiBtn = document.getElementById('mode-ai');
const modeLocalBtn = document.getElementById('mode-local');
const newRoundBtn = document.getElementById('new-round');
const resetScoresBtn = document.getElementById('reset-scores');

const state = {
  board: createBoard(),
  turn: 'X',
  mode: 'ai',
  scores: { X: 0, O: 0, draw: 0 },
  locked: false,
};

function render() {
  const result = outcome(state.board);
  const winning = result.type === 'win' ? new Set(result.line) : new Set();
  boardEl.replaceChildren();

  state.board.forEach((mark, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.index = String(index);
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', mark ? `Row ${row} column ${col}, ${mark}` : `Row ${row} column ${col}, empty`);
    if (mark) {
      cell.textContent = mark;
      cell.classList.add(mark === 'X' ? 'mark-x' : 'mark-o');
    }
    if (winning.has(index)) {
      cell.classList.add('is-win');
    }
    cell.disabled = state.locked || result.type !== 'ongoing' || mark !== null;
    cell.addEventListener('click', () => onCell(index));
    boardEl.appendChild(cell);
  });

  scoreXEl.textContent = String(state.scores.X);
  scoreOEl.textContent = String(state.scores.O);
  scoreDrawEl.textContent = String(state.scores.draw);

  statusEl.className = 'status';
  if (result.type === 'win') {
    statusEl.classList.add('is-win');
    statusEl.textContent =
      state.mode === 'ai'
        ? result.mark === 'X'
          ? 'You win.'
          : 'AI wins.'
        : `${result.mark} wins.`;
    return;
  }
  if (result.type === 'draw') {
    statusEl.classList.add('is-draw');
    statusEl.textContent = 'Draw. Board is full.';
    return;
  }
  if (state.mode === 'ai') {
    statusEl.classList.toggle('is-o', state.turn === 'O');
    statusEl.textContent = state.turn === 'X' ? 'Your move. You are X.' : 'AI is thinking…';
    return;
  }
  statusEl.classList.toggle('is-o', state.turn === 'O');
  statusEl.textContent = `${state.turn} to move.`;
}

function finishIfOver() {
  const result = outcome(state.board);
  if (result.type === 'win') {
    state.scores[result.mark] += 1;
    return true;
  }
  if (result.type === 'draw') {
    state.scores.draw += 1;
    return true;
  }
  return false;
}

function playAiIfNeeded() {
  if (state.mode !== 'ai' || state.turn !== 'O' || outcome(state.board).type !== 'ongoing') {
    return;
  }
  state.locked = true;
  render();
  window.setTimeout(() => {
    const move = bestMove(state.board, 'O');
    state.board = applyMove(state.board, move, 'O');
    if (!finishIfOver()) {
      state.turn = 'X';
    }
    state.locked = false;
    render();
  }, 280);
}

function onCell(index) {
  if (state.locked || state.board[index] !== null || outcome(state.board).type !== 'ongoing') {
    return;
  }
  if (state.mode === 'ai' && state.turn !== 'X') {
    return;
  }

  state.board = applyMove(state.board, index, state.turn);
  if (finishIfOver()) {
    render();
    return;
  }
  state.turn = opponent(state.turn);
  render();
  playAiIfNeeded();
}

function newRound() {
  state.board = createBoard();
  state.turn = 'X';
  state.locked = false;
  render();
}

function setMode(mode) {
  state.mode = mode;
  modeAiBtn.classList.toggle('is-active', mode === 'ai');
  modeLocalBtn.classList.toggle('is-active', mode === 'local');
  newRound();
}

modeAiBtn.addEventListener('click', () => setMode('ai'));
modeLocalBtn.addEventListener('click', () => setMode('local'));
newRoundBtn.addEventListener('click', newRound);
resetScoresBtn.addEventListener('click', () => {
  state.scores = { X: 0, O: 0, draw: 0 };
  newRound();
});

render();
