function Fraction(numerator, denominator) {
  this.numerator = numerator;
  this.denominator = denominator;
}

Fraction.prototype.htmlString = function() {
    var str = '<button class="fraction" onclick="selectFraction(this)">'
    str += '<div class="numerator">' + this.numerator + '</div>'
    str += '<div class="denominator">' + this.denominator + '</div></button>';
    return str;
};

function Dot(player, value) {
  this.player = player;
  this.value = value;
}

dotsArray = [];

function addDotToModel(dot) {
  // insert dot in value position, so scanning for winner is quick
  if (dotsArray.length === 0) {
    dotsArray[0] = dot;
  } else {
    var index = 0;
    while(dotsArray.length > index && dotsArray[index].value < dot.value) {
      index++;
    }
    dotsArray.splice(index, 0, dot);
  }
}

function checkForWinner() {
  var player = dotsArray[0].player;
  var count = 1;
  for (var i = 1; i < dotsArray.length; i++) {
    if (dotsArray[i].player === player) {
      count++;
        if (count === 3) {
          return player;
        }
    } else {
      player = dotsArray[i].player;
      count = 1;
    }
  }
  return false;
}

function addDotToLine(dot) {
  var dotDiv = document.createElement("div");
  var popup = document.createElement("div");
  $(popup).addClass("popup");
  $(popup).text(dot.value.toFixed(2));
  $(dotDiv).append(popup);
  $(dotDiv).addClass("dot");
  $(dotDiv).addClass(dot.player);
  $(dotDiv).css("left", dot.value * 100 + "%");
  $(dotDiv).data("value", dot.value);
  $("#dots").append(dotDiv);
}


// fractions and decimals
var fractionCatalogue = [
  new Fraction(1, 2),
  new Fraction(1, 4),
  new Fraction(1, 3),
  new Fraction(1, 5),
  new Fraction(1, 10),
  new Fraction(3, 4),
  new Fraction(9, 10),
  new Fraction(7, 8),
  new Fraction(2, 3),
  new Fraction(4, 5),
  new Fraction(3, 5),
  new Fraction(1, 8),
  new Fraction(7, 10),
  new Fraction(2, 5),
  new Fraction(3, 8),
  new Fraction(4, 9),
  new Fraction(1, 20),
  new Fraction(5, 6),
  new Fraction(1, 6),
  new Fraction(3, 10)
]

for (var i = 0; i < 20; i++) {
  document.getElementById("fractions").innerHTML += fractionCatalogue[i].htmlString();
}

var player = "player1";

function switchPlayer() {
  var heading = document.getElementsByTagName("h3")[0];
  if (player == "player1") {
    player = "player2";
    heading.innerHTML = "Player 2";
  } else if (player == "player2") {
    player = "player1";
    heading.innerHTML = "Player 1";
  }
}

function selectFraction(button) {
  var num = Number(button.getElementsByClassName("numerator")[0].innerHTML);
  var denom = Number(button.getElementsByClassName("denominator")[0].innerHTML);
  var dot = new Dot(player, num/denom);
  addDotToModel(dot);
  addDotToLine(dot);
  button.disabled = true;
  var winner = checkForWinner();
  if (winner) {
    var winnerName = "winner";
    if (winner == "player1") {
      winnerName = "PLAYER 1";
    } else {
      winnerName = "PLAYER 2";
    }
    console.log(winner + " WINS");
    $("#win p").text(winnerName + " WINS");
    $("#win").css("display", "block");
  } else {
    switchPlayer();
  }
}