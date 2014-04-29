var gameNumber = 1;
var ballSizeRatio = 40;
var gameLevels = [[[[[9, 2], [4, 7]], [[0, 0, 'right'], [1, 9, 'right']]],
                      ['bottomRight', 5, 5], ['topLeft', 0, 2], ['bottomLeft', 0, 5], ['topRight', 5, 0], ['bottomRight', 9, 9]],
                  [[[[9, 2]], [[2, 9, 'up']]], 
                      ['topLeft', 2, 0], ['topRight', 4, 0], ['bottomLeft', 4, 2]]

                  ];
var winX;
var winY;
var cont = true;
var launch = false;
var ball = [];
var roundWin;


var triArray = [['topLeft', 0], ['topRight', 1], ['bottomRight', 2], ['bottomLeft', 3]];
var dirHash = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
var cTri = [[['left', 0], ['up', 0], ['down', -40], ['right', -40]], //topLeft
        [['down', 40], ['up', 0], ['right', 0], ['left', -40]],   //topRight
        [['up', 40], ['left', 40], ['right', 0], ['down', 0]],   //bottomRight
        [['left', 0], ['right', 40], ['up', -40], ['down', 0]]];   //bottomLeft


/*

Create a try again method.

When player loses. Create a try again button.

This button should work like the nextRoundButton.

However it shouldn't increment the gameNumber.


Action

Refactor the nextRound button so that it take a parameter as to whether or not to increment or not

*/


$(document).ready(function() {
  $('#gameBoard').append('<button type="button" class="button nextGameButton roundSelector hide" onclick="game.clearBoard(true)">Next Round</button>');
  $('#gameBoard').append('<button type="button" class="button tryAgain roundSelector hide" onclick="game.clearBoard(false)">Try Again</button>');
});

$(document).on('keydown', function(event) {
});

function start() {
  $('.end').css('background', 'yellow');
  $('.score').html(gameNumber);
  $('.start').addClass('hide');
  $('.launch').removeClass('hide');
  $('#game').fadeTo('slow', 1);
  game = new Game();
  game.loadLevel();
  launch = false;
  roundWin = true;
  var ballDirectory = gameLevels[gameNumber - 1][0][1];
  for (var i = 0; i < ballDirectory.length; i++) {
    ball[i] = new Ball(ballDirectory[i][0] * ballSizeRatio, ballDirectory[i][1] * ballSizeRatio, ballDirectory[i][2], i);
    ball[i].drawBall();
  }
}

function launchBall() {
  $('.launch').addClass('hide');
  $('.arrow').fadeOut();
  for (var i = 0; i < ball.length; i++) {
    cont = true;
    ball[i].moveBall();
    if (i == ball.length - 1 && roundWin) {  
      $('.ball-0').animate({height: '+= 0px'}, function() {
        $('#gameBoard').children(":not('.nextGameButton')").fadeTo('slow', 0.3);
        $('.ball-0').css({margin: '5px', height: '30px', width: '30px'}); 
        $('.win').removeClass('hide');
        $('.end').css('background', 'red');
        $('.nextGameButton').removeClass('hide').addClass('center');
      });
    }
  }
}

function Ball(ballX, ballY, direction, number) {
  this.direction = direction;
  this.number = number;
  this.ballX = ballX;
  this.ballY = ballY;
  this.adjX;
  this.adjY;

  this.drawBall = function() {
    $('#gameBoard').prepend('<div class="arrow arrow-' + this.direction + ' arrow-' + this.number +'"></div><div class="ball ball-' + this.number + '"></div>');
    $('.arrow-' + this.number).css({left: this.ballX + 'px', top: this.ballY + 'px'});
    $('.ball-' + this.number).css({left: this.ballX + 'px', top: this.ballY + 'px'});
  },

  this.moveBall = function() {
    this.touch();
    console.log(cont);
    if (cont) {
      if (this.direction == 'right') {
        this.move('right', 40);
      } else if(this.direction == 'down') {
        this.move('down', 40);
      } else if(this.direction == 'left') {
        this.move('left', -40);
      } else {
        console.log('work');
        this.move('up', -40);
      }
      this.moveBall();
    }
  },

  this.touch = function() {
    if (this.ballX == winX && this.ballY == winY) {
      cont = false;
    // Lose Sequence
    } else if (this.ballX > 360 || this.ballX < 0 || this.ballY > 360 || this.ballY < 0) {
      cont = false;
      roundWin = false;
      $('.ball').animate({height: '+= 0px'}, function() {
        $('.lose').removeClass('hide');
        $('.tryAgain').removeClass('hide').addClass('center');
      });
    } else {
      for(var i = 1; i < gameLevels[gameNumber - 1].length; i++) {
        if (this.adjX == gameLevels[gameNumber - 1][i][1] * ballSizeRatio && this.adjY == gameLevels[gameNumber - 1][i][2]*ballSizeRatio) {
          this.changeDirection(i);
        }
      }
    }
  },

  this.move = function(direction, units) {
    console.log(direction);
    if (direction == 'right' || direction == 'left') {
      this.ballX += units;
      this.adjX = this.ballX + units;
      this.adjY = this.ballY;
      $('.ball-' + this.number).animate({left: '+=' + units + 'px'}, 50);
    } else {
      this.ballY += units;
      this.adjX = this.ballX;
      this.adjY = this.ballY + units;
      $('.ball-' + this.number).animate({top: '+=' + units + 'px'}, 50);
    }
  },

  this.changeDirection = function(i) {
    for (var j = 0; j < triArray.length; j++) {
      if ($('.tri' + i).hasClass(triArray[j][0])) {
        this.move(this.direction, cTri[j][dirHash[this.direction]][1]);
        this.direction = cTri[j][dirHash[this.direction]][0];
      }
    }
  }
}

function Game() {
  winX = gameLevels[gameNumber - 1][0][0][0][0] * ballSizeRatio;
  winY = gameLevels[gameNumber - 1][0][0][0][1] * ballSizeRatio;

  this.loadLevel = function() {
    // Adds triangles
    for (var i = 1; i < gameLevels[gameNumber - 1].length; i++) {
      var tri = new Triangle();
      tri.add(gameLevels[gameNumber - 1][i][0], (gameLevels[gameNumber - 1][i][1] * ballSizeRatio), (gameLevels[gameNumber - 1][i][2]) * ballSizeRatio, i);
    }
    
    // Adds End spot
    $('#gameBoard').prepend('<div class="end"></div>');
    $('.end').css('left', winX + 'px').css('top', winY + 'px');
  }

  this.clearBoard = function(increment) {
    if (increment) {
      gameNumber++;
      $('.win').addClass('hide');
    }
    if(!increment) {
      $('.lose').addClass('hide');
    }
    $('.nextGameButton').addClass('hide').removeClass('center');
    $('.tryAgain').addClass('hide').removeClass('center');
    $('.triangle').remove();
    $('.ball').remove();
    $('.arrow').remove();
    triCount = 0;
    start();
  }
}

function Triangle() {
  this.add = function(orientation, xPosition, yPosition, triCount) {
    $('#gameBoard').append('<div class="tri' + triCount + '"></div>');
    $('.tri' + triCount).addClass(orientation).addClass('triangle');
    $('.tri' + triCount).css('left', xPosition + 'px').css('top', yPosition + 'px');
    triCount++;
  }
}

$(document).on('click', '.triangle', function() {
  if (!launch) {
    if($(this).hasClass('topLeft')) {
      $(this).removeClass('topLeft').addClass('topRight');
    } else if($(this).hasClass('topRight')) {
      $(this).removeClass('topRight').addClass('bottomRight');
    } else if($(this).hasClass('bottomRight')) {
      $(this).removeClass('bottomRight').addClass('bottomLeft');
    } else {
      $(this).removeClass('bottomLeft').addClass('topLeft');
    }
  }
});