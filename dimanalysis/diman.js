function Fraction(num, denom, units) {
  this.num = num;
  this.denom = denom;
  this.units = units;
  this.canceled = {};
  for (key in units) {
    this.canceled[key] = 0;
  }
}

function fractionMaker(num, numUnit, denom, denomUnit) {
  var units = unitsReader(numUnit);
  var denominatorUnits = unitsReader(denomUnit);
  for (key in denominatorUnits) {
    units[key] = - denominatorUnits[key];
  }
  return frac = new Fraction(num, denom, units);
}

Fraction.prototype.reciprocal = function() {
  var recip = new Fraction(this.denom, this.num, this.units);
  for (key in this.units) {
    recip.units[key] = - this.units[key];
  }
  return recip;
}

Fraction.prototype.equals = function(that) {
  if (this.num !== that.num || this.denom !== that.denom) {
    return false;
  }
  for (key in this.units) {
    if (!(key in that.units)) {
      return false;
    }
    if (this.units[key] !== that.units[key]) {
      return false;
    }
  }
  for (key in that.units) {
    if (!(key in this.units)) {
      return false;
    }
  }
  return true;
}

Fraction.prototype.multiply = function(that) {
  var num = this.num * that.num / this.denom / that.denom;
  var units = {};
  for (key in this.units) {
    if (!(key in units)) {
      units[key] = 0;
    }
    units[key] += this.units[key];
  }
  for (key in that.units) {
    if (!(key in units)) {
      units[key] = 0;
    }
    units[key] += that.units[key]
  }
  for (key in units) {
    if (units[key] === 0) {
      delete units[key];
    }
  }
  return new Fraction(num, 1, units);
}

Fraction.prototype.copyClean = function() {
  // don't want to include cancelation info
  var copyUnits = {};
  for (key in this.units) {
    copyUnits[key] = this.units[key];
  }
  return new Fraction(this.num, this.denom, copyUnits);
}

Fraction.prototype.availableUnits = function() {
  var available = {};
  for (key in this.units) {
    available[key] = this.units[key] - this.canceled[key];
  }
  return available;
}

Fraction.prototype.cancelWith = function(that) {
  var availableThis = this.availableUnits();
  var availableThat = that.availableUnits();
  for (key in availableThis) {
    if (key in availableThat) {
      while (availableThis[key] > 0 && availableThat[key] < 0) {
        this.canceled[key]++;
        that.canceled[key]--;
        availableThis[key]--;
        availableThat[key]++;
      }
      while (availableThis[key] < 0 && availableThat[key] > 0) {
        this.canceled[key]--;
        that.canceled[key]++;
        availableThis[key]++;
        availableThat[key]--;
      }
    }
  }
}

var equation = {
  factors: [],
  answer: new Fraction(1, 1, {})
};

equation.add = function(fraction) {
  for (var i = 0; i < this.factors.length; i++) {
    this.factors[i].cancelWith(fraction);
  }
  this.factors.push(fraction);
  this.answer = this.answer.multiply(fraction);
}

var latexString = function(frac) {
  var numUnits = {};
  var denomUnits = {};
  for (key in frac.units) {
    if (frac.units[key] > 0) {
      numUnits[key] = frac.units[key];
    } else if (frac.units[key] < 0) {
      denomUnits[key] = -frac.units[key];
    }
  }
  var latex = "$$\\require{cancel}\\left(\\frac{" + frac.num;
  for (key in numUnits) {
    var keylatex = "\\hbox{ " + key + " }";
    if (frac.canceled[key] !== 0) {
      keylatex = "\\cancel{" + keylatex + "}";
    }
    if (numUnits[key] !== 1) {
      keylatex = keylatex + "^" + numUnits[key];
    }
    latex += keylatex;
  }
  latex += "}{" + frac.denom;
  for (key in denomUnits) {
    var keylatex = "\\hbox{ " + key + " }";
    if (frac.canceled[key] !== 0) {
      keylatex = "\\cancel{" + keylatex + "}";
    }
    if (denomUnits[key] !== 1) {
      keylatex = keylatex + "^" + denomUnits[key];
    }
    latex += keylatex;
  }
  latex += "}\\right)$$";
  return latex;
};

var answerLatex = function() {
  var frac = equation.answer;
  var numUnits = {};
  var denomUnits = {};
  for (key in frac.units) {
    if (frac.units[key] > 0) {
      numUnits[key] = frac.units[key];
    } else if (frac.units[key] < 0) {
      denomUnits[key] = -frac.units[key];
    }
  }
  var frac = equation.answer;
  var latex = "$$=" + frac.num + "\\frac{";
  for (key in numUnits) {
    var keylatex = "\\hbox{ " + key + " }";
    if (numUnits[key] !== 1) {
      keylatex = keylatex + "^" + numUnits[key];
    }
    latex += keylatex;
  }
  latex += "}{"
  for (key in denomUnits) {
    var keylatex = "\\hbox{ " + key + " }";
    if (denomUnits[key] !== 1) {
      keylatex = keylatex + "^" + denomUnits[key];
    }
    latex += keylatex;
  }
  latex += "}$$";
  return latex;
}

var insert = function(frac, div) {
  div.innerHTML = latexString(frac);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, div])();
  $(div).data("fraction", frac);
  $(div).addClass("fraction");
};

var displayAnswer = function() {
  var div = document.getElementById("result");
  if (equation.factors.length === 0) {
    div.innerHTML = "";
  } else {
  div.innerHTML = answerLatex();
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, div])();
  }
}

var displayAllFactors = function() {
  var factorsList = document.getElementById("factors");
  factorsList.innerHTML = "";
  for (var i = 0; i < equation.factors.length; i++) {
    var div = document.createElement("div");
    factorsList.appendChild(div);
    insert(equation.factors[i], div);
    $(div).dblclick(function() {
      remove(this);
    });
  }
}

var flip = function(div) {
  var frac = $(div).data("fraction");
  insert(frac.reciprocal(), div);
};


var useFrac = function(frac) {
  var fracCopy = frac.copyClean();
  equation.add(fracCopy);
  displayAllFactors();
  displayAnswer();
};

function remove(div) {
  console.log("remove function called");
  var frac = $(div).data("fraction");
  $(div).remove();
  
  for (var i = 0; i < equation.factors.length; i++) {
    if (frac.equals(equation.factors[i])) {
      console.log(i + " is index");
      equation.factors.splice(i, 1);
      break;
    }
  }
  var copyFactors = [];
  for (var j = 0; j < equation.factors.length; j++) {
    copyFactors.push(equation.factors[j].copyClean());
  }
  equation.factors = [];
  equation.answer = new Fraction(1, 1, {});
  for (var k = 0; k < copyFactors.length; k++) {
    equation.add(copyFactors[k]);
  }
  displayAllFactors();
  displayAnswer();
}



function addToList(fraction, listId) {
  var list = document.getElementById(listId);
  var row = document.createElement("div");
  var fracDiv = document.createElement("div");
  var reciprocalBtn = document.createElement("button");
  var includeBtn = document.createElement("button");
  list.appendChild(row);
  row.appendChild(fracDiv);
  row.appendChild(includeBtn);
  row.appendChild(reciprocalBtn);
  $(row).addClass("fracRow");
  insert(fraction, fracDiv);
  $(reciprocalBtn).addClass("flip");
  $(reciprocalBtn).text("reciprocal");
  $(reciprocalBtn).click(function() {
    flip(fracDiv);
  });
  $(includeBtn).addClass("use");
  $(includeBtn).text("use factor");
  $(includeBtn).click(function() {
    var fraction = $(fracDiv).data("fraction");
    useFrac(fraction);
  });
  return row;
};

function fillList(array, listID) {
  for (var i = 0; i < array.length; i++) {
    var frac = array[i];
    addToList(frac, listID);
  }
}







// Distances

var millimetersmeters = fractionMaker(1000, "millimeters", 1, "meters");
var centermetersmeters = fractionMaker(100, "centimeters", 1, "meters");
var kilometersmeters = fractionMaker(1, "kilometers", 1000, "meters");

var inchesfeet = fractionMaker(12, "inches", 1, "feet");
var feetyards = fractionMaker(3, "feet", 1, "yards");
var feetmiles = fractionMaker(5280, "feet", 1, "miles");

var feetmeters = fractionMaker(1, "meters", 3.28, "feet");
var mileskilometers = fractionMaker(1, "miles", 1.609, "kilometers");

var distances = [millimetersmeters, centermetersmeters, kilometersmeters, inchesfeet, feetyards, feetmiles, feetmeters, mileskilometers];

// Volumes

var quartsgallons = fractionMaker(4, "quarts", 1, "gallons");
var pintsgallons = fractionMaker(8, "pints", 1, "gallons");
var ouncepints = fractionMaker(1, "pints", 16, "fluid_ounces");
var litersquarts = fractionMaker(1, "quarts", 0.946, "liters");
var cubiccentimetersmilliliters = fractionMaker(1, "centimeters^3", 1, "milliliters");
var millilitersliters = fractionMaker(1000, "milliliters", 1, "liters");

var volumes = [quartsgallons, pintsgallons, ouncepints, litersquarts, cubiccentimetersmilliliters, millilitersliters];

// Mass

var kilogramspounds = fractionMaker(1, "kilograms", 2.2046, "pounds");
var poundsgrams = fractionMaker(1, "pounds", 453.6, "grams");
var gramskilograms = fractionMaker(1000, "grams", 1, "kilograms");
var milligramsgrams = fractionMaker(1000, "milligrams", 1, "grams");
var ouncespounds = fractionMaker(16, "ounces", 1, "pounds");

var masses = [kilogramspounds, poundsgrams, gramskilograms, milligramsgrams, ouncespounds];

// Time

var daysyears = fractionMaker(1, "years", 365, "days");
var hoursdays = fractionMaker(1, "days", 24, "hours");
var daysweeks = fractionMaker(7, "days", 1, "weeks");
var minuteshours = fractionMaker(1, "hours", 60, "minutes");
var secondsminutes = fractionMaker(1, "minutes", 60, "seconds");
var millisecondsseconds = fractionMaker(1000, "milliseconds", 1, "seconds");

var times = [daysyears, hoursdays, daysweeks, minuteshours, secondsminutes, millisecondsseconds];



var customUnits = [];

function unitsReader(str) {
  var units = {};
  var unitsArray = str.split(" ");
  for (var i = 0; i < unitsArray.length; i++) {
    if (unitsArray[i].includes("^")) {
      var unitBreakdown = unitsArray[i].split("^");
      units[unitBreakdown[0]] = Number(unitBreakdown[1]);
    } else {
      units[unitsArray[i]] = 1;
    }
  }
  return units;
}

function submitFactor() {
  console.log("submit button hit");
  var numeratorNumber = Number(document.getElementById("number1").value);
  var units = unitsReader(document.getElementById("unit1").value);
  var denominatorNumber = Number(document.getElementById("number2").value);
  var denominatorUnits = unitsReader(document.getElementById("unit2").value);
  for (key in denominatorUnits) {
    units[key] = - denominatorUnits[key];
  }
  var frac = new Fraction(numeratorNumber, denominatorNumber, units);
  customUnits.push(frac);
  addToList(frac, "custom");
}

var $window = $(window), $equation = $('#equation'), elTop = $equation.offset().top;


$(document).ready(function() {

  fillList(distances, "distances");
  fillList(volumes, "volumes");
  fillList(times, "times");
  fillList(masses, "mass");
  
  $("#submit").click(function() {
    submitFactor();
  });
  
  
  
  $window.scroll(function() {

    if ($window.scrollTop() > elTop && $(window).height() < $(document).height() - elTop -$("#instructions").height()) {
      $equation.addClass('sticky');
    }
    if ($window.scrollTop() < elTop) {
      $equation.removeClass('sticky');
    }
  });
  

});
