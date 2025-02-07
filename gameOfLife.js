function gameOfLife(board) {
  const Z = 0;
  const P = 1;
  const N = -1;

  const directions = [
    { di: P, dj: Z },
    { di: P, dj: P },
    { di: Z, dj: P },
    { di: N, dj: P },
    { di: N, dj: Z },
    { di: N, dj: N },
    { di: Z, dj: N },
    { di: P, dj: N },
  ];

  const rows = board.length;
  const cols = board[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] & 1) {
        for (const { di, dj } of directions) {
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
            board[ni][nj] += 2;
          }
        }
      }
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 6) {
        board[i][j] = 1; // Birth, no cell, three neighbors
      } else if (board[i][j] & 1) {
        board[i][j] = board[i][j] >= 4 && board[i][j] < 8 ? 1 : 0; // Keep living
      } else {
        board[i][j] = 0; // No life
      }
    }
  }
}

module.exports = { gameOfLife };
