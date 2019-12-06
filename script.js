let suits = [
  "&#10084;", // Hearts
  "&#9827;", // Clubs
  "&#9830;", //Diamonds
  "&#9824;" // Spades
];
let values = [
  "Ace",
  "King",
  "Queen",
  "Jack",
  "Ten",
  "Nine",
  "Eight",
  "Seven",
  "Six",
  "Five",
  "Four",
  "Three",
  "Two"
];

const textArea = document.getElementById("text-area");
const startButton = document.getElementById("start-button");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");

//hide the hit and stand button in the beginning
hitButton.style.display = "none";
standButton.style.display = "none";

let gameStart = false,
  gameOver = false,
  gameDraw = false,
  bet = 1,
  balance = 100,
  playerWon = false;
let deck = [];
let dealerCards = [];
let playerCards = [];
let dealerScore = 0,
  playerScore = 0;

//When player clicks on hit, gets another card
hitButton.addEventListener("click", function() {
  playerCards.push(nextCard());
  checkEndOfGame();
  showStatus();
});

//When player clicks on stand, dont push card
standButton.addEventListener("click", function() {
  gameOver = true;
  checkEndOfGame();
  showStatus();
});

//When player isn't drawing anymore cards, withdraw card for dealer
function checkEndOfGame() {
  updateScores();
  if (gameOver) {
    while (dealerScore < playerScore && dealerScore < 21 && playerScore < 21) {
      dealerCards.push(nextCard());
      updateScores();
    }
  }
  //check for win or draw, as well as update balance
  if (playerScore > 21) {
    gameOver = true;
    gameDraw = false;
    playerWon = false;
    balance -= bet;
  } else if (dealerScore > 21) {
    gameOver = true;
    gameDraw = false;
    playerWon = true;
    balance += bet;
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
      gameDraw = false;
      balance += bet;
    } else if (playerScore < dealerScore) {
      playerWon = false;
      gameDraw = false;
      balance -= bet;
    } else {
      gameDraw = true;
    }
  }
}

//When player clicks the start button, it'll prompt player to enter bett amt
startButton.addEventListener("click", function() {
  bet = prompt("Enter bet", bet);
  if (isNaN(bet)) {
    alert("Error. Bet was set to 1 as default");
    bet = 1;
  } else {
    bet = Number(bet);
  }
  if (bet > balance) {
    alert("Not enough balance");
    return;
  }
  //hide start button and display hit/stand buttns
  startButton.style.display = "none";
  hitButton.style.display = "";
  standButton.style.display = "";

  gameStart = true;
  gameOver = false;
  playerWon = false;

  createDeck();
  shuffleDeck();
  dealerCards = [nextCard(), nextCard()];
  playerCards = [nextCard(), nextCard()];
  showStatus();
});

//showing what the total score for dealer and player
function showStatus() {
  updateScores();
  textArea.innerHTML = "<b>Balance is " + "$" + balance + " </b><hr />";
  textArea.innerHTML += "<b>Bet is " + "$" + bet + " </b><hr />";
  textArea.innerHTML += "<b>Dealer: " + dealerScore + "</b> <br/>";
  for (let i = 0; i < dealerCards.length; i++) {
    textArea.innerHTML +=
      dealerCards[i].value + " " + dealerCards[i].suit + " <br/>";
  }
  textArea.innerHTML += "<br/><b>Player: " + playerScore + "</b> <br/>";
  for (let i = 0; i < playerCards.length; i++) {
    textArea.innerHTML +=
      playerCards[i].value + " " + playerCards[i].suit + " <br/>";
  }
  if (gameOver) {
    if (gameDraw) {
      textArea.innerHTML += "<br/> <b>Draw. </b>";
    } else {
      if (playerWon) {
        textArea.innerHTML += "<br/> <b>Player Won. </b>";
      } else {
        textArea.innerHTML += "<br/> <b>Dealer Won. </b>";
      }
    }
    startButton.style.display = "";
    hitButton.style.display = "none";
    standButton.style.display = "none";
  }
}

//constantly updating the scores/total
function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

//if total score is higher thatn 21, then make ace value = 1 instead of 11
function getScore(cards) {
  let score = 0;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].value == "Ace" && score + 11 > 21) {
      score += 1;
    } else {
      score += convertToNumber(cards[i].value);
    }
  }
  return score;
}

//convert string to number for value when adding to total score
function convertToNumber(value) {
  switch (value) {
    case "Two":
      return 2;
    case "Three":
      return 3;
    case "Four":
      return 4;
    case "Five":
      return 5;
    case "Six":
      return 6;
    case "Seven":
      return 7;
    case "Eight":
      return 8;
    case "Nine":
      return 9;
    case "Ace":
      return 11;
    default:
      return 10;
  }
}

//draw a card
function nextCard() {
  return deck.shift();
}

//mixing the suits with numbers
function createDeck() {
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      let card = {
        value: values[j],
        suit: suits[i]
      };
      deck.push(card);
    }
  }
}

//swapping the cards
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    const swapIndex = Math.floor(Math.random() * deck.length);
    let tmp = deck[i];
    deck[i] = deck[swapIndex];
    deck[swapIndex] = tmp;
  }
}

//setting up the balance
balance = prompt("How much would you like to bet?", 100);
if (isNaN(balance)) {
  alert("Error. balance was set to 100");
  balance = 100;
} else {
  balance = Number(balance); // "50" => 50
}
textArea.innerHTML = "<b>Balance is " + "$" + balance + " </b><hr />";
