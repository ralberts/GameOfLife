'use strict';

angular.module('GameOfLifeApp')
  .controller('MainCtrl', function ($scope, $timeout, boardService) {
    var stop;
    var xLength = 5;
    var yLength = 5;
    // Get initial board

    var board = boardService.getBoard(xLength, yLength);

    // Set the board to display
    $scope.board = board;

    // The button to start the game was clicked
    $scope.startGame = function() {
      stop = $timeout(function nextGenerationInterval() {

        $scope.board = boardService.nextGeneration();
        stop = $timeout(nextGenerationInterval, 1000);

      }, 1000);
    };

    // The button was clicked to stop the game.
    $scope.stopGame = function() {
      $timeout.cancel(stop);
    };

    // The reset button clicked
    $scope.resetGame = function() {
      boardService.setBoard(null);
      $scope.board = boardService.getBoard(xLength, yLength);
    };

    // If the view is destroyed make sure to end the game.
    $scope.$on('$destroy', function() {
      $timeout.cancel(stop);
    });

  });
