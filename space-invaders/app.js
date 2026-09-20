import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
  createGame,
  livingInvaders,
  playerBullet,
  step,
} from './engine.js';

const canvas = document.getElementById('game');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayCopy = document.getElementById('overlay-copy');
const startBtn = document.getElementById('start');
const scoreEl = document.getElementById('score');
const waveEl = document.getElementById('wave');
const livesEl = document.getElementById('lives');
const ctx = canvas.getContext('2d');

const SPRITES = {
  0: [
    '00100000100',
    '00010001000',
    '00111111100',
    '01101110110',
    '11111111111',
    '10111111101',
    '10100000101',
    '00011011000',
  ],
  1: [
    '00011111000',
    '01111111110',
    '11111111111',
    '11001110011',
    '11111111111',
    '00110001100',
    '01101110110',
    '11000000011',
  ],
  2: [
    '00001110000',
    '00111111100',
    '01111111110',
    '11011011011',
    '11111111111',
    '00101110100',
    '01000000010',
    '00100000100',
  ],
  player: [
    '0000001000000',
    '0000011100000',
    '0000011100000',
    '0111111111110',
    '1111111111111',
    '1111111111111',
  ],
  mystery: [
    '00111111100',
    '01111111110',
    '11011011011',
    '11111111111',
    '00110001100',
    '01100000110',
  ],
};

const COLORS = {
  0: '#7ee787',
  1: '#79c0ff',
  2: '#d2a8ff',
  player: '#e6edf3',
  mystery: '#ffa198',
};

const stars = Array.from({ length: 48 }, (_, i) => ({
  x: (i * 97) % WORLD_WIDTH,
  y: (i * 53) % WORLD_HEIGHT,
  s: 0.6 + (i % 3) * 0.4,
}));

const input = { left: false, right: false, fire: false };
const keys = new Set();

let state = createGame({ seed: Date.now() % 100000 });
let running = false;
let last = 0;
let prevScore = 0;
let prevLives = state.lives;
let audioCtx = null;

function pad(value) {
  return String(value).padStart(4, '0');
}

function syncHud() {
  scoreEl.textContent = pad(state.score);
  waveEl.textContent = String(state.wave);
  livesEl.textContent = String(Math.max(0, state.lives));
}

function beep(freq, duration, type = 'square', gain = 0.035) {
  try {
    audioCtx ??= new AudioContext();
    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.value = gain;
    amp.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(amp).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Audio is optional.
  }
}

function drawSprite(sprite, x, y, w, h, color) {
  const rows = sprite.length;
  const cols = sprite[0].length;
  const cw = w / cols;
  const ch = h / rows;
  ctx.fillStyle = color;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (sprite[row][col] === '1') {
        ctx.fillRect(x + col * cw, y + row * ch, cw, ch);
      }
    }
  }
}

function render() {
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  ctx.fillStyle = '#9be9a8';
  for (const star of stars) {
    ctx.globalAlpha = 0.25 + (star.s % 1) * 0.45;
    ctx.fillRect(star.x, star.y, star.s, star.s);
  }
  ctx.globalAlpha = 1;

  if (state.mystery) {
    drawSprite(SPRITES.mystery, state.mystery.x, state.mystery.y, state.mystery.w, state.mystery.h, COLORS.mystery);
  }

  for (const invader of state.invaders) {
    if (!invader.alive) continue;
    const wobble = Math.floor(state.moveAcc * 12) % 2 === 0 ? 0 : 1;
    drawSprite(SPRITES[invader.kind], invader.x, invader.y + wobble, invader.w, invader.h, COLORS[invader.kind]);
  }

  for (const bullet of state.bullets) {
    ctx.fillStyle = bullet.from === 'player' ? '#7ee787' : '#ffa198';
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  }

  if (state.player.alive) {
    drawSprite(SPRITES.player, state.player.x, state.player.y, state.player.w, state.player.h, COLORS.player);
  }

  ctx.fillStyle = '#163820';
  ctx.fillRect(16, WORLD_HEIGHT - 22, WORLD_WIDTH - 32, 3);
}

function showOverlay(title, copy, cta) {
  overlayTitle.textContent = title;
  overlayCopy.textContent = copy;
  startBtn.textContent = cta;
  overlay.classList.remove('is-hidden');
}

function hideOverlay() {
  overlay.classList.add('is-hidden');
}

function startGame() {
  state = createGame({ seed: Date.now() % 100000 });
  prevScore = 0;
  prevLives = state.lives;
  running = true;
  hideOverlay();
  syncHud();
  beep(220, 0.08, 'square', 0.03);
  beep(440, 0.12, 'square', 0.03);
}

function endGame() {
  running = false;
  showOverlay('Game over', `Score ${state.score} · wave ${state.wave}. Press Start to play again.`, 'Restart');
  beep(110, 0.35, 'sawtooth', 0.04);
}

function updateInput() {
  input.left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
  input.right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
  input.fire = keys.has(' ') || keys.has('ArrowUp') || keys.has('w') || keys.has('W');
}

function tick(ts) {
  const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
  last = ts;
  for (const star of stars) {
    star.y = (star.y + dt * (8 + star.s * 12)) % WORLD_HEIGHT;
  }
  updateInput();
  if (running) {
    const beforeBullet = Boolean(playerBullet(state));
    const beforeAlive = livingInvaders(state).length;
    step(state, input, dt);
    if (!beforeBullet && playerBullet(state)) beep(680, 0.05, 'square', 0.025);
    if (livingInvaders(state).length < beforeAlive) beep(180, 0.08, 'triangle', 0.04);
    if (state.score > prevScore && state.score - prevScore >= 100) beep(880, 0.12, 'square', 0.03);
    if (state.lives < prevLives) beep(90, 0.2, 'sawtooth', 0.05);
    prevScore = state.score;
    prevLives = state.lives;
    syncHud();
    if (state.status === 'lost') endGame();
  }
  render();
  requestAnimationFrame(tick);
}

function bindHold(button, key) {
  const on = () => keys.add(key);
  const off = () => keys.delete(key);
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    on();
    updateInput();
  });
  button.addEventListener('pointerup', off);
  button.addEventListener('pointercancel', off);
  button.addEventListener('pointerleave', off);
}

window.addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'a', 'A', 'd', 'D', 'w', 'W'].includes(event.key)) {
    event.preventDefault();
  }
  if (event.key === 'Enter' && !running) {
    startGame();
    return;
  }
  keys.add(event.key);
  updateInput();
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.key);
  updateInput();
});

startBtn.addEventListener('click', startGame);
canvas.addEventListener('click', () => {
  if (!running) startGame();
});

bindHold(document.getElementById('left'), 'ArrowLeft');
bindHold(document.getElementById('right'), 'ArrowRight');
bindHold(document.getElementById('fire'), ' ');

syncHud();
render();
requestAnimationFrame(tick);
