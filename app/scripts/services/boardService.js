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
	 * For cells along the side it will know the valid regions of it's neighbors.
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

	/**
	 * Checks the cells neighbors and determines if the cell dies or lives in
	 * the next generation.
	 */
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

	/**
	 * Evolves board to the next generation by passing by each cell to determine
	 * the next generation.
	 */
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
      createBoard: function (xLength, yLength) {
        var board;
        if(!xLength && !xLength) {
          board = [[0,1,0,0,0],
                   [1,0,0,1,1],
                   [1,1,0,0,1],
                   [0,1,0,0,0],
                   [1,0,0,0,1]];
        } else {
          board = [];
          for (var x = 0; x < xLength; x++) {
            var cols = [];
            for (var y = 0; y < yLength; y++) {
              cols.push(Math.floor(Math.random() * 2));
            }
            board.push(cols);
          }
        }

        return board;
      },

      /**
       * Retrieve the current board.  If one has not been created it will
       * create it.
       */
      getBoard: function(xLength, yLength) {
        if(!board) {
          this.setBoard(this.createBoard(xLength, yLength));
        }

        return board;
      },

      /**
       * @param newBoard to set as the current generation
       */
      setBoard: function(newBoard) {
        board = newBoard;
      },

      /**
       * Progress to the next generation
       * @returns new board containing new cells.
       */
      nextGeneration: function() {
        var newBoard = evolve(this.getBoard());
        this.setBoard(newBoard);
        return newBoard;
      },

      /**
       * For Unit Testing
       */
      _findLiveNeighbors: findLiveNeighbors,
      _evolveCell: evolveCell
    };
});