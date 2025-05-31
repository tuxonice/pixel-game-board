<template>
  <div>
    <div class="row">
      <div class="col-md">    
        <div class="board">
          <table>
            <tr>
              <td class="no-border-col no-border-row"></td>
              <td class="no-border-col" v-for="(row, rowIndex) in rows" :key="rowIndex">{{row + 1}}</td>
            </tr>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <td class="no-border-row">{{ String.fromCharCode(65 + row) }}</td>
              <td v-for="(col, colIndex) in cols" :key="colIndex" :class="currentBoard[rowIndex][colIndex]">
                <span :class="currentBoard[rowIndex][colIndex]"></span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md mt-4">
        <div class="mx-auto" style="width: 350px;">
          <!-- <button type="button" class="btn btn-primary" @click="stopPlay()">Stop Game</button>&nbsp; -->
          <!-- <button type="button" class="btn btn-primary" @click="startPlay()">Start Game</button>&nbsp; -->
          <button v-if="gameOver" type="button" class="btn btn-primary" @click="resetGame()">Play Again</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import Reversi from '../Reversi'
  
export default {
  name: 'Grid',
  props: {
    blackEndPoint: String,
    whiteEndPoint: String,
  },
  mounted() {
      this.game = new Reversi()
  },
  data() {
    return {
        scoreBoard: {
            lastPlayWhite: '',
            lastPlayBlack: '',
            piecesBlack: 0,
            piecesWhite: 0,
            statusWhite: '',
            statusBlack: '',
        },
        game: {},
        playerSymbol: 'b',
        opponentSymbol: 'w',
        skipBlack: false,
        skipWhite: false,
        waitingForPlayer: false,
        gameStopped: true,
        gameOver: true,
        rows: [0, 1, 2, 3, 4, 5, 6, 7],
        cols: [0, 1, 2, 3, 4, 5, 6, 7],
        currentBoard: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', 'w', 'b', '', '', ''],
            ['', '', '', 'b', 'w', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '']
        ]
      }
  },
  methods: {
    stopPlay() {
        this.gameStopped = true
    },
    startPlay() {
        this.gameStopped = false
        if (!this.gameOver) {
          this.fetchPlay()
        }
    },
    resetGame() {
      this.scoreBoard.lastPlayWhite = ''
      this.scoreBoard.lastPlayBlack = ''
      this.scoreBoard.piecesBlack = 0
      this.scoreBoard.piecesWhite = 0
      this.scoreBoard.statusWhite = ''
      this.scoreBoard.statusBlack = ''
      this.playerSymbol = 'b'
      this.opponentSymbol = 'w'
      this.waitingForPlayer = false
      this.gameStopped = true
      this.gameOver = false
      this.currentBoard = this.game.resetBoard()
      this.gameStopped = false
      this.gameOver = false
      this.skipBlack = false
      this.skipWhite = false
      this.fetchPlay()
    },
    updatePositions(userCoords) {
      if(this.playerSymbol === 'b') {
        this.scoreBoard.statusBlack = 'Waiting...'
        this.scoreBoard.lastPlayBlack = userCoords
      } else {
        this.scoreBoard.statusWhite = 'Waiting...'
        this.scoreBoard.lastPlayWhite = userCoords
      }
    },
    updateGameScore() {
      let gameScore = this.getGameScore()
      
      if (gameScore.blackScore === 0) {
        this.gameOver = true
        this.scoreBoard.statusBlack = 'LOSER'
        this.scoreBoard.statusWhite = 'WINNER'
        this.$emit('updateHistory', {'historyBlack':'LOSER', 'historyWhite': 'WINNER'})
      }
      
      if (gameScore.whiteScore === 0) {
        this.gameOver = true
        this.scoreBoard.statusBlack = 'WINNER'
        this.scoreBoard.statusWhite = 'LOSER'
        this.$emit('updateHistory', {'historyBlack':'WINNER', 'historyWhite': 'LOSER'})
      }
      
      if (gameScore.blackScore + gameScore.whiteScore === 64 && this.gameOver === false) {
        this.gameOver = true
        
        if(gameScore.blackScore > gameScore.whiteScore) {
            this.scoreBoard.statusBlack = 'WINNER'
            this.scoreBoard.statusWhite = 'LOSER'
            this.$emit('updateHistory', {'historyBlack':'WINNER', 'historyWhite': 'LOSER'})
        } else if (gameScore.blackScore < gameScore.whiteScore) {
            this.scoreBoard.statusBlack = 'LOSER'
            this.scoreBoard.statusWhite = 'WINNER'
            this.$emit('updateHistory', {'historyBlack':'LOSER', 'historyWhite': 'WINNER'})
        } else {
            this.scoreBoard.statusBlack = 'DRAW'
            this.scoreBoard.statusWhite = 'DRAW'
            this.$emit('updateHistory', {'historyBlack':'DRAW', 'historyWhite': 'DRAW'})
        }
      }
      
      this.scoreBoard.piecesBlack = gameScore.blackScore
      this.scoreBoard.piecesWhite = gameScore.whiteScore
      
      this.$emit('update', this.scoreBoard)
    },
    getGameScore() {
      let blackScore = 0;
      let whiteScore = 0;
      for (let i=0; i<=7; i++) {
        for (let j=0; j<=7; j++) {
          if(this.currentBoard[i][j] === 'b') {
              blackScore++;
          } else if(this.currentBoard[i][j] === 'w') {
              whiteScore++;
          }
        }
      }
      
      return {'blackScore': blackScore, 'whiteScore': whiteScore}
    },
    showAvailablePositions() {
      let availablePositions = this.game.getPositionsToPlay(this.currentBoard, this.playerSymbol, this.opponentSymbol)
      availablePositions.forEach((position) => {
        this.$set(this.currentBoard[position.x], position.y, 'r')
      })
      
      return availablePositions;
    },
    clearAvailablePositions() {
      for (let i=0; i<=7; i++) {
        for (let j=0; j<=7; j++) {
          if(this.currentBoard[i][j] === 'r') {
              this.$set(this.currentBoard[i], j, '')
          }
        }
      }
    },
    tooglePlayer() {
      if (this.playerSymbol === 'b') {
        this.playerSymbol = 'w'
        this.opponentSymbol = 'b'
      } else {
        this.playerSymbol = 'b'
        this.opponentSymbol = 'w'
      }
    },
    fetchPlay() {
      
      if(this.waitingForPlayer){
        return
      }
      
      if(this.gameStopped) {
        // console.log('Game stopped')
        return
      }
      
      if(this.gameOver) {
        // console.log('Game finished')
        this.updateGameScore()
        return
      }
      
      if(this.playerSymbol === 'b') {
        this.scoreBoard.statusBlack = 'Thinking...'
      } else {
        this.scoreBoard.statusWhite = 'Thinking...'
      }
      
      //Update score board
      this.$emit('update', this.scoreBoard)
      //Get and show available positions
      let availablePositions = this.showAvailablePositions()
      if (!Object.keys(availablePositions).length) {
        
        if(this.playerSymbol === 'b') {
          this.skipBlack = true
        }
        
        if(this.playerSymbol === 'w') {
          this.skipWhite = true
        }
        
        this.tooglePlayer()
        // console.log('Skip ' + this.playerSymbol)
        if(!(this.skipWhite && this.skipBlack)) {
          this.fetchPlay()
        }
        return;
      }
      
      this.waitingForPlayer = true;
      let endpoint = this.playerSymbol === 'b' ? this.blackEndPoint : this.whiteEndPoint
      axios.post(endpoint, {
        board: this.game.cloneCurrentBoard(this.currentBoard),
        player: this.playerSymbol,
        opponent: this.opponentSymbol
      })
      .then((response) => {
        this.clearAvailablePositions()
        this.$set(this.currentBoard[response.data.x], response.data.y, this.playerSymbol)
        
        availablePositions.forEach((position) => {
          if(position.x === response.data.x && position.y === response.data.y) {
              position.positions.forEach((coords) => {
                  this.$set(this.currentBoard[coords[0]], coords[1], this.playerSymbol)
              })
          }
        })
        
        if(this.playerSymbol === 'b') {
          this.skipBlack = false
        }
        
        if(this.playerSymbol === 'w') {
          this.skipWhite = false
        }
        
        //Get and update coords from last play
        let userCoords = this.game.getCoords(response.data.x, response.data.y)
        this.updatePositions(userCoords)
        this.updateGameScore()
        this.tooglePlayer()
        this.waitingForPlayer = false
        this.fetchPlay()
      })
      .catch(function (error) {
        // eslint-disable-next-line
        console.log(error);
      });
    },
  },
}
</script>
<style scoped>
table {border:1px solid #000; border-collapse: collapse;}
td {border:1px solid #000; width:70px; height:70px; text-align:center}
td.no-border-col {
  border-top: 1px solid #FFF;
  border-left: 1px solid #FFF;
  border-right: 1px solid #FFF;
}
td.no-border-row {
  border-top: 1px solid #FFF;
  border-left: 1px solid #FFF;
  border-bottom: 1px solid #FFF;
}

td > span {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  display: inline-block;
}

td.r {
    background-color:#ccc;
}

span.w {
    background-color: #FFF;
    border: 1px solid #000
}

span.b {
    background-color: #000;
    border: 1px solid #FFF
}
.board {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
