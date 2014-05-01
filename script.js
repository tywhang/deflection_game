var gNum = 1;
var bSize = 40;
var gLevels = [[[[[9, 2]], [[0, 0, 'right'], [1, 9, 'right']]],
                  ['bottomRight', 5, 5], ['topLeft', 0, 2], ['bottomLeft', 0, 5], ['topRight', 5, 0], ['bottomRight', 9, 9]],
               [[[[9, 2]], [[3, 9, 'up']]], 
                  ['topLeft', 3, 0], ['topRight', 4, 0], ['bottomLeft', 4, 2]]
                  ];

var cont = true;
var launch = false;
var ball = [];
var roundWin;

var triDirections = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
var triArray = [['topLeft', 0], ['topRight', 1], ['bottomRight', 2], ['bottomLeft', 3]];
var dirHash = {'right': 0, 'down': 1, 'left': 2, 'up': 3}
var cTri = [[['left', 0], ['up', 0], ['down', -40], ['right', -40]], //topLeft
        [['down', 40], ['up', 0], ['right', 0], ['left', -40]],   //topRight
        [['up', 40], ['left', 40], ['right', 0], ['down', 0]],   //bottomRight
        [['left', 0], ['right', 40], ['up', -40], ['down', 0]]];   //bottomLeft

function start() {
  $('.info').addClass('hide');
  $('.end').css('background', 'yellow');
  $('.score').html(gNum);
  $('.start').addClass('hide').removeClass('center');
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
      $('.ball').animate({margin: '5px'}, function() {
        $('#gameBoard').children(":not('.nextGameButton')").fadeTo('slow', 0.3);
        $('.win').removeClass('hide');
        $('.end').css('background', 'red');
        $('.nextGameButton').removeClass('hide').addClass('center');
      });
    } else if (i == ball.length) {
        $('.ball-' + bNum).animate({margin: '+= 0px'}, function() {
        $('.lose').removeClass('hide');
        $('.tryAgain').removeClass('hide').addClass('center');
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
      switch (this.direction) {
        case 'right':
        case 'down':
          this.move(this.direction, 40);
          break;
          
        case 'left':
        case 'up':
          this.move(this.direction, -40);
          break;
      }
      this.moveBall();
    }
  },

  this.touch = function() {
    if (this.bX == winX && this.bY == winY) { //If the ball lands in the end spot
      cont = false;
      $('.ball-' + bNum).animate({margin: '5px', height: '30px', width: '30px'}, 50);
    } else if (this.bX > 360 || this.bX < 0 || this.bY > 360 || this.bY < 0) { // If ball falls out of bounds
      cont = false;
      roundWin = false;
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
        // If ball hits outside surface of triangle
        if (dirArray[1] == 0) {
          this.direction = dirArray[0];
          this.move(this.direction, dirArray[1]);
        // If ball hits inside of triangle
        } else {
          this.move(this.direction, dirArray[1]);
          this.direction = dirArray[0];
        }
        this.moveBall();
      }
    }
  },

  this.move = function(direction, units) {
    switch(direction) {
      case 'right':
        this.adjust(40, 0, units, 0);
        $('.ball-' + this.bNum).animate({'left': '+=' + units + 'px'}, 50);
        break;

      case 'down':
        this.adjust(0, 40, 0, units);
        $('.ball-' + this.bNum).animate({'top': '+=' + units + 'px'}, 50);
        break;

      case 'left':
        this.adjust(-40, 0, units, 0);
        $('.ball-' + this.bNum).animate({'left': '+=' + units + 'px'}, 50);
        break;

      case 'up':
        this.adjust(0, -40, 0, units);
        $('.ball-' + this.bNum).animate({'top': '+=' + units + 'px'}, 50);
        break;

    }
  },

  this.adjust = function(xAdjust, yAdjust, xUnits, yUnits) {
    this.bX += xUnits;
    this.bY += yUnits;
    this.adjX = this.bX + xAdjust;
    this.adjY = this.bY + yAdjust;
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
    for (var i = 0; i < triDirections.length; i++) {
      if ($(this).hasClass(triDirections[i])) {
        $(this).removeClass(triDirections[i]).addClass(triDirections[(i + 1) % 4]);
        i++
      }
    }
  }
});