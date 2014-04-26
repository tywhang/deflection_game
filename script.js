var direction = 'right';
var triCount = 1;
var gameNumber = 1;
var game1 = [[360, 80],['bottomRight', '200', '200'], ['topLeft', '0', '80'], ['bottomRight', '0', '200'], ['topRight', '200', '0']];
var ballX = 0;
var ballY = 0;
var adjX = 0;
var adjY = 0;
var winX = game1[0][0];
var winY = game1[0][1];
var cont = true;
var launch = false;
var game;
var ball;


var triArray = [['topLeft', 0], ['topRight', 1], ['bottomRight', 2], ['bottomLeft', 3]];
var dirHash = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
var cTri = [[['left', 0], ['up', 0], ['down', -40], ['right', -40]], //topLeft
        [['down', 40], ['up', 0], ['right', 0], ['left', -40]],   //topRight
        [['up', 40], ['left', 40], ['right', 0], ['down', 0]],   //bottomRight
        [['left', 0], ['right', 40], ['up', -40], ['down', 0]]];   //bottomLeft


$(document).ready(function() {
  $('.score').append(gameNumber);
});

$(document).on('keydown', function(event) {
  if(event.which == 78) {
    game = new Game();
    game.loadLevel();
  } else if(event.which == 32 && !launch) {
    launch = true;
    ball = new Ball();
    ball.drawBall();
  }
});

function Ball() {
  this.drawBall = function() {
    $('#gameBoard').prepend('<div class="ball"></div>');
    this.moveBall();
  },

  this.moveBall = function() {
    this.touch();
    if (cont) {
      if (direction == 'right') {
        this.move('right', 40);
      } else if(direction == 'down') {
        this.move('down', 40);
      } else if(direction == 'left') {
        this.move('left', -40);
      } else {
        this.move('down', -40);
      }
      this.moveBall();
    }
  },

  this.touch = function() {
    if (ballX == winX && ballY == winY) {
      game.winSequence();
    } else if (ballX > 360 || ballX < 0 || ballY > 360 || ballX < 0) {
      game.loseSequence();
    } else {
      for(var i = 1; i < game1.length; i++) {
        if (adjX == game1[i][1] && adjY == game1[i][2]) {
          this.changeDirection(i);
        }
      }
    }
  },

  this.move = function(direction, units) {
    if (direction == 'right' || direction == 'left') {
      ballX += units;
      adjX = ballX + units;
      adjY = ballY;
      $('.ball').animate({left: '+=' + units + 'px'}, 150);
    } else {
      ballY += units;
      adjX = ballX;
      adjY = ballY + units;
      $('.ball').animate({top: '+=' + units + 'px'}, 150);
    }
  },

  this.changeDirection = function(i) {
    for (var j = 0; j < triArray.length; j++) {
      if ($('.tri' + i).hasClass(triArray[j][0])) {
        this.move(direction, cTri[j][dirHash[direction]][1]);
        direction = cTri[j][dirHash[direction]][0];
      }
    }
  }
}

function Game() {
  this.loadLevel = function() {
    // Adds triangles
    for (var i = 1; i < game1.length; i++) {
      var tri = new Triangle();
      tri.add(game1[i][0], game1[i][1], game1[i][2]);
    }
    
    // Adds End spot
    $('#gameBoard').prepend('<div class="end"></div>');
    $('.end').css('left', winX + 'px').css('top', winY + 'px');
    
  },

  this.winSequence = function() {
    $('.win').removeClass('hide');
    $('.end').css('background', 'red');
    cont = false;
  },

  this.loseSequence = function() {
    $('.lose').removeClass('hide');
    cont = false;
  }
}

function Triangle() {
  this.add = function(orientation, xPosition, yPosition) {
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













