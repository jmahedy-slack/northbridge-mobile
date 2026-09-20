export const WORLD_WIDTH = 480;
export const WORLD_HEIGHT = 640;
export const PLAYER_WIDTH = 36;
export const PLAYER_HEIGHT = 16;
export const PLAYER_SPEED = 260;
export const PLAYER_Y = WORLD_HEIGHT - 56;
export const INVADER_WIDTH = 24;
export const INVADER_HEIGHT = 16;
export const INVADER_COLS = 8;
export const INVADER_ROWS = 5;
export const INVADER_GAP_X = 16;
export const INVADER_GAP_Y = 20;
export const INVADER_ORIGIN_X = 88;
export const INVADER_ORIGIN_Y = 80;
export const INVADER_STEP_X = 10;
export const INVADER_DROP = 18;
export const BULLET_WIDTH = 3;
export const PLAYER_BULLET_WIDTH = 6;
export const BULLET_HEIGHT = 14;
export const PLAYER_BULLET_SPEED = -420;
export const ALIEN_BULLET_SPEED = 150;
export const MARGIN = 16;
export const POINTS = [10, 20, 30];
export const MYSTERY_POINTS = 100;
export const MAX_ALIEN_BULLETS = 3;

export function kindForRow(row) {
  if (row === 0) return 2;
  if (row <= 2) return 1;
  return 0;
}

export function overlaps(a, b) {
  return (
    a.alive &&
    b.alive &&
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function livingInvaders(state) {
  return state.invaders.filter((invader) => invader.alive);
}

export function playerBullet(state) {
  return state.bullets.find((bullet) => bullet.alive && bullet.from === 'player');
}

export function nextRandom(state) {
  state.seed |= 0;
  state.seed = (state.seed + 0x6d2b79f5) | 0;
  let t = Math.imul(state.seed ^ (state.seed >>> 15), 1 | state.seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function spawnInvaders(originY) {
  const invaders = [];
  for (let row = 0; row < INVADER_ROWS; row += 1) {
    for (let col = 0; col < INVADER_COLS; col += 1) {
      invaders.push({
        x: INVADER_ORIGIN_X + col * (INVADER_WIDTH + INVADER_GAP_X),
        y: originY + row * (INVADER_HEIGHT + INVADER_GAP_Y),
        w: INVADER_WIDTH,
        h: INVADER_HEIGHT,
        alive: true,
        row,
        col,
        kind: kindForRow(row),
      });
    }
  }
  return invaders;
}

export function createGame(options = {}) {
  const invaders = spawnInvaders(INVADER_ORIGIN_Y);
  const seed = options.seed ?? 1;
  return {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    status: 'playing',
    score: 0,
    lives: options.lives ?? 3,
    wave: options.wave ?? 1,
    player: {
      x: INVADER_ORIGIN_X + 3 * (INVADER_WIDTH + INVADER_GAP_X) - (PLAYER_WIDTH - INVADER_WIDTH) / 2,
      y: PLAYER_Y,
      w: PLAYER_WIDTH,
      h: PLAYER_HEIGHT,
      alive: true,
      cooldown: 0,
    },
    invaders,
    bullets: [],
    mystery: null,
    direction: 1,
    moveAcc: 0,
    alienShotAcc: 0,
    alienShotEvery: 1.4,
    mysteryAcc: 0,
    mysteryEvery: 9,
    seed,
    totalInvaders: invaders.length,
  };
}

export function stepInterval(state) {
  const alive = livingInvaders(state).length;
  const ratio = alive / Math.max(1, state.totalInvaders);
  const waveBoost = Math.max(0.32, 1 - (state.wave - 1) * 0.08);
  return (0.07 + 0.5 * ratio) * waveBoost;
}

function clampPlayer(state) {
  const maxX = state.width - state.player.w - MARGIN;
  state.player.x = Math.min(maxX, Math.max(MARGIN, state.player.x));
}

function formationBounds(state) {
  const alive = livingInvaders(state);
  if (alive.length === 0) return null;
  let left = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const invader of alive) {
    left = Math.min(left, invader.x);
    right = Math.max(right, invader.x + invader.w);
    bottom = Math.max(bottom, invader.y + invader.h);
  }
  return { left, right, bottom };
}

export function advanceFormation(state) {
  const bounds = formationBounds(state);
  if (!bounds) return;
  const nextLeft = bounds.left + INVADER_STEP_X * state.direction;
  const nextRight = bounds.right + INVADER_STEP_X * state.direction;
  if (nextLeft < MARGIN || nextRight > state.width - MARGIN) {
    state.direction = state.direction === 1 ? -1 : 1;
    for (const invader of state.invaders) {
      if (invader.alive) invader.y += INVADER_DROP;
    }
    return;
  }
  for (const invader of state.invaders) {
    if (invader.alive) invader.x += INVADER_STEP_X * state.direction;
  }
}

function shootFromColumn(state) {
  const columns = new Map();
  for (const invader of state.invaders) {
    if (!invader.alive) continue;
    const current = columns.get(invader.col);
    if (!current || invader.row > current.row) {
      columns.set(invader.col, invader);
    }
  }
  const shooters = [...columns.values()];
  if (shooters.length === 0) return;
  const shooter = shooters[Math.floor(nextRandom(state) * shooters.length)];
  state.bullets.push({
    x: shooter.x + shooter.w / 2 - BULLET_WIDTH / 2,
    y: shooter.y + shooter.h,
    w: BULLET_WIDTH,
    h: BULLET_HEIGHT,
    vy: ALIEN_BULLET_SPEED,
    from: 'alien',
    alive: true,
  });
}

function spawnMystery(state) {
  const goingRight = nextRandom(state) < 0.5;
  state.mystery = {
    x: goingRight ? -48 : state.width + 8,
    y: 36,
    w: 42,
    h: 16,
    vx: goingRight ? 90 : -90,
    alive: true,
  };
}

function nextWave(state) {
  state.wave += 1;
  state.invaders = spawnInvaders(INVADER_ORIGIN_Y);
  state.totalInvaders = state.invaders.length;
  state.bullets = [];
  state.direction = 1;
  state.moveAcc = 0;
  state.alienShotAcc = 0;
  state.mystery = null;
}

function handleCollisions(state) {
  for (const bullet of state.bullets) {
    if (!bullet.alive) continue;
    if (bullet.from === 'player') {
      for (const invader of state.invaders) {
        if (overlaps(bullet, invader)) {
          invader.alive = false;
          bullet.alive = false;
          state.score += POINTS[invader.kind];
          break;
        }
      }
      if (bullet.alive && state.mystery && overlaps(bullet, state.mystery)) {
        state.mystery.alive = false;
        state.mystery = null;
        bullet.alive = false;
        state.score += MYSTERY_POINTS;
      }
    } else if (overlaps(bullet, state.player)) {
      bullet.alive = false;
      state.lives -= 1;
      for (const item of state.bullets) item.alive = false;
      state.player.x =
        INVADER_ORIGIN_X + 3 * (INVADER_WIDTH + INVADER_GAP_X) - (PLAYER_WIDTH - INVADER_WIDTH) / 2;
      if (state.lives <= 0) {
        state.status = 'lost';
        state.player.alive = false;
      }
      return;
    }
  }
}

export function step(state, input, dt) {
  if (state.status !== 'playing') return state;
  const clampedDt = Math.max(0, Math.min(0.05, dt));

  if (input.left) state.player.x -= PLAYER_SPEED * clampedDt;
  if (input.right) state.player.x += PLAYER_SPEED * clampedDt;
  clampPlayer(state);

  if (state.player.cooldown > 0) {
    state.player.cooldown -= clampedDt;
  }
  if (input.fire && !playerBullet(state) && state.player.cooldown <= 0) {
    state.bullets.push({
      x: state.player.x + state.player.w / 2 - PLAYER_BULLET_WIDTH / 2,
      y: state.player.y - BULLET_HEIGHT,
      w: PLAYER_BULLET_WIDTH,
      h: BULLET_HEIGHT,
      vy: PLAYER_BULLET_SPEED,
      from: 'player',
      alive: true,
    });
    state.player.cooldown = 0.12;
  }

  for (const bullet of state.bullets) {
    if (!bullet.alive) continue;
    bullet.y += bullet.vy * clampedDt;
    if (bullet.y + bullet.h < 0 || bullet.y > state.height) {
      bullet.alive = false;
    }
  }

  state.moveAcc += clampedDt;
  const interval = stepInterval(state);
  while (state.moveAcc >= interval) {
    state.moveAcc -= interval;
    advanceFormation(state);
  }

  const alienCount = state.bullets.filter((bullet) => bullet.alive && bullet.from === 'alien').length;
  state.alienShotAcc += clampedDt;
  if (alienCount < MAX_ALIEN_BULLETS && state.alienShotAcc >= state.alienShotEvery) {
    state.alienShotAcc = 0;
    state.alienShotEvery = 0.45 + nextRandom(state) * 1.15;
    shootFromColumn(state);
  }

  state.mysteryAcc += clampedDt;
  if (!state.mystery && state.mysteryAcc >= state.mysteryEvery) {
    state.mysteryAcc = 0;
    state.mysteryEvery = 8 + nextRandom(state) * 6;
    spawnMystery(state);
  }
  if (state.mystery) {
    state.mystery.x += state.mystery.vx * clampedDt;
    if (state.mystery.x > state.width + 60 || state.mystery.x + state.mystery.w < -60) {
      state.mystery = null;
    }
  }

  handleCollisions(state);
  state.bullets = state.bullets.filter((bullet) => bullet.alive);

  if (livingInvaders(state).length === 0) {
    nextWave(state);
  }

  const bounds = formationBounds(state);
  if (bounds && bounds.bottom >= state.player.y) {
    state.status = 'lost';
    state.player.alive = false;
  }

  return state;
}
