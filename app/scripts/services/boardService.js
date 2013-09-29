'use strict';

angular.module('GameOfLifeApp')
  .factory('boardService', function () {

  /* CONSTANTS - Couldn't use const because of testing in strict mode */
  var REPRODUCTION_POINT = 3;
  var OVERCROWDING_POINT = 3;
  var UNDER_POPULATION_POINT = 2;
  var SURVIVAL_POINT = [2,3];
  var LIVE = 1;
  var DEAD = 0;

  /*
   * This is a multi-dimensional array of board[x][y]
   *
   * Example:
   *   board = [[0,1,0,0,0],
   *            [1,0,0,1,1],
   *            [1,1,0,0,1],
   *            [1,0,0,0,1]];
   */
	var board;

	/**
	 * This will go through the possible 8 neighbors of a cell.
	 *
	 * For cells along the side it will know the valid regions of the cell.
	 */
	function findLiveNeighbors(board, xCurr, yCurr) {
	  var rowLimit = board.length-1;
	  var columnLimit = board[0].length-1;
	  var i = xCurr;
	  var j = yCurr;
	  var result = 0;

	  for(var x = Math.max(0, i-1); x <= Math.min(i+1, rowLimit); x++) {
	    for(var y = Math.max(0, j-1); y <= Math.min(j+1, columnLimit); y++) {
	      if(x !== i || y !== j) {
	        if(board[x][y] === LIVE) {
	          result++;
	        }
	      }
	    }
	  }

	  return result;
	}

	function deadCell(cell, liveNeighbors) {
	  return liveNeighbors === REPRODUCTION_POINT ? LIVE : DEAD;
	}

	function liveCell(cell, liveNeighbors) {
	  var result = cell;

	  //1) Any live cell with fewer than two live neighbours dies (under-population)
	  if(liveNeighbors < UNDER_POPULATION_POINT) {
	    result = DEAD;

	  //2) Any live cell with two or three live neighbours lives on to the next generation (survival)
	  } else if(liveNeighbors === SURVIVAL_POINT[0] || liveNeighbors === SURVIVAL_POINT[1]) {
	    result = LIVE;

	  //3) Any live cell with more than three live neighbours dies (overcrowding)
	  } else if(liveNeighbors >= OVERCROWDING_POINT) {
	    result = DEAD;
	  }

	  return result;
  }

	function evolveCell(board, cell, x, y) {
	  var result;
	  var liveNeighbors = findLiveNeighbors(board, x, y);
	  if(cell === DEAD) {
	    result = deadCell(cell, liveNeighbors);
	  } else {
	    result = liveCell(cell, liveNeighbors);
	  }

	  return result;
	}

	function evolve(board) {
	  var evolvedCell;
    var evolvedBoard;
    evolvedBoard = angular.copy(board);

	  angular.forEach(board, function(row, x){
	    angular.forEach(row, function(cell, y) {
	      evolvedCell = evolveCell(board, cell, x, y);
	      evolvedBoard[x][y] = evolvedCell;
	    });
	  });

	  return evolvedBoard;
	}

    // Public API
  return {
      /**
       * This will create a board of random cells of either alive (1) or dead (0).
       *
       * As per the directions, it is ambiguous whether the "input" should be human
       * or random.  This function generates a random game board.
       */
      createBoard: function () {
        board = [[0,1,0,0,0], //Keep for testing
                 [1,0,0,1,1],
                 [1,1,0,0,1],
                 [0,1,0,0,0],
                 [1,0,0,0,1]];
        return board;
      },

      /**
       * Retrieve the current board.  If one has not been created it will
       * create it.
       */
      getBoard: function() {
        if(!board) {
          board = this.createBoard();
        }

        return board;
      },


      nextGeneration: function() {
        this.board = evolve(this.getBoard());
        return this.board;
      },

      /**
       * For Unit Testing
       */
      _findLiveNeighbors: findLiveNeighbors,
      _evolveCell: evolveCell
    };
});