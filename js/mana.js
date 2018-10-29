var correct = 0;
var wrong = 0;
var revealed = 0;

var selectedCard;
var cards;

var counter = 0;

// Read DB (JSON) and then load a card into the website
$.getJSON('https://raw.githubusercontent.com/g3neralz/g3neralz.github.io/master/data/cards.json', function(data) {
  cards = data.Cards;
  selectedCard = cards[counter];

  loadCard(selectedCard);
})

function enterPressed(e) {
  if (e.keyCode == 13) {
    checkAnswer();
    return false;
  }
}

function checkAnswer() {
  var manaTextfield = document.getElementById("manaInput");
  var manaValue = manaTextfield.value;
  
  if (!manaValue) {
    return;
  }

  var result;

  if (manaValue == selectedCard.ManaCost) {
    increaseCorrectCounter();
    result = "correct";

    nextCard();
  }
  else {
    increaseWrongCounter();
    result = "wrong";

    hideManaCost(false);
    disableButtons(true);
    focusNextButton();
  }

  updateResultTextAndStyle(result);

  manaTextfield.value = '';
  manaTextfield.focus();
}

function updateResultTextAndStyle(result) {
  var responseText = document.getElementById("responseText");
  responseText.innerHTML = result;
  responseText.className = result;
}

function increaseCorrectCounter() {
    document.getElementById("correct").innerHTML = ++correct;
}

function increaseRevealedCounter() {
  document.getElementById("revealed").innerHTML = ++revealed;
}

function increaseWrongCounter() {
  document.getElementById("wrong").innerHTML = ++wrong;
}

function revealMana() {
  hideManaCost(false);
  increaseRevealedCounter();
  disableButtons(true);
  focusNextButton();
}

function disableButtons(disabled) {
  document.getElementById("manaInput").disabled = disabled;
  document.getElementById("submitBtn").disabled = disabled;
  document.getElementById("revealBtn").disabled = disabled;
}

function nextCard() {
  hideManaCost(true);

  removeCardFromUI();
  
  var cardOk = false;
  while (!cardOk) {
    counter++
    selectedCard = cards[counter];
    cardOk = validateCard(selectedCard);
  }

  disableButtons(false);
  loadCard(selectedCard);
  clearAndFocusManaInput();
}

function removeCardFromUI() {
  var elem = document.querySelector('#mana-card');
  elem.parentNode.removeChild(elem);
}

function clearAndFocusManaInput() {
  var manaTextfield = document.getElementById("manaInput");
  manaTextfield.value = '';
  manaTextfield.focus();
}

function focusNextButton() {
  document.getElementById("nextBtn").focus();
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

function hideManaCost(hideManaCost) {
  if (hideManaCost) {
    document.getElementById("sparkle").style.visibility = 'visible'
  }
  else {
    document.getElementById("sparkle").style.visibility = 'hidden';
  }
}
