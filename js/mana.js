/****************************
 * === Global Variables === *
 ****************************/
var selectedCard;
var cards;
var cardPosition = 0;
var allCards;
var playableCards;

var blueCards = [];
var redCards = [];
var greenCards = [];
var blackCards = [];

//Result Counters
var correctCounter = 0;
var wrongCounter = 0;
var revealedCounter = 0;

//State of Color Buttons
var isBlueSelected = true;
var isRedSelected = true;
var isGreenSelected = true;
var isBlackSelected = true;

// Read DB (JSON) and then load a card into the website
$.getJSON('https://raw.githubusercontent.com/g3neralz/g3neralz.github.io/master/data/cards.json', function(data) {

  allCards = data.Cards;
  
  filterCardsAndSortByColor();
  gatherAllPlayableCards();
  shufflePlayableCards();

  selectedCard = playableCards[cardPosition];
  showSelectedCard(selectedCard);

  document.getElementById("totalCards").innerHTML = playableCards.length;
});

//Filter Cards And Stash Them by Color
function filterCardsAndSortByColor() {
  var card;
  for (i = 0; i < allCards.length; i++) {
    card = allCards[i];

    if (isPlayableCard(card)) {
      sortCardByColor(card);
    }
  }
}

//Skip Tokens and Heroes
function isPlayableCard(card) {
  return card.hasOwnProperty('ManaCost') && !card.hasOwnProperty('Token');
}

//Organise each card by Color
function sortCardByColor(card) {
  switch (card.Color) {
    case "Blue":
      blueCards.push(card);
      break;
    case "Red":
      redCards.push(card);
      break;
    case "Green":
      greenCards.push(card);
      break;
    case "Black":
      blackCards.push(card);
      break;
    default:
      alert("This Card Has No Color");
      break;
  }
}

//Concat all Playable Cards Based on Selected Colors
function gatherAllPlayableCards() {
  playableCards = [];

  if (isBlueSelected) {
    console.log("Blue Size: " + blueCards.length);
    playableCards = playableCards.concat(blueCards.slice());
  }

  if (isRedSelected) {
    console.log("Red Size: " + redCards.length);
    playableCards = playableCards.concat(redCards.slice());
  }

  if (isGreenSelected) {
    console.log("Green Size: " + greenCards.length);
    playableCards = playableCards.concat(greenCards.slice());
  }

  if (isBlackSelected) {
    console.log("Black Size: " + blackCards.length);
    playableCards = playableCards.concat(blackCards.slice());
  }

  console.log("All Playable Cards " + playableCards.length);
}

function shufflePlayableCards() {
  let counter = playableCards.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = playableCards[counter];
    playableCards[counter] = playableCards[index];
    playableCards[index] = temp;
  }
}


//Add Event Listeners
function addEventListeners() {
  document.getElementById("blueBtn").addEventListener("click", colorClicked);
  document.getElementById("redBtn").addEventListener("click", colorClicked);
  document.getElementById("greenBtn").addEventListener("click", colorClicked);
  document.getElementById("blackBtn").addEventListener("click", colorClicked);
}

//Action on Color Clicked
function colorClicked(event) {
  switch (event.target.id) {
    case "blueBtn":
      isBlueSelected = !isBlueSelected;
      updateColorSelectionUI(event.target.id, isBlueSelected);
      break;
    case "redBtn":
      isRedSelected = !isRedSelected;
      updateColorSelectionUI(event.target.id, isRedSelected);
      break;
    case "greenBtn":
      isGreenSelected = !isGreenSelected;
      updateColorSelectionUI(event.target.id, isGreenSelected);
      break;
    case "blackBtn":
      isBlackSelected = !isBlackSelected;
      updateColorSelectionUI(event.target.id, isBlackSelected);
      break;
  }

  //If none are selected, select all colors and update UI
  checkColorSelectionAndReset();

  //Gather Playable Cards Again
  gatherAllPlayableCards();
  shufflePlayableCards();

  //Reset All UI
  removeCardFromUI();

  cardPosition = 0;
  selectedCard = playableCards[cardPosition];
  showSelectedCard(selectedCard);

  resetUI();
}

function checkColorSelectionAndReset() {
  //If none are selected, select all colors and update UI
  if (!isBlueSelected && !isRedSelected && !isGreenSelected && !isBlackSelected) {
    isBlueSelected = true;
    isRedSelected = true;
    isGreenSelected = true;
    isBlackSelected = true;

    updateColorSelectionUI("blueBtn", isBlueSelected);
    updateColorSelectionUI("redBtn", isRedSelected);
    updateColorSelectionUI("greenBtn", isGreenSelected);
    updateColorSelectionUI("blackBtn", isBlackSelected);
  }
}

function resetUI() {
  document.getElementById("guessedCards").innerHTML = 1;
  document.getElementById("totalCards").innerHTML = playableCards.length;
  document.getElementById("correct").innerHTML = 0;
  document.getElementById("revealed").innerHTML = 0;
  document.getElementById("wrong").innerHTML = 0;
}

//Update Buttons with UI Class (Shinny Border)
function updateColorSelectionUI(colorId, isColorSelected) {
  var colorBtn = document.getElementById(colorId);
  if (isColorSelected) {
    colorBtn.classList.add("selected");  
  }
  else {
    colorBtn.classList.remove("selected");
  }
}

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
  document.getElementById("correct").innerHTML = ++correctCounter;
}

function increaseRevealedCounter() {
  document.getElementById("revealed").innerHTML = ++revealedCounter;
}

function increaseWrongCounter() {
  document.getElementById("wrong").innerHTML = ++wrongCounter;
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

  //Check if there are any more cards!
  selectedCard = playableCards[++cardPosition];
  if (!selectedCard) {
    return;
  }

  hideManaCost(true);
  disableButtons(false);

  removeCardFromUI();
  showSelectedCard(selectedCard);
  document.getElementById("guessedCards").innerHTML = cardPosition + 1;
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

function showSelectedCard(selectedCard) {
  if (!selectedCard) {
    return;
  }

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
