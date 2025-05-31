<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md p-t-5">
        <h2 class="text-center">Pixel Game Board</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-md">
        <h4 class="text-center"><span class="black"></span> Player 1</h4>
        <div class="alert alert-success" role="alert">
          Status: {{statusBlack}}
        </div>
        <div class="alert alert-info" role="alert">
          Last Play: {{lastPlayBlack}}
        </div>
        <div class="alert alert-warning" role="alert">
          Pieces: {{piecesBlack}}
        </div>
        <div class="alert alert-danger" role="alert">
          Win rate: {{ blackWinRate }} %
        </div>
        <div class="form-group">
          <textarea class="form-control" id="history-black" rows="10" v-model="historyBlack"></textarea>
        </div>
        <div class="form-group">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <select class="form-control" v-model="blackStrategy" @change="onBlackStrategyChange">
                <option value="">Custom Endpoint</option>
                <option value="corner-domination">Corner Domination</option>
                <option value="mobility-control">Mobility Control</option>
                <option value="minimax">Minimax</option>
              </select>
            </div>
            <input type="text" class="form-control" id="blackEndPoint" placeholder="Player 1 endpoint" v-model="blackEndPoint">
          </div>
        </div>
      </div>
      <div class="col-md">
        <grid 
          @update="onUpdateChild" 
          @updateHistory="onUpdateHistory" 
          :black-end-point="blackEndPoint" 
          :white-end-point="whiteEndPoint"
        >
        </grid>
      </div>
      <div class="col-md">
        <h4 class="text-center"><span class="white"></span> Player 2</h4>
        <div class="alert alert-success" role="alert">
          Status: {{statusWhite}}
        </div>
        <div class="alert alert-info" role="alert">
          Last Play: {{lastPlayWhite}}
        </div>
        <div class="alert alert-warning" role="alert">
          Pieces: {{piecesWhite}}
        </div>
        <div class="alert alert-danger" role="alert">
          Win rate: {{ whiteWinRate }} %
        </div>
        <div class="form-group">
          <textarea class="form-control" id="history-white" rows="10" v-model="historyWhite"></textarea>
        </div>
        <div class="form-group">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <select class="form-control" v-model="whiteStrategy" @change="onWhiteStrategyChange">
                <option value="">Custom Endpoint</option>
                <option value="corner-domination">Corner Domination</option>
                <option value="mobility-control">Mobility Control</option>
                <option value="minimax">Minimax</option>
              </select>
            </div>
            <input type="text" class="form-control" id="whiteEndPoint" placeholder="Player 2 endpoint" v-model="whiteEndPoint">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Grid from './Grid.vue'  

export default {
  name: 'Wrapper',
  components: {
    Grid
  },
  data() {
    return {
      lastPlayWhite: '--',
      lastPlayBlack: '--',
      piecesBlack: 2,
      piecesWhite: 2,
      statusWhite: 'Ready',
      statusBlack: 'Ready',
      historyBlack: '',
      historyWhite: '',
      matchCount: 0,
      blackWinCount: 0,
      whiteWinCount: 0,
      blackEndPoint: process.env.VUE_APP_AI_ENDPOINT_BLACK || '',
      whiteEndPoint: process.env.VUE_APP_AI_ENDPOINT_WHITE || '',
      blackStrategy: '',
      whiteStrategy: '',
      baseApiUrl: 'http://localhost:3000'
    }
  },
  computed: {
    blackWinRate() {
      return this.matchCount === 0 ? '0' : Number.parseFloat(((this.blackWinCount / this.matchCount) * 100)).toFixed(2)
    },
    whiteWinRate() {
      return this.matchCount === 0 ? '0' : Number.parseFloat(((this.whiteWinCount / this.matchCount) * 100)).toFixed(2)
    }
  },
  methods: {
    onUpdateChild(value) {
      this.lastPlayWhite = value.lastPlayWhite
      this.lastPlayBlack = value.lastPlayBlack
      this.piecesBlack = value.piecesBlack
      this.piecesWhite = value.piecesWhite
      this.statusWhite = value.statusWhite
      this.statusBlack = value.statusBlack
    },
    onUpdateHistory(value) {
      this.matchCount++;
      this.historyBlack = "Match " + this.matchCount + ": " + value.historyBlack + "\n" + this.historyBlack
      this.historyWhite = "Match " + this.matchCount + ": " + value.historyWhite + "\n" + this.historyWhite
      if(this.piecesBlack > this.piecesWhite) {
          this.blackWinCount++
      }
      if(this.piecesBlack < this.piecesWhite) {
          this.whiteWinCount++
      }
    },
    onBlackStrategyChange() {
      if (this.blackStrategy) {
        this.blackEndPoint = `${this.baseApiUrl}/${this.blackStrategy}`;
      } else {
        // Clear the input when selecting Custom Endpoint
        this.blackEndPoint = '';
      }
    },
    onWhiteStrategyChange() {
      if (this.whiteStrategy) {
        this.whiteEndPoint = `${this.baseApiUrl}/${this.whiteStrategy}`;
      } else {
        // Clear the input when selecting Custom Endpoint
        this.whiteEndPoint = '';
      }
    }
  }
}
</script>
<style scoped>

h4 > span.black {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: inline-block;
  background-color: #000;
  border: 1px solid #FFF;
  margin-bottom: -5px;
}

h4 > span.white {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  display: inline-block;
  background-color: #FFF;
  border: 1px solid #000;
  margin-bottom: -5px;
}

.input-group-prepend {
  margin-right: 5px;
}

#blackEndPoint {
  border-radius:.25rem;
}

#whiteEndPoint {
  border-radius:.25rem;
}
</style>
