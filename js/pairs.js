var Interval;

function restart() {
  var myCards = document.getElementById('container');
  while (myCards.firstChild) {
    myCards.removeChild(myCards.firstChild);
  }

  var appendTens = document.getElementById("tens");
  var appendSeconds = document.getElementById("seconds");
  var appendMinutes = document.getElementById("minutes");

  appendTens.innerHTML = '00';
  appendSeconds.innerHTML = '00';
  appendMinutes.innerHTML = '00';

  clearInterval(Interval);

  loadPairsGame();
}

function loadPairsGame() {
  var myCards = document.getElementById('container');
  var resultsArray = [];
  var counter = 0;
  var text = document.getElementById('text');
  var minutes = 0;
  var seconds = 0; 
  var tens = 0;
  var appendTens = document.getElementById("tens");
  var appendSeconds = document.getElementById("seconds");
  var appendMinutes = document.getElementById("minutes");
  var images = [
    'abaddon',
    'dark_seer',
    'enchantress',
    'fahrvhan_the_dreamer',
    'lycan',
    'magnus',
    'omniknight',
    'rix',
    'treant_protector',
    'viper'
  ];

  var clone = images.slice(0); // duplicate array
  var cards = images.concat(clone); // merge to arrays 

  // Shufffel function
  function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i],   o[i] = o[j], o[j] = x);
    return o;
  }
  shuffle(cards);

  for (var i = 0; i < cards.length; i++) {
    card = document.createElement('div');
    card.dataset.item = cards[i];
    card.dataset.view = "card";
    myCards.appendChild(card);
       
    card.onclick = function () {
     
      if (this.className != 'flipped' && this.className != 'correct'){
          this.className = 'flipped';
          var result = this.dataset.item;
          resultsArray.push(result);
          clearInterval(Interval);
          Interval = setInterval(startTimer, 10);
      }
    
      if (resultsArray.length > 1) {
        changeClickable(false);

        if (resultsArray[0] === resultsArray[1]) {
          check("correct");
          counter ++;
          win();
          resultsArray = [];
        } else {
          check("reverse");
          resultsArray = [];
        } 
      } 
    }     
  };

  var check = function(className) {    
    var x = document.getElementsByClassName("flipped");
    setTimeout(function() {
      for(var i = (x.length - 1); i >= 0; i--) {
        x[i].className = className;
      }

      changeClickable(true);
    }, 500);
  }

  var changeClickable = function(enabled) {    
    var x = document.getElementById("container");
    var divs = x.getElementsByTagName('div');

    for(var i = (divs.length - 1); i >= 0; i--) {
      if (enabled) {
        divs[i].setAttribute("style", "pointer-events:auto");
      }
      else {
        divs[i].setAttribute("style", "pointer-events:none"); 
      }
    }
  }

  var win = function () {
    if(counter === images.length) {
      clearInterval(Interval);
    } 
  }
       
  function startTimer () {
    tens++; 
      
    if(tens < 9){
      appendTens.innerHTML = "0" + tens;
    }
      
    if (tens > 9){
      appendTens.innerHTML = tens;
        
    } 
      
    if (tens > 99) {
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
      
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }

    if (seconds > 59) {
      minutes++;

      if (minutes > 9) {
        appendMinutes.innerHTML = minutes;
      }
      else {
        appendMinutes.innerHTML = "0" + minutes;
      }
      seconds = 0;
      appendSeconds.innerHTML = "0" + 0;
    }
    
  }
}