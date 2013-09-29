'use strict';

angular.module('GameOfLifeApp')
  .controller('MainCtrl', function ($scope, $timeout, boardService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var stop;
    var board = boardService.getBoard();

    $scope.board = board;

    $scope.startGame = function() {
      stop = $timeout(function() {

        $scope.board = boardService.nextGeneration();

      }, 1000);
    };


    console.log(board);

    $scope.stopGame = function() {
      $timeout.cancel(stop);
    };


  });
