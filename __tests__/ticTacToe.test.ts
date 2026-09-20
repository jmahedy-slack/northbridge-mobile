import {
  applyMove,
  bestMove,
  createBoard,
  findWin,
  legalMoves,
  opponent,
  outcome,
} from '../src/ticTacToe/engine';
import type { Board, Mark } from '../src/ticTacToe/engine';

function play(moves: number[], start: Mark = 'X'): Board {
  let board = createBoard();
  let turn: Mark = start;
  for (const move of moves) {
    board = applyMove(board, move, turn);
    turn = opponent(turn);
  }
  return board;
}

function playToEnd(first: Mark, pick: (board: Board, mark: Mark) => number): ReturnType<typeof outcome> {
  let board = createBoard();
  let turn: Mark = first;
  while (outcome(board).type === 'ongoing') {
    board = applyMove(board, pick(board, turn), turn);
    turn = opponent(turn);
  }
  return outcome(board);
}

describe('tic-tac-toe engine', () => {
  it('starts with nine empty squares', () => {
    expect(createBoard()).toEqual(Array(9).fill(null));
    expect(legalMoves(createBoard())).toHaveLength(9);
  });

  it('detects row, column, and diagonal wins', () => {
    expect(findWin(play([0, 3, 1, 4, 2]))?.mark).toBe('X');
    expect(findWin(play([0, 1, 3, 2, 6]))?.line).toEqual([0, 3, 6]);
    expect(findWin(play([0, 1, 4, 2, 8]))?.line).toEqual([0, 4, 8]);
    expect(findWin(play([2, 0, 4, 1, 6]))?.line).toEqual([2, 4, 6]);
  });

  it('calls a full board without a winner a draw', () => {
    const board = play([0, 1, 2, 5, 3, 6, 4, 8, 7]);
    expect(outcome(board)).toEqual({ type: 'draw' });
  });

  it('rejects occupied squares, off-board indexes, and moves after the game ends', () => {
    const midGame = play([0]);
    expect(() => applyMove(midGame, 0, 'O')).toThrow('Square is already taken');
    expect(() => applyMove(midGame, 9, 'O')).toThrow('Move is off the board');
    const won = play([0, 3, 1, 4, 2]);
    expect(() => applyMove(won, 8, 'O')).toThrow('Game is already over');
  });

  it('takes a winning square and blocks an immediate loss', () => {
    expect(bestMove(play([0, 3, 1, 4]), 'X')).toBe(2);
    expect(bestMove(play([0, 3, 1]), 'O')).toBe(2);
  });

  it('never loses to a random opponent from either side', () => {
    const randomPick = (board: Board) => {
      const moves = legalMoves(board);
      return moves[Math.floor(Math.random() * moves.length)];
    };

    for (let game = 0; game < 5; game += 1) {
      const asX = playToEnd('X', (board, mark) => (mark === 'X' ? bestMove(board, mark) : randomPick(board)));
      expect(asX.type === 'win' ? asX.mark : 'draw').not.toBe('O');

      const asO = playToEnd('X', (board, mark) => (mark === 'O' ? bestMove(board, mark) : randomPick(board)));
      expect(asO.type === 'win' ? asO.mark : 'draw').not.toBe('X');
    }
  });

  it('draws when both players play perfectly', () => {
    const result = playToEnd('X', (board, mark) => bestMove(board, mark));
    expect(result).toEqual({ type: 'draw' });
  });
});
