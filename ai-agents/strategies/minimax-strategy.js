/**
 * Minimax Strategy for Reversi game
 * This strategy uses the minimax algorithm with alpha-beta pruning to look ahead several moves
 * Can be used for either player
 */

// Helper function to get valid moves
function getValidMoves(board, player, opponent) {
  const validMoves = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] !== '') continue;
      
      let isValid = false;
      for (const [dy, dx] of directions) {
        let ny = y + dy;
        let nx = x + dx;
        let foundOpponent = false;
        
        while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
          if (board[ny][nx] === opponent) {
            foundOpponent = true;
          } else if (board[ny][nx] === player && foundOpponent) {
            isValid = true;
            break;
          } else {
            break;
          }
          ny += dy;
          nx += dx;
        }
        
        if (isValid) break;
      }
      
      if (isValid) {
        validMoves.push({ x, y });
      }
    }
  }
  
  return validMoves;
}

// Function to make a move and return the new board
function makeMove(board, move, player, opponent) {
  const newBoard = JSON.parse(JSON.stringify(board));
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  newBoard[move.y][move.x] = player;
  
  for (const [dy, dx] of directions) {
    let ny = move.y + dy;
    let nx = move.x + dx;
    const toFlip = [];
    
    while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && newBoard[ny][nx] === opponent) {
      toFlip.push({ y: ny, x: nx });
      ny += dy;
      nx += dx;
    }
    
    if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && newBoard[ny][nx] === player) {
      for (const pos of toFlip) {
        newBoard[pos.y][pos.x] = player;
      }
    }
  }
  
  return newBoard;
}

// Position weights for evaluation
const positionWeights = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, 1, 1, 1, 1, -2, 10],
  [5, -2, 1, 1, 1, 1, -2, 5],
  [5, -2, 1, 1, 1, 1, -2, 5],
  [10, -2, 1, 1, 1, 1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100]
];

// Evaluate board state
function evaluateBoard(board, player, opponent) {
  let score = 0;
  let playerPieces = 0;
  let opponentPieces = 0;
  let playerMobility = getValidMoves(board, player, opponent).length;
  let opponentMobility = getValidMoves(board, opponent, player).length;
  
  // Position-based evaluation
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] === player) {
        score += positionWeights[y][x];
        playerPieces++;
      } else if (board[y][x] === opponent) {
        score -= positionWeights[y][x];
        opponentPieces++;
      }
    }
  }
  
  // Mobility evaluation (ability to make moves)
  score += 2 * (playerMobility - opponentMobility);
  
  // Piece count evaluation (weighted less than position)
  const totalPieces = playerPieces + opponentPieces;
  if (totalPieces > 32) {  // In endgame, piece count matters more
    score += 1.5 * (playerPieces - opponentPieces);
  } else {
    score += 0.5 * (playerPieces - opponentPieces);
  }
  
  return score;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, alpha, beta, isMaximizing, player, opponent) {
  // Base case: reached maximum depth or game over
  if (depth === 0) {
    return evaluateBoard(board, player, opponent);
  }
  
  const currentPlayer = isMaximizing ? player : opponent;
  const otherPlayer = isMaximizing ? opponent : player;
  const validMoves = getValidMoves(board, currentPlayer, otherPlayer);
  
  // If no valid moves, pass turn
  if (validMoves.length === 0) {
    // Check if other player also has no moves (game over)
    if (getValidMoves(board, otherPlayer, currentPlayer).length === 0) {
      // Game is over, count pieces
      let playerCount = 0;
      let opponentCount = 0;
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          if (board[y][x] === player) playerCount++;
          else if (board[y][x] === opponent) opponentCount++;
        }
      }
      return playerCount > opponentCount ? 1000 : (playerCount < opponentCount ? -1000 : 0);
    }
    // Pass turn and continue
    return minimax(board, depth - 1, alpha, beta, !isMaximizing, player, opponent);
  }
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move, currentPlayer, otherPlayer);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, player, opponent);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move, currentPlayer, otherPlayer);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, player, opponent);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
}

// Find the best move using minimax
function findBestMove(board, player, opponent, depth = 4) {
  const validMoves = getValidMoves(board, player, opponent);
  
  if (validMoves.length === 0) {
    return { x: -1, y: -1 }; // No valid moves
  }
  
  let bestMove = null;
  let bestScore = -Infinity;
  
  // Evaluate each move using minimax
  for (const move of validMoves) {
    const newBoard = makeMove(board, move, player, opponent);
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, player, opponent);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Main strategy function
function minimaxStrategy(board, player, opponent) {
  console.log(`\n🧠 Minimax Strategy thinking...`);
  
  // Get all valid moves
  const validMoves = getValidMoves(board, player, opponent);
  
  if (validMoves.length === 0) {
    console.log(`🚫 No valid moves for Minimax Strategy. Skipping turn.`);
    return { x: -1, y: -1 };
  }
  
  // Calculate total pieces to determine game phase
  let totalPieces = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] !== '') totalPieces++;
    }
  }
  
  // Adjust search depth based on game phase
  let searchDepth = 4; // Default depth
  
  if (totalPieces >= 55) {
    searchDepth = 6; // Deeper search in endgame
    console.log(`🔍 Endgame detected. Increasing search depth to ${searchDepth}`);
  } else if (totalPieces <= 12) {
    searchDepth = 5; // Deeper search in opening
    console.log(`🔍 Opening phase. Increasing search depth to ${searchDepth}`);
  }
  
  console.log(`🔍 Searching with depth ${searchDepth}...`);
  
  // Find best move using minimax
  const startTime = Date.now();
  const bestMove = findBestMove(board, player, opponent, searchDepth);
  const endTime = Date.now();
  
  console.log(`⏱️ Minimax calculation took ${(endTime - startTime)/1000} seconds`);
  console.log(`🎯 Minimax Strategy chooses move: (${bestMove.x}, ${bestMove.y})`);
  
  return bestMove;
}

module.exports = { minimaxStrategy };
