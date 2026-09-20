import {
  INVADER_COLS,
  INVADER_DROP,
  INVADER_ROWS,
  INVADER_STEP_X,
  PLAYER_SPEED,
  PLAYER_WIDTH,
  POINTS,
  WORLD_WIDTH,
  advanceFormation,
  createGame,
  kindForRow,
  livingInvaders,
  overlaps,
  playerBullet,
  step,
} from '../src/spaceInvaders/engine';

const idle = { left: false, right: false, fire: false };

function run(state: ReturnType<typeof createGame>, input: typeof idle, seconds: number, dt = 1 / 60) {
  let elapsed = 0;
  while (elapsed < seconds) {
    step(state, input, dt);
    elapsed += dt;
  }
  return state;
}

describe('space invaders engine', () => {
  it('starts a full formation under column three with three lives', () => {
    const game = createGame({ seed: 7 });
    expect(game.invaders).toHaveLength(INVADER_COLS * INVADER_ROWS);
    expect(livingInvaders(game)).toHaveLength(40);
    expect(game.lives).toBe(3);
    expect(game.status).toBe('playing');
    expect(kindForRow(0)).toBe(2);
    expect(kindForRow(1)).toBe(1);
    expect(kindForRow(4)).toBe(0);
    const columnThree = game.invaders.filter((invader) => invader.col === 3);
    const playerCenter = game.player.x + game.player.w / 2;
    const invaderCenter = columnThree[0].x + columnThree[0].w / 2;
    expect(Math.abs(playerCenter - invaderCenter)).toBeLessThan(1);
  });

  it('moves the player and clamps to the playfield', () => {
    const game = createGame();
    const startX = game.player.x;
    for (let frame = 0; frame < 12; frame += 1) {
      step(game, { left: false, right: true, fire: false }, 1 / 60);
    }
    expect(game.player.x).toBeCloseTo(startX + PLAYER_SPEED * (12 / 60), 5);
    game.player.x = WORLD_WIDTH;
    step(game, { left: false, right: true, fire: false }, 0.05);
    expect(game.player.x + PLAYER_WIDTH).toBeLessThanOrEqual(WORLD_WIDTH - 16);
    game.player.x = 0;
    step(game, { left: true, right: false, fire: false }, 0.05);
    expect(game.player.x).toBeGreaterThanOrEqual(16);
  });

  it('fires a single player shot that destroys the invader above and scores', () => {
    const game = createGame({ seed: 1 });
    const target = game.invaders.find((invader) => invader.col === 3 && invader.row === INVADER_ROWS - 1);
    expect(target?.alive).toBe(true);
    step(game, { left: false, right: false, fire: true }, 1 / 60);
    expect(playerBullet(game)).toBeTruthy();
    step(game, { left: false, right: false, fire: true }, 1 / 60);
    expect(game.bullets.filter((bullet) => bullet.alive && bullet.from === 'player')).toHaveLength(1);

    run(game, idle, 1.5);
    expect(target?.alive).toBe(false);
    expect(game.score).toBe(POINTS[0]);
    expect(livingInvaders(game)).toHaveLength(39);
  });

  it('reverses the formation and drops when it hits an edge', () => {
    const game = createGame();
    const beforeY = game.invaders[0].y;
    game.direction = 1;
    const rightmost = Math.max(...livingInvaders(game).map((invader) => invader.x + invader.w));
    const overflow = WORLD_WIDTH - 16 - rightmost + 1;
    for (const invader of game.invaders) invader.x += overflow;
    advanceFormation(game);
    expect(game.direction).toBe(-1);
    expect(game.invaders[0].y).toBe(beforeY + INVADER_DROP);
  });

  it('steps the formation sideways when there is room', () => {
    const game = createGame();
    const startX = game.invaders[0].x;
    advanceFormation(game);
    expect(game.invaders[0].x).toBe(startX + INVADER_STEP_X);
  });

  it('loses a life when an alien bullet hits the player, then loses the game at zero', () => {
    const game = createGame({ lives: 2 });
    game.bullets.push({
      x: game.player.x + 8,
      y: game.player.y + 2,
      w: 3,
      h: 12,
      vy: 190,
      from: 'alien',
      alive: true,
    });
    step(game, idle, 1 / 60);
    expect(game.lives).toBe(1);
    expect(game.status).toBe('playing');
    expect(game.bullets.every((bullet) => !bullet.alive || bullet.from === 'player')).toBe(true);

    game.bullets.push({
      x: game.player.x + 8,
      y: game.player.y + 2,
      w: 3,
      h: 12,
      vy: 190,
      from: 'alien',
      alive: true,
    });
    step(game, idle, 1 / 60);
    expect(game.lives).toBe(0);
    expect(game.status).toBe('lost');
    step(game, { left: false, right: true, fire: true }, 0.2);
    expect(game.status).toBe('lost');
  });

  it('ends the game when invaders reach the player', () => {
    const game = createGame();
    for (const invader of game.invaders) invader.y = game.player.y - 4;
    step(game, idle, 1 / 60);
    expect(game.status).toBe('lost');
  });

  it('starts the next wave after the formation is cleared', () => {
    const game = createGame();
    for (const invader of game.invaders) invader.alive = false;
    game.invaders[0].alive = true;
    game.invaders[0].x = game.player.x;
    game.invaders[0].y = 80;
    game.bullets.push({
      x: game.invaders[0].x + 4,
      y: game.invaders[0].y + 2,
      w: 3,
      h: 12,
      vy: -420,
      from: 'player',
      alive: true,
    });
    step(game, idle, 1 / 60);
    expect(game.wave).toBe(2);
    expect(livingInvaders(game)).toHaveLength(40);
    expect(game.status).toBe('playing');
  });

  it('uses a seeded RNG so alien fire is deterministic', () => {
    const a = createGame({ seed: 42 });
    const b = createGame({ seed: 42 });
    run(a, idle, 1);
    run(b, idle, 1);
    expect(a.bullets.map((bullet) => [bullet.x, bullet.y, bullet.from, bullet.vy])).toEqual(
      b.bullets.map((bullet) => [bullet.x, bullet.y, bullet.from, bullet.vy]),
    );
    expect(a.bullets.some((bullet) => bullet.from === 'alien')).toBe(true);
    expect(a.seed).toBe(b.seed);
  });

  it('detects overlapping hitboxes', () => {
    expect(
      overlaps(
        { x: 0, y: 0, w: 10, h: 10, alive: true },
        { x: 8, y: 8, w: 10, h: 10, alive: true },
      ),
    ).toBe(true);
    expect(
      overlaps(
        { x: 0, y: 0, w: 10, h: 10, alive: true },
        { x: 11, y: 0, w: 10, h: 10, alive: true },
      ),
    ).toBe(false);
  });
});
