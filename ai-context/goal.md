# Project Goal: Reversi AI Game Board

## Overview
This project is a web-based game board for playing Reversi (Othello), built with Vue 2. Unlike traditional Reversi games where a human plays against another human or AI, this board is designed to facilitate automated matches between two AI agents. Each agent is represented by an HTTP endpoint that provides moves for its respective color (black or white).

## How It Works
- The user provides two HTTP endpoints (one for each player) via input boxes in the UI.
- The board acts as a referee, requesting moves from each endpoint in turn and updating the game state accordingly.
- The endpoints are expected to return valid moves for their respective colors when called.
- The board manages all game logic, including move validation, piece flipping, turn switching, and win/draw detection.
- The UI displays the board state, last moves, piece counts, win rates, and match history for both players.

## Key Features
- **Automated Play:** No human input for moves; all moves are fetched from the specified endpoints.
- **Reversi Rules Enforcement:** The board enforces all standard Reversi rules, including valid move checking, piece flipping, and endgame detection.
- **Match Tracking:** Displays the number of matches played, win rates, and match history for both black and white players.
- **Configurable Endpoints:** Users can specify/change the HTTP endpoints for each player at any time.
- **Vue 2 UI:** Modern, responsive interface for monitoring the game and its progress.

## Intended Use Cases
- **AI Competitions:** Benchmark different Reversi AI agents against each other by providing their endpoints.
- **AI Development:** Test and debug Reversi AI agents in a controlled, visual environment.
- **Demonstrations:** Showcase automated Reversi matches for educational or entertainment purposes.

## Example Workflow
1. User enters the endpoints for Player 1 (black) and Player 2 (white).
2. The board alternates between calling each endpoint, sending the current board state and receiving the next move.
3. The board updates the UI and game state after each move.
4. When the game ends, results are recorded and displayed.
5. The user may reset the board or change endpoints to start a new match.

---

This file describes the core objective and context for the project, ensuring clarity for future development, collaboration, or integration with other AI systems.


## Expected API Contract for AI Endpoints

Each player (black and white) is represented by an HTTP endpoint. The board POSTs a request to the appropriate endpoint on each turn, and expects a response containing the move.

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

### Example
**Request:**
```json
{
  "board": [["", "", "", "", "", "", "", ""], ..., ["", "", "", "b", "w", "", "", ""]],
  "player": "b",
  "opponent": "w"
}
```

**Response:**
```json
{
  "x": 2,
  "y": 3
}
```

### Notes
- The AI must return a valid move according to Reversi rules.
- If no valid moves are available, the AI may return a move outside the board or a special value (the board will handle skips).
- The board will alternate requests between the two endpoints as the game progresses.
