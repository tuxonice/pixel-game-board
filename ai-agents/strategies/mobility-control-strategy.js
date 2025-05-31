/**
 * Mobility Control Strategy for Reversi game
 * This strategy focuses on limiting opponent mobility and controlling the center of the board
 * Typically used for the White player
 */

// Helper function to get valid moves
function getValidMoves(board, player, opponent) {
  const validMoves = [];
  
  // Check each cell on the board
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      // Skip if cell is not empty
      if (board[x][y] !== '') {
        continue;
      }
      
      // Check if this is a valid move
      const capturedPieces = getCapturedPieces(board, x, y, player, opponent);
      
      if (capturedPieces.length > 0) {
        validMoves.push({
          x,
          y,
          score: calculateScore(board, x, y, capturedPieces.length, player, opponent)
        });
      }
    }
  }
  
  return validMoves;
}

// Calculate score for a move based on position, captured pieces, and future opponent mobility
function calculateScore(board, x, y, capturedPieces, player, opponent) {
  let score = capturedPieces;
  
  // Make a copy of the board with this move applied
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[x][y] = player;
  
  // Update captured pieces
  const captured = getCapturedPieces(board, x, y, player, opponent);
  for (const [cx, cy] of captured) {
    newBoard[cx][cy] = player;
  }
  
  // Count opponent's possible moves after this move
  const opponentMoves = countOpponentMoves(newBoard, opponent, player);
  
  // Reduce score if this move gives opponent many options
  score -= opponentMoves * 0.5;
  
  // Prioritize corners (highest value)
  if ((x === 0 && y === 0) || (x === 0 && y === 7) || 
      (x === 7 && y === 0) || (x === 7 && y === 7)) {
    score += 100;
  }
  
  // Avoid positions adjacent to corners
  if ((x === 0 || x === 1) && (y === 0 || y === 1) ||
      (x === 0 || x === 1) && (y === 6 || y === 7) ||
      (x === 6 || x === 7) && (y === 0 || y === 1) ||
      (x === 6 || x === 7) && (y === 6 || y === 7)) {
    score -= 15;
  }
  
  // Prioritize center control
  if (x >= 2 && x <= 5 && y >= 2 && y <= 5) {
    score += 3;
  }
  
  return score;
}

// Count possible moves for opponent
function countOpponentMoves(board, opponent, player) {
  let moveCount = 0;
  
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board[x][y] !== '') {
        continue;
      }
      
      const capturedPieces = getCapturedPieces(board, x, y, opponent, player);
      if (capturedPieces.length > 0) {
        moveCount++;
      }
    }
  }
  
  return moveCount;
}

// Get pieces that would be captured by making a move
function getCapturedPieces(board, x, y, player, opponent) {
  const capturedPieces = [];
  
  // Check in all 8 directions
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    const piecesToCapture = [];
    
    // Continue in this direction as long as we find opponent pieces
    while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[nx][ny] === opponent) {
      piecesToCapture.push([nx, ny]);
      nx += dx;
      ny += dy;
    }
    
    // If we found opponent pieces and ended on one of our pieces, these can be captured
    if (piecesToCapture.length > 0 && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[nx][ny] === player) {
      capturedPieces.push(...piecesToCapture);
    }
  }
  
  return capturedPieces;
}

// Main strategy function
function whitePlayerStrategy(board, player, opponent) {
  // Get all valid moves
  const validMoves = getValidMoves(board, player, opponent);
  
  // If no valid moves, return an invalid move (the game will handle this as a skip)
  if (validMoves.length === 0) {
    console.log('White player has no valid moves. Skipping turn.');
    return { x: -1, y: -1 };
  }
  
  // Sort moves by score (highest first)
  validMoves.sort((a, b) => b.score - a.score);
  
  // Log the top 3 moves for visualization
  console.log('White player top moves:');
  for (let i = 0; i < Math.min(3, validMoves.length); i++) {
    const move = validMoves[i];
    console.log(`Option ${i+1}: Position (${move.x},${move.y}) - Score: ${move.score}`);
  }
  
  // Return the move with the highest score
  return { x: validMoves[0].x, y: validMoves[0].y };
}

module.exports = { whitePlayerStrategy };
