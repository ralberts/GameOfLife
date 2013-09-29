'use strict';

describe('Service: boardService', function () {

  // load the service's module
  beforeEach(module('GameOfLifeApp'));

  // instantiate service
  var boardService;
  beforeEach(inject(function (_boardService_) {
    boardService = _boardService_;
  }));


  var board = [[0,1,0,0,0],
               [1,0,0,1,1],
               [1,1,0,0,1],
               [1,0,0,0,1]];

  it('should find the correct neighbors', function() {
    expect(boardService._findLiveNeighbors(board, 0, 0)).toBe(2);
    expect(boardService._findLiveNeighbors(board, 3, 0)).toBe(2);
    expect(boardService._findLiveNeighbors(board, 3, 4)).toBe(1);
    expect(boardService._findLiveNeighbors(board, 2, 2)).toBe(2);

  });

  it('should do something', function () {
    expect(!!boardService).toBe(true);
  });

});

describe('Service: boardService evolveCell', function () {

  // load the service's module
  beforeEach(module('GameOfLifeApp'));

  // instantiate service
  var boardService;
  beforeEach(inject(function (_boardService_) {
    boardService = _boardService_;
  }));


  var board = [[0,1,0,0,0],
               [1,0,0,1,1],
               [1,1,0,1,1],
               [1,0,0,0,1]];

  /**
   * Rules
   * 1) Any live cell with fewer than two live neighbours dies (under-population)
   * 2) Any live cell with two or three live neighbours lives on to the next generation (survival)
   * 3) Any live cell with more than three live neighbours dies (overcrowding)
   * 4) Any dead cell with exactly three live neighbours becomes a live cell (reproduction)
   */

  it('should evolve cell correctly', function() {
    var x = 0, y = 0;
    expect(boardService._evolveCell(board, board[x][y], x, y)).toBe(0);

    //Under-population
    x = 0, y = 1
    expect(boardService._evolveCell(board, board[x][y], x, y)).toBe(0);

    //Survival
    x = 2, y = 1
    expect(boardService._evolveCell(board, board[x][y], x, y)).toBe(1);

    //Reproduction
    x = 3, y = 1
    expect(boardService._evolveCell(board, board[x][y], x, y)).toBe(1);

    //Overcrowding
    x = 2, y = 4
    expect(boardService._evolveCell(board, board[x][y], x, y)).toBe(0);

  });

});



