/****************************
 * === Global Variables === *
 ****************************/
var selectedCard;
var cardPosition = 0;
var allCards;
var itemCards = [];

//Result Counters
var correctCounter = 0;
var wrongCounter = 0;

// Read DB (JSON) and then load a card into the website
$.getJSON('https://raw.githubusercontent.com/g3neralz/g3neralz.github.io/master/data/cards.json', function(data) {

  allCards = data.Cards;
  
  filterCards();
  //shuffleItemCards();

  selectedCard = itemCards[cardPosition];
  showSelectedCard(selectedCard);

  document.getElementById("totalCards").innerHTML = itemCards.length;
});

//Filter Cards And Stash Them by Color
function filterCards() {
  var card;
  for (i = 0; i < allCards.length; i++) {
    card = allCards[i];

    if (isPlayableCard(card)) {
      itemCards.push(card);
    }
  }

  console.log("Total Cards: " + itemCards.length);
}

//Filter only Item Cards
function isPlayableCard(card) {
  return card.CardType === "Item";
}

function shuffleItemCards() {
  let counter = itemCards.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = itemCards[counter];
    itemCards[counter] = itemCards[index];
    itemCards[index] = temp;
  }
}

function resetUI() {
  document.getElementById("guessedCards").innerHTML = 1;
  document.getElementById("totalCards").innerHTML = itemCards.length;
  document.getElementById("correct").innerHTML = 0;
  document.getElementById("wrong").innerHTML = 0;
}

function enterPressed(e) {
  if (e.keyCode == 13) {
    checkAnswer();
    return false;
  }
}

function checkAnswer() {
  var goldTextfield = document.getElementById("goldInput");
  var goldValue = goldTextfield.value;
  
  if (!goldValue) {
    return;
  }

  var result;

  if (goldValue == selectedCard.GoldCost) {
    increaseCorrectCounter();
    result = "correct";

    nextCard();
  }
  else {
    increaseWrongCounter();
    result = "wrong";

    hideGoldCost(false);
    disableButtons(true);
    focusNextButton();
  }

  updateResultTextAndStyle(result);

  goldTextfield.value = '';
  goldTextfield.focus();
}

function updateResultTextAndStyle(result) {
  var responseText = document.getElementById("responseText");
  responseText.innerHTML = result;
  responseText.className = result;
}

function increaseCorrectCounter() {
  document.getElementById("correct").innerHTML = ++correctCounter;
}

function increaseWrongCounter() {
  document.getElementById("wrong").innerHTML = ++wrongCounter;
}

function revealGold() {
  hideGoldCost(false);
  disableButtons(true);
  focusNextButton();
}

function disableButtons(disabled) {
  document.getElementById("goldInput").disabled = disabled;
  document.getElementById("submitBtn").disabled = disabled;
}

function nextCard() {

  //Check if there are any more cards!
  selectedCard = itemCards[++cardPosition];
  if (!selectedCard) {
    return;
  }

  hideGoldCost(true);
  disableButtons(false);

  removeCardFromUI();
  showSelectedCard(selectedCard);
  document.getElementById("guessedCards").innerHTML = cardPosition + 1;
  clearAndFocusGoldInput();
}

function removeCardFromUI() {
  var elem = document.querySelector('#item-card');
  elem.parentNode.removeChild(elem);
}

function clearAndFocusGoldInput() {
  var goldTextfield = document.getElementById("goldInput");
  goldTextfield.value = '';
  goldTextfield.focus();
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
  console.log(selectedCard.fileName + " - " + selectedCard.GoldCost);
  cardDiv.dataset.item = selectedCard.fileName;
  cardDiv.dataset.view = "item-card";
  cardDiv.id = "item-card";
  cardDiv.className = "card";

  manaContainer.appendChild(cardDiv);
}

function hideGoldCost(hideGoldCost) {
  if (hideGoldCost) {
    document.getElementById("sparkle").style.visibility = 'visible'
  }
  else {
    document.getElementById("sparkle").style.visibility = 'hidden';
  }
}
