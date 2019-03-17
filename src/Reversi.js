export default function Reversi() {

    this.cloneCurrentBoard = function(board) {
      let clonedBoard = [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '']
        ];
      for (let i=0; i<=7; i++) {
        for (let j=0; j<=7; j++) {
          if(board[i][j] !== 'r') {
              clonedBoard[i][j] = board[i][j]
          }
        }
      }
      
      return clonedBoard
    },
    this.resetBoard = function() {
      let board = [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', 'w', 'b', '', '', ''],
            ['', '', '', 'b', 'w', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '']
        ];
      
      return board
    },
    this.getOpponentPositions = function(board, playerSymbol, opponentSymbol) {
      
      let opponentPositions = []
      for (let i=0; i<8; i++) {
            for (let j=0; j<8; j++) {
                if (board[i][j] === opponentSymbol) {
                    opponentPositions.push([i, j])
                }
            }
        }
        
        return opponentPositions;
    },
    this.getPositionsToPlay = function(board, playerSymbol, opponentSymbol) {
        
        let opponentPositions = this.getOpponentPositions(board, playerSymbol, opponentSymbol);
        
        let positionsToPlay = [];
        //check empty positions arround each opponent position
        opponentPositions.forEach ((opponentPosition) => {
            for (let x=-1; x<=1; x++) {
                for (let y=-1; y<=1; y++) {
                    let i = opponentPosition[0];
                    let j = opponentPosition[1];
                    if(i+x < 0 || i+x > 7 || j+y < 0 || j+y > 7) {
                        continue;
                    }
                    if (board[i+x][j+y] === '') {
                        let temp  = this.getScoreForPlay(i+x, j+y, board, playerSymbol, opponentSymbol);
                        let score = temp[0]
                        let positionsToChange = temp[1]
                        if(score > 0) {
                            positionsToPlay.push({"x": i+x, "y": j+y, "score": score, "positions": positionsToChange});
                        }
                    }
                }
            }
        });
        
        return positionsToPlay;
    },
    this.getScoreForPlay = function (i, j, board, playerSymbol, opponentSymbol) {
      
        let totalScore = 0;
        let positionsToChange = [];
        for(let x=-1; x<=1; x++) {
            for(let y=-1; y<=1; y++) {
                if(x === 0 && y === 0) continue;
                let ni = i + x;
                let nj = j + y;
                let score = 0;
                let count = 0;
                let positions = [];
                while(ni >= 0 && ni <=7 && nj >= 0 && nj <=7 && count++ < 50){
                    if(board[ni][nj] === opponentSymbol) {
                        positions.push([ni, nj]);
                        score++;
                        ni += x;
                        nj += y;
                    }else if(board[ni][nj] === playerSymbol) {
                        totalScore += score;
                        positionsToChange = positionsToChange.concat(positions);
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        
        return [totalScore, positionsToChange];
    },
    this.getCoords = function(x,y) {
        return String.fromCharCode(65 + x) + (y + 1)
    }
}
