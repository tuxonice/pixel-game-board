const express = require('express');
const cors = require('cors');
const { blackPlayerStrategy } = require('./strategies/corner-domination-strategy');
const { whitePlayerStrategy } = require('./strategies/mobility-control-strategy');

const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Middleware
app.use(cors());
app.use(express.json());

// Corner Domination Strategy endpoint
app.post('/corner-domination', async (req, res) => {
  try {
    const { board, player, opponent } = req.body;
    
    // Validate request data
    if (!board || !player || !opponent) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    // Add a delay to see the moves (1.5 seconds)
    console.log('Black player thinking...');
    await delay(1500);
    
    // Get move using black player strategy
    const move = blackPlayerStrategy(board, player, opponent);
    console.log('Black player move:', move);
    
    // Return the move
    res.json(move);
  } catch (error) {
    console.error('Error in black player endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mobility Control Strategy endpoint
app.post('/mobility-control', async (req, res) => {
  try {
    const { board, player, opponent } = req.body;
    
    // Validate request data
    if (!board || !player || !opponent) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    // Add a delay to see the moves (1.5 seconds)
    console.log('White player thinking...');
    await delay(1500);
    
    // Get move using white player strategy
    const move = whitePlayerStrategy(board, player, opponent);
    console.log('White player move:', move);
    
    // Return the move
    res.json(move);
  } catch (error) {
    console.error('Error in white player endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`AI agents server running on port ${PORT}`);
  console.log(`Corner Domination Strategy endpoint: http://localhost:${PORT}/corner-domination`);
  console.log(`Mobility Control Strategy endpoint: http://localhost:${PORT}/mobility-control`);
});
