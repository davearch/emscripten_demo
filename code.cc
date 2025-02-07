#include <string>
#include <vector>
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

std::string wasmVersion() {
  return "1.1";
}

int demoAdd(int a, int b) {
  return 100+a+b;
}

int demoMul(int a, int b) {
  return 100+a*b;
}

using std::vector;
void gameOfLife(vector<vector<int>>& board) {
  constexpr size_t Z = 0;
  constexpr size_t P = +1;
  constexpr size_t N = size_t(-1);
  struct DIJ final { size_t di, dj; };
  static constexpr DIJ dij[] = {
    { P, Z },
    { P, P },
    { Z, P },
    { N, P },
    { N, Z },
    { N, N },
    { Z, N },
    { P, N },
  };
  for (size_t i = 0; i < board.size(); ++i) {
    for (size_t j = 0; j < board[i].size(); ++j) {
      if (board[i][j] & 1) {
        for (auto [di, dj] : dij) {
          if (i + di < board.size() && j + dj < board[i].size()) {
            board[i + di][j + dj] += 2;
          }
        }
      }
    }
  }
  for (size_t i = 0; i < board.size(); ++i) {
    for (size_t j = 0; j < board[i].size(); ++j) {
      if (board[i][j] == 6) {
        // birth, no cell, three neighbors
        board[i][j] = 1;
      } else if (board[i][j] & 1) {
        // keep living
        board[i][j] = (board[i][j] >= 4 && board[i][j] < 8) ? 1 : 0;
      } else {
        // no life
        board[i][j] = 0;
      }
    }
  }
}

void gameOfLifeLoop(vector<vector<int>>& board, int iterations) {
    for (int i = 0; i < iterations; ++i) {
        gameOfLife(board);
    }
}

void gameOfLifeFlat(int* board, int rows, int cols) {
    std::vector<int> newBoard(rows * cols, 0);

    constexpr int Z = 0, P = 1, N = -1;
    struct DIJ { int di, dj; };
    static constexpr DIJ dij[] = {
        { P, Z }, { P, P }, { Z, P }, { N, P },
        { N, Z }, { N, N }, { Z, N }, { P, N }
    };

    // Step 1: Compute neighbor counts
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            int idx = i * cols + j; // Flattened index
            if (board[idx] & 1) {
                for (auto [di, dj] : dij) {
                    int ni = i + di, nj = j + dj;
                    if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
                        newBoard[ni * cols + nj] += 2;
                    }
                }
            }
        }
    }

    // Step 2: Apply game rules
    for (int i = 0; i < rows * cols; ++i) {
        if (newBoard[i] == 6) {
            board[i] = 1;  // Birth condition (three neighbors)
        } else if (board[i] & 1) {
            board[i] = (newBoard[i] >= 4 && newBoard[i] < 8) ? 1 : 0;  // Keep living
        } else {
            board[i] = 0;  // Cell dies
        }
    }
}

void gameOfLifeFlatLoop(int* board, int rows, int cols, int iterations) {
    for (int i = 0; i < iterations; ++i) {
        gameOfLifeFlat(board, rows, cols);
    }
}

void modifyArray(intptr_t p0, int n) {
  auto p = reinterpret_cast<int*>(p0);
  for (int i = 0; i < n; i++) {
    ++p[i];
  }
}

EMSCRIPTEN_BINDINGS(my_module) {
  function("wasmVersion", &wasmVersion);
  function("demoAdd", &demoAdd);
  function("demoMul", &demoMul);
  register_vector<int>("VectorInt");
  register_vector<std::vector<int>>("VectorVectorInt");
  function("gameOfLife", &gameOfLife);
  function("gameOfLifeLoop", &gameOfLifeLoop);
  function("gameOfLifeFlat", &gameOfLifeFlat, allow_raw_pointers());
  function("gameOfLifeFlatLoop", &gameOfLifeFlatLoop, allow_raw_pointers());
  function("modifyArray", &modifyArray);
}
