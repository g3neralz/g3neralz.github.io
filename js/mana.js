var correct = 0;
var wrong = 0;
var revealed = 0;

var selectedCard;
var cards;

var counter = 0;
var revealedFlag = false;

$.getJSON('https://raw.githubusercontent.com/g3neralz/g3neralz.github.io/master/data/cards.json', function(data) {
  cards = data.Cards;
  selectedCard = cards[counter];

  loadCard(selectedCard);
})

function checkAnswer() {
  var manaTextfield = document.getElementById("mana");
  var manaValue = manaTextfield.value;
  var appendCorrect = document.getElementById("correct");
  var appendWrong = document.getElementById("wrong");
  var responseText = document.getElementById("responseText");

  if (!manaValue) {
    return;
  }

  if (manaValue == selectedCard.ManaCost) {
    correct++;

    appendCorrect.innerHTML = correct;
    responseText.innerHTML = "Correct";
    responseText.className = "correct";

    nextCard();
  }
  else {
    wrong++;

    appendWrong.innerHTML = wrong;
    responseText.innerHTML = "Wrong";
    responseText.className = "wrong";

    var sparkle = document.getElementById("sparkle");
    sparkle.style.visibility = 'hidden';

    disableButtons(true);
  }

  manaTextfield.value = '';
  manaTextfield.focus();
}

function enterPressed(e) {
  if (e.keyCode == 13) {
    checkAnswer();
    return false;
  }
}

function revealMana() {
  var sparkle = document.getElementById("sparkle");
  sparkle.style.visibility = 'hidden';

  var appendRevealed = document.getElementById("revealed");
  revealed++;
  appendRevealed.innerHTML = revealed;

  revealedFlag = true;

  disableButtons(true);
}

function disableButtons(disabled) {
  var input = document.getElementById("mana");
  input.disabled = disabled;

  input = document.getElementById("submitBtn");
  input.disabled = disabled;

  input = document.getElementById("revealBtn");
  input.disabled = disabled;
}

function nextCard() {
  var sparkle = document.getElementById("sparkle");
  sparkle.style.visibility = 'visible';


  var elem = document.querySelector('#mana-card');
  elem.parentNode.removeChild(elem);

  var cardOk = false;
  while (!cardOk) {
    counter++
    selectedCard = cards[counter];
    cardOk = validateCard(selectedCard);
  }

  loadCard(selectedCard);

  disableButtons(false);

  var manaTextfield = document.getElementById("mana");
  manaTextfield.value = '';
  manaTextfield.focus();
}

function validateCard(selectedCard) {
  if (selectedCard) {
    console.log(selectedCard);
    console.log(selectedCard.hasOwnProperty('ManaCost'));
    console.log(selectedCard.ManaCost);
    return selectedCard.hasOwnProperty('ManaCost') && !selectedCard.hasOwnProperty('Token');
  }

  return false;
}

function loadCard(selectedCard) {
  var manaContainer = document.getElementById("mana-container");

  var cardDiv = document.createElement('div');
  console.log(selectedCard.fileName);
  cardDiv.dataset.item = selectedCard.fileName;
  cardDiv.dataset.view = "mana-card";
  cardDiv.id = "mana-card";
  cardDiv.className = "card";

  manaContainer.appendChild(cardDiv);
}
