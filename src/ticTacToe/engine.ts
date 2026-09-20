export type Mark = 'X' | 'O';
export type Cell = Mark | null;
export type Board = Cell[];

export const BOARD_SIZE = 9;

export const WIN_LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** Prefer center, then corners, then edges so tied minimax scores feel natural. */
const MOVE_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

export type Outcome =
  | { type: 'ongoing' }
  | { type: 'win'; mark: Mark; line: readonly number[] }
  | { type: 'draw' };

export function createBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => null);
}

export function opponent(mark: Mark): Mark {
  return mark === 'X' ? 'O' : 'X';
}

export function findWin(board: Board): { mark: Mark; line: readonly number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { mark, line };
    }
  }
  return null;
}

export function isFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function legalMoves(board: Board): number[] {
  const moves: number[] = [];
  for (const index of MOVE_ORDER) {
    if (board[index] === null) {
      moves.push(index);
    }
  }
  return moves;
}

export function outcome(board: Board): Outcome {
  const win = findWin(board);
  if (win) {
    return { type: 'win', mark: win.mark, line: win.line };
  }
  if (isFull(board)) {
    return { type: 'draw' };
  }
  return { type: 'ongoing' };
}

export function applyMove(board: Board, index: number, mark: Mark): Board {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    throw new Error('Move is off the board');
  }
  if (board[index] !== null) {
    throw new Error('Square is already taken');
  }
  if (outcome(board).type !== 'ongoing') {
    throw new Error('Game is already over');
  }
  const next = board.slice();
  next[index] = mark;
  return next;
}

export function bestMove(board: Board, mark: Mark): number {
  const moves = legalMoves(board);
  if (moves.length === 0) {
    throw new Error('No moves left');
  }

  let chosen = moves[0];
  let bestScore = -Infinity;
  for (const move of moves) {
    const next = applyMove(board, move, mark);
    const score = -minimax(next, opponent(mark), 0);
    if (score > bestScore) {
      bestScore = score;
      chosen = move;
    }
  }
  return chosen;
}

function minimax(board: Board, mark: Mark, depth: number): number {
  const result = outcome(board);
  if (result.type === 'win') {
    return result.mark === mark ? 10 - depth : depth - 10;
  }
  if (result.type === 'draw') {
    return 0;
  }

  let best = -Infinity;
  for (const move of legalMoves(board)) {
    const next = applyMove(board, move, mark);
    const score = -minimax(next, opponent(mark), depth + 1);
    if (score > best) {
      best = score;
    }
  }
  return best;
}
