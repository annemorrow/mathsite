function Fraction(numerator, denominator) {
  this.numerator = numerator;
  this.denominator = denominator;
  this.htmlString = function() {
    var str = '<button class="fraction" onclick="selectFraction(this)">'
    str += '<div class="numerator">' + numerator + '</div>'
    str += '<div class="denominator">' + denominator + '</div></button>';
    return str;
  }
}

function Dot(player, value) {
  this.player = player;
  this.value = value;
}

var dotsArray = {
  playedList : [],
  addDot     : function(dot) {
    this.playedList.push(dot);
  },
  sort       : function() {
    for (var i = 0; i < this.playedList.length; i++) {
      var minIndex = i;
      console.log("i is " + i);
      console.log("value of i = " + this.playedList[i].value);
      for (var j = i + 1; j < this.playedList.length; j++) {
        console.log("value of j = " + this.playedList[j].value);
        if (this.playedList[j].value < this.playedList[minIndex].value) minIndex = j;
      }
      var temp = this.playedList[i];
      this.playedList[i] = this.playedList[minIndex];
      this.playedList[minIndex] = temp;
    }
  },
  dotHtml    : function(dotIndex) {
    var dot = this.playedList[dotIndex];
    var margin;
    if (dotIndex == 0) {
      // the 10 the width of the dot
      margin = Math.round(1000 * dot.value) -10 ;
    } else {
      margin = dot.value - this.playedList[dotIndex - 1].value;
      margin = Math.round(1000 * margin) -10;
    }
    var str = '<div class="dot ' + dot.player + '" style="margin-left:' + margin +'px"></div>';
    return str;
  },
  placeDots  : function() {
    var el = document.getElementById("dots");
    el.innerHTML = "";
    this.sort();
    for (var i = 0; i < this.playedList.length; i++) {
      el.innerHTML += this.dotHtml(i);
      console.log(el.innerHTML);
    }
  }
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
  new Fraction(3, 5),
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
  console.log("switchPlayer called");
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
  dotsArray.addDot(dot);
  dotsArray.placeDots();
  button.disabled = true;
  switchPlayer();
}