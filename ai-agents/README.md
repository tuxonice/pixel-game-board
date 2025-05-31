# Reversi AI Agents

This directory contains AI agent endpoints for the Reversi game board. The agents implement different strategies for playing Reversi and expose HTTP endpoints that can be used by the game board.

## Features

- Express.js server with separate endpoints for black and white players
- Different AI strategies:
  - **Corner Domination Strategy** (Black player): Focuses on corner positions and maximizing piece capture
  - **Mobility Control Strategy** (White player): Focuses on limiting opponent mobility and controlling the center of the board
  - **Minimax Strategy** (Any player): Uses the minimax algorithm with alpha-beta pruning to look ahead several moves
- Implements the API contract specified in the project requirements
- Includes deliberate pauses (1.5 seconds) between moves to visualize gameplay
- Provides detailed console logging of AI decision-making process

## How to Use

### Setting Up and Running the Server

1. Install dependencies:
```bash
cd ai-agents
yarn install
```

2. Start the server:
```bash
yarn start
```

3. Use the following endpoints in the Reversi game board:
   - Black player (Corner Domination Strategy): `http://localhost:3000/corner-domination`
   - White player (Mobility Control Strategy): `http://localhost:3000/mobility-control`
   - Any player (Minimax Strategy): `http://localhost:3000/minimax`

### Configuring the Game Board

1. Open the Reversi game board in your browser
2. Enter the following URLs in the respective input fields:
   - Player 1 (Black) endpoint: `http://localhost:3000/corner-domination` (Corner Domination Strategy)
   - Player 2 (White) endpoint: `http://localhost:3000/mobility-control` (Mobility Control Strategy)
   
   Or try the Minimax Strategy for either player:
   - `http://localhost:3000/minimax`
3. Click "Play Again" to start a new game

### Monitoring the Game

1. Watch the console output to see the AI's decision-making process
2. Each move will have a 1.5-second delay to make the gameplay visible
3. The console will show:
   - When each player is thinking
   - The top 3 potential moves with their scores
   - The final move chosen
   - When a player has no valid moves

## API Contract

### Request
- **Method:** POST
- **Content-Type:** application/json
- **Body:**
  ```json
  {
    "board": [["", "", ..., "b"], ..., ["w", "", ..., "b"]], // 8x8 array of strings: "b", "w", "", or "r"
    "player": "b" | "w",           // The symbol for the current player ("b" for black, "w" for white)
    "opponent": "b" | "w"           // The symbol for the opponent
  }
  ```
  - `board`: 8x8 array representing the current state. Each cell is:
    - `"b"`: Black piece
    - `"w"`: White piece
    - `""`: Empty cell
    - `"r"`: (optional) Recommended move/available position (can be ignored by the AI)
  - `player`: The symbol for the AI being called.
  - `opponent`: The symbol for the opponent.

### Response
- **Status:** 200 OK
- **Content-Type:** application/json
- **Body:**
  ```json
  {
    "x": 0-7,   // Row index (0-based)
    "y": 0-7    // Column index (0-based)
  }
  ```
  - `x`: Row index for the move (0 = top row, 7 = bottom row)
  - `y`: Column index for the move (0 = leftmost column, 7 = rightmost column)

### Special Cases

- **No Valid Moves**: If the AI has no valid moves, it will return coordinates outside the board range (e.g., `{"x": -1, "y": -1}`) to indicate a skip.

## Customization Options

### Adjusting the Delay

You can modify the thinking time delay in `server.js` by changing the value in the `delay()` function call:

```javascript
// Current setting: 1.5 seconds
await delay(1500);

// For faster gameplay (e.g., 0.5 seconds)
await delay(500);

// For slower gameplay (e.g., 3 seconds)
await delay(3000);
```

### Modifying AI Strategies

You can adjust the AI behavior by modifying the scoring functions in:
- `strategies/corner-domination-strategy.js` - `calculateScore()` function
- `strategies/mobility-control-strategy.js` - `calculateScore()` function

For example, to make the black player value corners even more highly:

```javascript
// Increase corner value from 100 to 200
if ((x === 0 && y === 0) || (x === 0 && y === 7) || 
    (x === 7 && y === 0) || (x === 7 && y === 7)) {
  score += 200; // Previously 100
}
```

## AI Strategies in Detail

### Corner Domination Strategy (Black Player)

The black player implements a **position-based strategy** that prioritizes:

- **Corner Dominance**: Corners are valued highest (score +100) as they cannot be flipped
- **Edge Control**: Edges are prioritized (score +5) as they're more stable than center positions
- **Piece Capture**: Moves that flip more opponent pieces receive higher scores
- **Corner-Adjacent Avoidance**: Positions next to unoccupied corners are penalized (score -20) as they often give the opponent access to corners

#### Algorithm Details:

1. Identifies all valid moves on the board
2. Calculates a score for each move based on:
   - Number of pieces captured
   - Strategic value of the position (corners, edges, etc.)
3. Selects the move with the highest score

### Mobility Control Strategy (White Player)

The white player implements a **mobility-focused strategy** that prioritizes:

- **Opponent Limitation**: Reduces opponent's future move options
- **Center Control**: Focuses on controlling the center of the board (score +3)
- **Corner Acquisition**: Still values corners highly (score +100) when available
- **Strategic Balance**: Balances immediate piece capture with long-term position advantage

#### Algorithm Details:

1. Identifies all valid moves on the board
2. For each potential move:
   - Simulates the move on a copy of the board
   - Counts how many moves the opponent would have afterward
   - Reduces the score for moves that give the opponent many options
3. Balances this mobility factor with position value and piece capture
4. Selects the move with the highest combined score

### Minimax Strategy (Any Player)

The Minimax Strategy implements a **look-ahead search algorithm** that prioritizes:

- **Optimal Decision Making**: Evaluates future board states to make the best long-term move
- **Position Evaluation**: Uses a sophisticated position weight matrix
- **Mobility Analysis**: Considers both players' future move options
- **Adaptive Depth**: Increases search depth during opening and endgame phases

#### Algorithm Details:

1. Uses the minimax algorithm with alpha-beta pruning to search multiple moves ahead
2. For each potential move:
   - Simulates the move and all possible responses to a certain depth
   - Evaluates board positions using weighted criteria
   - Selects the move that leads to the best guaranteed outcome
3. Adapts search depth based on game phase (deeper search in opening and endgame)
4. Balances position value, mobility, and piece count in its evaluation function

## Strategy Comparison

| Factor | Corner Domination | Mobility Control | Minimax |
|--------|-------------|-------------|-------------|
| Primary Focus | Position & Capture | Mobility Control | Look-ahead Search |
| Corner Value | Very High (+100) | Very High (+100) | Very High (+100) |
| Edge Value | High (+5) | Moderate | Moderate to High |
| Center Value | Low | High (+3) | Context-dependent |
| Corner-Adjacent Penalty | High (-20) | Moderate (-15) | High (-50) |
| Opponent Move Consideration | No | Yes (-0.5 per move) | Yes (full simulation) |
| Search Depth | 1 move | 1 move | 4-6 moves |
| Computation Required | Low | Low | High |

These different strategies create interesting matchups. The Corner Domination Strategy focuses on immediate position advantage, the Mobility Control Strategy takes a more forward-looking approach to limit opponent options, and the Minimax Strategy uses deep search to find optimal moves several steps ahead.
