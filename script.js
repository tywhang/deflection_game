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


$(document).ready(function() {
  loadTriangles();
  $('.score').append(gameNumber);
});

$(document).on('keydown', function(event) {
  if(event.which == 32) {
    $('#gameBoard').prepend('<div class="ball"></div>');
    moveBall();
  }
});

function moveBall() {
  touch();
  if (cont) {
    if (direction == 'right') {
      move('right', 40);
    } else if(direction == 'down') {
      move('down', 40);
    } else if(direction == 'left') {
      move('left', -40);
    } else {
      move('down', -40);
    }
    moveBall();
  }
}

function move(direction, units) {
  if (direction == 'right' || direction == 'left') {
    ballX += units;
    adjX = ballX + units;
    adjY = ballY;
    $('.ball').animate({marginLeft: '+=' + units + 'px'}, 150);
  } else {
    ballY += units;
    adjX = ballX;
    adjY = ballY + units;
    $('.ball').animate({marginTop: '+=' + units + 'px'}, 150);
  }
}

function touch() {
  if (ballX == winX && ballY == winY) {
    winSequence();
  } else {
    for(var i = 1; i < game1.length; i++) {
      if (adjX == game1[i][1] && adjY == game1[i][2]) {
        changeDirection(i);
      }
    }
  }
}

function winSequence() {
  $('.win').removeClass('hide');
  cont = false;
}

function addTriangle(orientation, xPosition, yPosition) {
  $('#gameBoard').append('<div class="tri' + triCount + '"></div>');
  $('.tri' + triCount).addClass(orientation).addClass('triangle');
  $('.tri' + triCount).css('marginLeft', xPosition + 'px').css('marginTop', yPosition + 'px');
  triCount++;
}

function loadTriangles() {
  for (var i = 1; i < game1.length; i++) {
    addTriangle(game1[i][0], game1[i][1], game1[i][2]);
  }
  $('#gameBoard').append('<div class="end"></div>');
  $('.end').css({marginLeft: game1[0][0]}).css({marginTop: game1[0][1]});
}


$(document).on('click', '.triangle', function() {
  if($(this).hasClass('topLeft')) {
    $(this).removeClass('topLeft').addClass('topRight');
  } else if($(this).hasClass('topRight')) {
    $(this).removeClass('topRight').addClass('bottomRight');
  } else if($(this).hasClass('bottomRight')) {
    $(this).removeClass('bottomRight').addClass('bottomLeft');
  } else {
    $(this).removeClass('bottomLeft').addClass('topLeft');
  }
});

function changeDirection(i) {
  if ($('.tri' + i).hasClass('topLeft')) {
    if (direction == 'right'){
      direction = 'left';
    } else if (direction == 'down'){
      direction = 'up';
    } else if (direction == 'left'){
      move(direction, -40);
      direction = 'down';
    } else {
      move(direction, -40);
      direction = 'right';
    }
  } else if ($('.tri' + i).hasClass('topRight')) {
    if (direction == 'right'){
      move(direction, 40);
      direction = 'down';
    } else if (direction == 'down'){
      direction = 'up';
    } else if (direction == 'left'){
      direction = 'right';
    } else {
      move(direction, -40);
      direction = 'left';
    }
  } else if ($('.tri' + i).hasClass('bottomRight')) {
    if (direction == 'right'){
      move(direction, 40);
      direction = 'up';
    } else if (direction == 'down'){
      move(direction, 40);
      direction = 'left';
    } else if (direction == 'left'){
      direction = 'right';
    } else {
      direction = 'down';
    }
  } else if ($('.tri' + i).hasClass('bottomLeft')) {
    if (direction == 'right'){
      direction = 'up';
    } else if (direction == 'down'){
      move(direction, 40);
      direction = 'right';
    } else if (direction == 'left'){
      move(direction, -40);
      direction = 'up';
    } else {
      direction = 'down';
    }
  }
}


/* Things to add for tomorrow:
    Make the controls lock when ball is in play.
    Change the criteria that Triangle's X and Y positions are compared to depending on Balls direction. Like if moving down, increase BallX by 10. At least in the comparison equation.
    Create a win() sequence.
    Make a grid for the game.
    Clean up the code. DRY.
*/













