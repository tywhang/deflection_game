var gNum = 1;
var bSize = 40;
var gLevels = [[[[[9, 2], [4, 7]], [[0, 0, 'right'], [1, 9, 'right']]],
                  ['bottomRight', 5, 5], ['topLeft', 0, 2], ['bottomLeft', 0, 5], ['topRight', 5, 0], ['bottomRight', 9, 9]],
               [[[[9, 2]], [[2, 9, 'up']]], 
                  ['topLeft', 2, 0], ['topRight', 4, 0], ['bottomLeft', 4, 2]]
                  ];

var cont = true;
var launch = false;
var ball = [];
var roundWin;
var winX;
var winY;


var triArray = [['topLeft', 0], ['topRight', 1], ['bottomRight', 2], ['bottomLeft', 3]];
var dirHash = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
var cTri = [[['left', 0], ['up', 0], ['down', -40], ['right', -40]], //topLeft
        [['down', 40], ['up', 0], ['right', 0], ['left', -40]],   //topRight
        [['up', 40], ['left', 40], ['right', 0], ['down', 0]],   //bottomRight
        [['left', 0], ['right', 40], ['up', -40], ['down', 0]]];   //bottomLeft

function start() {
  $('.end').css('background', 'yellow');
  $('.score').html(gNum);
  $('.start').addClass('hide');
  $('.launch').removeClass('hide');
  $('#game').fadeTo('slow', 1);
  game = new Game();
  game.loadLevel();
  launch = false;
  roundWin = true;
  var bArray = gLevels[gNum - 1][0][1];
  for (var i = 0; i < bArray.length; i++) {
    ball[i] = new Ball(bArray[i][0] * bSize, bArray[i][1] * bSize, bArray[i][2], i);
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
        $('.win').removeClass('hide');
        $('.end').css('background', 'red');
        $('.nextGameButton').removeClass('hide').addClass('center');
      });
    }
  }
}

function Ball(bX, bY, direction, bNum) {
  this.direction = direction;
  this.bNum = bNum;
  this.bX = bX;
  this.bY = bY;

  this.drawBall = function() {
    $('#gameBoard').prepend('<div class="arrow arrow-' + this.direction + ' arrow-' + this.bNum + '" style="left: ' + this.bX + 'px; top: ' + this.bY + 'px"></div>');
    $('#gameBoard').prepend('<div class="ball ball-' + this.bNum + '" style="left: ' + this.bX + 'px; top: ' + this.bY + 'px"></div>');
  },

  this.moveBall = function() {
    this.touch();
    if (cont) {
      if (this.direction == 'right') {
        this.move('right', 40);
      } else if(this.direction == 'down') {
        this.move('down', 40);
      } else if(this.direction == 'left') {
        this.move('left', -40);
      } else {
        this.move('up', -40);
      }
      this.moveBall();
    }
  },

  this.touch = function() {
    if (this.bX == winX && this.bY == winY) {
      cont = false;
      $('.ball' + bNum).animate({margin: '5px', height: '40px', width: '40px'}, 50);

    // Lose Sequence
    } else if (this.bX > 360 || this.bX < 0 || this.bY > 360 || this.bY < 0) {
      cont = false;
      roundWin = false;
      $('.ball-' + bNum).animate({margin: '+= 0px'}, function() {
        alert('work');
        $('.lose').removeClass('hide');
        $('.tryAgain').removeClass('hide').addClass('center');
      });
    } else {
      var tArray = gLevels[gNum - 1];
      for(var i = 1; i < tArray.length; i++) {
        if (this.adjX == tArray[i][1] * bSize && this.adjY == tArray[i][2] * bSize) {
          this.changeDirection(i);
        }
      }
    }
  },

  this.changeDirection = function(i) {
    for (var j = 0; j < triArray.length; j++) {
      if ($('.tri' + i).hasClass(triArray[j][0])) {
        var dirArray = cTri[j][dirHash[this.direction]];
        if (dirArray[1] == 0) {   
          this.direction = dirArray[0];
          this.move(this.direction, dirArray[1]);
          this.moveBall();
        } else {
          this.move(this.direction, dirArray[1]);
          this.direction = dirArray[0];
        }
      }
    }
  },

  this.move = function(direction, units) {
    console.log(direction, units);
    var adjustment;
    if (direction == 'right' || direction == 'down') {
      adjustment = 40;
    } else {
      adjustment = -40;
    }
    console.log(adjustment);
    if (direction == 'right' || direction == 'left') {
      this.bX += units;
      this.adjX = this.bX + adjustment;
      this.adjY = this.bY;
      $('.ball-' + this.bNum).animate({left: '+=' + units + 'px'}, 50);
    } else {
      this.bY += units;
      this.adjX = this.bX;
      this.adjY = this.bY + adjustment;
      $('.ball-' + this.bNum).animate({top: '+=' + units + 'px'}, 50);
    }
  }


}

function Game() {
  var winArray = gLevels[gNum - 1][0][0][0];
  winX = winArray[0] * bSize;
  winY = winArray[1] * bSize;

  this.loadLevel = function() {
    // Adds triangles
    tArray = gLevels[gNum - 1];
    for (var i = 1; i < tArray.length; i++) {
      var tri = new Triangle();
      tri.add(tArray[i][0], (tArray[i][1] * bSize), (tArray[i][2]) * bSize, i);
    }
    
    // Adds End spot
    $('#gameBoard').prepend('<div class="end"></div>');
    $('.end').css('left', winX + 'px').css('top', winY + 'px');
  }

  this.clearBoard = function(increment) {
    if (increment) {
      gNum++;
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
    tCount = 0;
    start();
  }
}

function Triangle() {
  this.add = function(direction, tX, tY, tCount) {
    $('#gameBoard').append('<div class="triangle tri' + tCount + ' ' + direction + '" style="left: ' + tX + 'px; top: ' + tY + 'px"></div>');
    tCount++;
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