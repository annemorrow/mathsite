function Fraction(numeratorNumber, numeratorUnit, denominatorNumber, denominatorUnit) {
  this.numeratorNumber = numeratorNumber;
  this.numeratorUnit = numeratorUnit;
  this.denominatorNumber = denominatorNumber;
  this.denominatorUnit = denominatorUnit;
  
  this.reciprical = function() {
    var inverse = new Fraction(denominatorNumber, denominatorUnit, numeratorNumber, numeratorUnit);
    return inverse;
    }
  
  this.htmlString = function() {
    str = '<div class="fraction"><div class="numerator"><div class="number">';
    str += numeratorNumber;
    str += '</div><div class="unit">';
    str += numeratorUnit;
    str += '</div></div><div class="denominator"><div class="number">';
    str += denominatorNumber;
    str += '</div><div class="unit">';
    str += denominatorUnit;
    str += '</div></div></div>';
    return str;
  }
  
}

function getFractionFromHTML(fractionElement) {
  var numerator = fractionElement.getElementsByClassName("numerator")[0];
  var numeratorNumber = Number(numerator.getElementsByClassName("number")[0].innerHTML);
  var numeratorUnit = numerator.getElementsByClassName("unit")[0].innerHTML;
  var denominator = fractionElement.getElementsByClassName("denominator")[0];
  var denominatorNumber = Number(denominator.getElementsByClassName("number")[0].innerHTML);
  var denominatorUnit = denominator.getElementsByClassName("unit")[0].innerHTML;
  var frac = new Fraction(numeratorNumber, numeratorUnit, denominatorNumber, denominatorUnit);
  return frac;
}




// Distances

var millimetersmeters = new Fraction(1000, "millimeters", 1, "meters");
var centermetersmeters = new Fraction(100, "centimeters", 1, "meters");
var decimetersmeters = new Fraction(10, "decimeters", 1, "meters");
var dekametersmeters = new Fraction(1, "dekameters", 10, "meters");
var kilometersmeters = new Fraction(1, "kilometers", 1000, "meters");

var inchesfeet = new Fraction(12, "inches", 1, "feet");
var feetyards = new Fraction(3, "feet", 1, "yards");
var feetmiles = new Fraction(5280, "feet", 1, "miles");

var feetmeters = new Fraction(1, "meters", 3.28, "feet");
var mileskilometers = new Fraction(1, "miles", 1.609, "kilometers");

var distances = [millimetersmeters, centermetersmeters, decimetersmeters, dekametersmeters, kilometersmeters, inchesfeet, feetyards, feetmiles, feetmeters, mileskilometers];


// Volumes

var quartsgallons = new Fraction(4, "quarts", 1, "gallons");
var pintsgallons = new Fraction(8, "pints", 1, "gallons");
var ouncepints = new Fraction(1, "pints", 16, "ounces");
var litersquarts = new Fraction(1, "quarts", 0.946, "liters");

var volumes = [quartsgallons, pintsgallons, ouncepints, litersquarts];

// Times
var daysyears = new Fraction(1, "years", 365, "days");
var hoursdays = new Fraction(1, "days", 24, "hours");
var minuteshours = new Fraction (1, "hours", 60, "minutes");
var secondsminutes = new Fraction (1, "minutes", 60, "seconds");

var times = [daysyears, hoursdays, minuteshours, secondsminutes];

function invert(elembutton) {
  var el = elembutton.parentElement.previousSibling; // should be the fraction;
  var original = getFractionFromHTML(el);
  console.log(original);
  var inverted = original.reciprical();
  el.innerHTML = inverted.htmlString();
}

function add(addButton) {
  console.log("button pressed");
  var el = addButton.parentElement.previousSibling;
  var frac = getFractionFromHTML(el);
  factorList.push(frac);
  populateFactorList();
  multiply(frac);
}


function populateList(listName, array) {
  var el = document.getElementById(listName);
  for (var i = 0; i < array.length; i++) {
    var str = "<div class='factorbox'><div>" + array[i].htmlString() + "</div>";
    str += "<div class='buttonbox'>";
    str += "<button class='invert' onclick='invert(this)'></button>";
    str += "<button class='add' onclick='add(this)'></button>";
    str += "</div></div>"
    el.innerHTML += str;
  }
}

var factorList = [];

function populateFactorList() {
  var el = document.getElementById("factors");
  el.innerHTML = "";
  for (var i = 0; i < factorList.length; i++) {
    var str = "<div class='factor'>" + factorList[i].htmlString() + "<button class='delete' onclick='del(this)'></button></div><div class='symbol'>&times</div>";
    el.innerHTML += str;
  }
}

function del(deleteButton) {
  console.log("delete pressed");
  var newFactorList = [];
  var factorDivs = document.getElementById("factors").getElementsByClassName('factor');
  var removeDiv = deleteButton.parentElement;
  for (var i = 0; i < factorDivs.length; i++) {
    var frac = getFractionFromHTML(factorDivs[i]);
    if (factorDivs[i] !== removeDiv) {
      newFactorList.push(frac);
    } else {
      multiply(frac.reciprical());
    } 
  }
  factorList = newFactorList;
  populateFactorList();
  answer.display();
}



populateList("distances", distances);

populateList("volumes", volumes);

populateList("times", times);




var answer = {
  number: 1,
  units: {},
  numUnitString: "",
  denomUnitString: "",
  htmlString: function() {
    var str = "<div class='number'>" + parseFloat((this.number).toFixed(10)) + "</div>";
    str += "<div class='unitBlock'><div class='numerator' class='unit'>" + this.numUnitString + "</div>";
    str += "<div class='denominator' class='unit'>" + this.denomUnitString + "</div></div>";
    return str;
  },
  display: function() {
    var el = document.getElementById("result");
    el.innerHTML = this.htmlString();
    document.getElementById('factors').lastChild.innerHTML = "=";
  }
};

function multiply(fraction) {
  answer.number *= (fraction.numeratorNumber / fraction.denominatorNumber);
  var numUnitValue = answer.units[fraction.numeratorUnit] || 0;
  numUnitValue += 1;
  answer.units[fraction.numeratorUnit] = numUnitValue;
  var denomUnitValue = answer.units[fraction.denominatorUnit] || 0;
  denomUnitValue -= 1;
  answer.units[fraction.denominatorUnit] = denomUnitValue;
  makeUnitStrings();
  answer.display();
}

function makeUnitStrings() {
  answer.numUnitString = "";
  answer.denomUnitString = "";
  for (var unit in answer.units) {
    if (answer.units[unit] > 0) {
      answer.numUnitString += " " + unit;
      if (answer.units[unit] > 1) {
        answer.numUnitString += "<sup>" + answer.units[unit] + "</sup>";
      }
    }
    if (answer.units[unit] < 0) {
      answer.denomUnitString += " " + unit;
      if (answer.units[unit] < -1) {
        answer.denomUnitString += "<sup>" + -answer.units[unit] + "</sup>";
      }
    }
  }
}


var customUnits = [];

function submitFactor() {
  console.log("submit button hit");
  var numeratorNumber = Number(document.getElementById("number1").value);
  var numeratorUnit = document.getElementById("unit1").value;
  var denominatorNumber = Number(document.getElementById("number2").value);
  var denominatorUnit = document.getElementById("unit2").value;
  var frac = new Fraction(numeratorNumber, numeratorUnit, denominatorNumber, denominatorUnit);
  customUnits.push(frac);
  document.getElementById("customList").innerHTML = "<h3>Custom Units</h3>";
  populateList("customList", customUnits);
}
 