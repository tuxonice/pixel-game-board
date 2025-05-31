# Pixel Game Board

A Vue 3 application for playing Reversi (Othello) with AI agents.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

## Important Note
This project uses Yarn package manager instead of npm to properly handle dependency resolutions for security vulnerabilities. Please continue using Yarn for all package management operations.

## AI Agents

This project includes AI agents for playing Reversi. The AI agents are located in the `ai-agents` directory and are implemented as a separate Express.js server.

### AI Agent Features

- Two distinct AI strategies:
  - **Corner Domination Strategy**: Focuses on corner positions and maximizing piece capture
  - **Mobility Control Strategy**: Focuses on limiting opponent mobility and controlling the center of the board
- RESTful API endpoints that follow the game board's API contract
- Deliberate move delays for better visualization of gameplay
- Detailed console logging of AI decision-making process

### Running the AI Agents

```bash
cd ai-agents
yarn install
yarn start
```

Then configure the game board to use the following endpoints:
- Black player: `http://localhost:3000/corner-domination`
- White player: `http://localhost:3000/mobility-control`

For more details, see the [AI Agents README](/ai-agents/README.md).

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
