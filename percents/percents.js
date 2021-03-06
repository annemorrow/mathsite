var hints = {
  "outof100": "Percent means out of 100, so for example, 35% of 100 is 35, and 60% of 100 is 60.",
  "100": "100% of a number is the whole number. For example, 100% of 80 is 80.",
  "50": "50% of a number is half of the number, so divide by 2.  For example, 50% of 80 is 40.",
  "10": "10% of a number is one tenth of the number, so divide by 10.  For example, 10% of 80 is 8.",
  "20": "To take 20% of a number, first take 10% of the number, then double the result. For example, 10% of 80 is 8, so 20% of 80 is 16.",
  "25": "25% of a number is one fourth of the number, so divide by 4.  For example, 25% of 80 is 20.",
  "200": "200% of a number is 2 times that number.  For example, 200% of 80 is 160.",
  "150": "To take 150% of a number, think of it as 100% + 50%.  For example, 100% of 80 is 80, 50% of 80 is 40, so 150% of 80 is 80 + 40 = 120.",
  "75":  "75% of a number is 3 times 25% of the number.  For example, 25% of 80 is 20, so 75% of 80 is 3 * 20 = 60",
  "5": "5% is half of 10%.  For example, 10% of 80 is 8, so 5% of 80 is 4.",
  "90": "90% is 10% less than 100%.  For example, 10% of 80 is 8, so 90% of 80 is 80 - 8 = 72." 
}

var percents = {
  wholeList: [100, 50, 10, 20, 25, 200, 150, 75, 5, 90],
  options: []
}

var outOf = {
  wholeList: [12, 24, 100, 60, 200, 40, 120],
  options: []
}

var answer;

function chooseAnswers() {
  outOf.answer = outOf.wholeList[Math.floor(Math.random()*outOf.wholeList.length)];
  percents.answer = percents.wholeList[Math.floor(Math.random()*percents.wholeList.length)];
  answer = percents.answer / 100 * outOf.answer;
};

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function makeOptions(obj) {
  obj.options = obj.wholeList.filter(function(x) {return x != obj.answer });
  shuffle(obj.options);
  obj.options = obj.options.slice(0, 3);
  obj.options.push(obj.answer);
  shuffle(obj.options);
}

function displayProblem() {
  var el = document.getElementById('answer');
  var displayAnswer;
  if (Math.floor(answer) == answer) {
   displayAnswer = answer
  } else {
    displayAnswer = answer.toFixed(1);
  }
  el.textContent = displayAnswer;
  for (i = 0; i < 4; i++)
  {
    $('#percents').children()[i].textContent = percents.options[i] + "%";
    $($('#percents').children()[i]).data('value', percents.options[i]);
    $('#totals').children()[i].textContent = outOf.options[i];
    $($('#totals').children()[i]).data('value', outOf.options[i]);
  }
  $('.percent').css("background-color", "ivory");
  $('.total').css("background-color", "ivory");
}

function next() {
  $("#success").css("display", "none");
  chooseAnswers();
  makeOptions(percents);
  makeOptions(outOf);
  displayProblem();
  document.getElementById('notes').textContent = "";
}

var chosenPercent;
var chosenTotal;


$(document).ready(function() {
  next();
  $('.percent').click(function() {
    console.log($(this).data('value'));
    chosenPercent = $(this).data('value');
    $('.percent').css("background-color", "ivory");
    $(this).css("background-color", "lightgreen");
  });
  $('.total').click(function() {
    console.log($(this).data('value'));
    chosenTotal = $(this).data('value');
    $('.total').css("background-color", "ivory");
    $(this).css("background-color", "lightgreen");
  });
  $('#check').click(function() {
    if (chosenPercent / 100 * chosenTotal == answer) {
      $("#success").css("display", "block");
      setTimeout(function(){
      next();
      }, 1000);
    } else {
      document.getElementById('notes').textContent = "Hint: " + hints[String(percents.answer)];
    }
  });
});