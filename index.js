






// class for the card
class Card {
    constructor(number, shape, image) {
        this.number = number;
        this.shape = shape;
        this.image = image;
    }

    shapeEqualTo = (shape) => {
        let flag = false;
        if (this.shape == shape) {
            flag = true;
        }

        return flag;
    }
}

//class for the deck
class Deck {
    constructor() {
        this.cards = [];
    }

    getLength = () => {
        return this.cards.length;
    }

    getTopCard = () => {
        let card = this.cards[this.getLength() - 1];
        return card;
    }

    getSelectedCard = (position) => {
        let card = this.cards[position];
        return card;
    }

    add = (card) => {
        this.cards.push(card);
    }

    removeCardByPosition = (position) => {
        this.cards.splice(position, 1);
    }

    removeTopCard = () => {
        this.cards.pop();
    }

    clear = () => {
        this.cards = [];
    }

    shapeInCards = (shape) => {
        let i = 0;
        let length = this.getLength();
        let flag = false;
        let position = -1;

        for (i; i < length; i++) {
            if (this.cards[i].shapeEqualTo(shape)) {
                flag = true;
                position = i;
                break;
            }
        }

        return {found: flag, position};
    }
}

// class for the table
class Table {
    constructor(player1, player2) {
        this.closedDeck = new Deck();
        this.create52Cards();
        this.shuffleCards();
        this.openDeck = new Deck();
        this.player1Deck = new Deck();
        this.player2Deck = new Deck();
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.AiPlayer = null;
        this.chooseOpponent();
    }

    chooseOpponent = () => {
        
        if (this.player1 == "Marriam Makhadi") {
            this.AiPlayer = new AIPlayer(2, this);
        } else {
            this.AiPlayer = new AIPlayer(1, this);
        }
    }


    create52Cards = () => {
        let i = 0;
        let length = 13;

        for (i; i < length; i++) {
            let number = i + 1;
            let image = "./images/cards/" + number + "h.png";
            if (number == 11) {
                image = "./images/cards/jh.png";
            } else if (number == 12) {
                image = "./images/cards/qh.png";
            } else if (number == 13) {
                image = "./images/cards/kh.png";
            }
            let card1 = new Card(number, "heart", image);
            image = "./images/cards/" + number + "d.png";
            if (number == 11) {
                image = "./images/cards/jd.png";
            } else if (number == 12) {
                image = "./images/cards/qd.png";
            } else if (number == 13) {
                image = "./images/cards/kd.png";
            }
            let card2 = new Card(number, "diamond", image);
            image = "./images/cards/" + number + "s.png";
            if (number == 11) {
                image = "./images/cards/js.png";
            } else if (number == 12) {
                image = "./images/cards/qs.png";
            } else if (number == 13) {
                image = "./images/cards/ks.png";
            }
            let card3 = new Card(number, "spade", image);
            image = "./images/cards/" + number + "c.png";
            if (number == 11) {
                image = "./images/cards/jc.png";
            } else if (number == 12) {
                image = "./images/cards/qc.png";
            } else if (number == 13) {
                image = "./images/cards/kc.png";
            }
            let card4 = new Card(number, "club", image);

            this.closedDeck.add(card1);
            this.closedDeck.add(card2);
            this.closedDeck.add(card3);
            this.closedDeck.add(card4);
        }
    }

    shuffleCards = () => {
        let list = [];

        let i = 0;
        let length = 52;

        for (i; i < length; i++) {
            let r = Math.floor(Math.random() * length);

            while (this.valueInList(r, list)) {
                r = Math.floor(Math.random() * length);
            }

            list.push(r);
        }

        i = 0;
        let cards = [];
        for (i; i < length; i++) {
            let card = this.closedDeck.getSelectedCard(list[i]);
            cards.push(card);
        }

        this.closedDeck.cards = cards;
    }

    valueInList = (value, list) => {
        let flag = false;
        let i = 0;
        let length = list.length;

        for (i; i < length; i++) {
            if (value == list[i]) {
                flag = true;
                break;
            }
        }

        return flag;
    }

    // switch player
    switchPlayer = () => {
        if (this.currentPlayer == this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }

    // play from closed deck
    playFromClosedDeck = () => {
        
        let card = this.closedDeck.getTopCard();
        let openDeckLength = this.openDeck.getLength();

        // check if open table is empty
        if (openDeckLength < 1) {
            // open deck is empty
            this.openDeck.add(card);
            this.closedDeck.removeTopCard();
            this.switchPlayer();
        } else {
            //open deck is has something
            let card2 = this.openDeck.getTopCard();

            // check if the shapes are the same
            if (card.shape == card2.shape) {
                // the shapes are the same
                //check which player takes the cards
                if (this.currentPlayer == this.player1) {
                    // computer takes the cards
                    let cards = this.player1Deck.cards;
                    let cards2 = this.openDeck.cards;

                    this.player1Deck.cards = [...cards, ...cards2];
                    this.player1Deck.add(card);
                    this.closedDeck.removeTopCard();
                    this.openDeck.clear();

                } else {
                    // player takes the cards
                    let cards = this.player2Deck.cards;
                    let cards2 = this.openDeck.cards;

                    this.player2Deck.cards = [...cards, ...cards2];
                    this.player2Deck.add(card);
                    this.closedDeck.removeTopCard();
                    this.openDeck.clear();
                }

            } else {
                // the shapes are not the same
                this.openDeck.add(card);
                this.closedDeck.removeTopCard();
                this.switchPlayer();
            }
        }
    }
    // play from hand
    playFromHand = (position) => {
        let card;

        // check which player is playing
        if (this.currentPlayer == this.player1) {
            // the computer is playing
            card = this.player1Deck.getSelectedCard(position);
        } else {
            // the player is playing
            card = this.player2Deck.getSelectedCard(position);
        }


        let openDeckLength = this.openDeck.getLength();
        // check if the open deck is empty
        if (openDeckLength < 1) {
            // open deck is empty
            this.openDeck.add(card);

            // check which player is playing
            if (this.currentPlayer == this.player1) {
                // remove card from computer
                this.player1Deck.removeCardByPosition(position);
            } else {
                // remove card from player
                this.player2Deck.removeCardByPosition(position);
            }

            this.switchPlayer();
        } else {
            // open deck has something
            let card2 = this.openDeck.getTopCard();

            // check if shapes are the same
            if (card.shape == card2.shape) {
                // the shapes are the same
                // check which player is playing
                if (this.currentPlayer == this.player1) {
                    // computer takes the cards
                    let cards = this.player1Deck.cards;
                    let cards2 = this.openDeck.cards;

                    this.player1Deck.cards = [...cards, ...cards2];
                    this.openDeck.clear();
                } else {
                    // player takes the cards
                    let cards = this.player2Deck.cards;
                    let cards2 = this.openDeck.cards;
                    console.log(card);

                    this.player2Deck.cards = [...cards, ...cards2];
                    this.openDeck.clear();
                    this.AiPlayer.chooseTrapCard();
                }
            } else {
                // the shape are not the same
                this.openDeck.add(card);

                // check which player is playing
                if (this.currentPlayer == this.player1) {
                    // remove card from computer
                    this.player1Deck.removeCardByPosition(position);
                } else {
                    // remove card from player
                    this.player2Deck.removeCardByPosition(position);
                }

                this.switchPlayer();
            }
        }
    }
}

// class for AI player
class AIPlayer {
    constructor(level, table) {
        this.level = level;
        this.table = table;
        this.trapShape = "";
        this.trapLimit = 0;
        this.chooseTrapCard();
    }

    

    chooseTrapCard = () => {
        let list = ["heart", "spade", "diamond", "club"];
        let shape = list[Math.floor(Math.random() * 4)];
        let limit = Math.ceil((Math.random() * 6) + 5);

        this.trapShape = shape;
        this.trapLimit = limit;
    }

    playFromClosedDeck = () => {
        this.table.playFromClosedDeck();
    }

    // avoid trap card
    avoidTrapCard = () => {
        let i = 0;
        let length = this.table.openDeck.length;
        let position = -1;

        for (i; i < length; i++) {
            let card = this.table.player1Deck.getSelectedCard(i);
            if (card.shape != this.trapShape) {
                position = i;
                break;
            }
        }

        return position;
    }
    // avoid open deck card
    avoidOpenDeck = () => {
        let i = 0;
        let length = this.table.player1Deck.getLength();
        let position = -1;
        let card = this.table.openDeck.getTopCard();


        for (i; i < length; i++) {
            let card2 = this.table.player1Deck.getSelectedCard(i);
            if (card2.shape != card.shape) {
                position = i;
                break;
            }
        }

        return position;
    }
    // select trap card
    selectTrapCard = () => {
        let i = 0;
        let length = this.table.player1Deck.length;
        let position = -1;

        for (i; i < length; i++) {
            let card = this.table.player1Deck.getSelectedCard(i);
            if (card.shape == this.trapShape) {
                position = i;
                break;
            }
        }

        return position;
    }
    // select any card
    selectAnyCard = () => {
        let position = -1;

        let r = Math.floor(Math.random() * this.table.player1Deck.getLength());

        position = r;

        return position;
    }

    // play level 1
    playLevel1 = () => {

        let position = -1;

        // check if open deck is empty
        if (this.table.openDeck.getLength() > 0) {
            // open deck is not empty
            position = this.avoidOpenDeck();

            if (position == -1) {
                position = this.selectAnyCard();
            }
        } else {
            // open deck is empty
            position = this.selectAnyCard();
        }

        

        this.table.playFromHand(position);
    }

    // play level 2
    playLevel2 = () => {
        // check if ai is winning or losing
        let openDeckLength = this.table.openDeck.getLength();
        let player1DeckLength = this.table.player1Deck.getLength();
        let player2DeckLength = this.table.player2Deck.getLength();
        let position = -1;
        if (player1DeckLength > player2DeckLength) {
            // player is winning
            // check if is time to use trap card
            if (player2DeckLength <= this.trapLimit) {
                // is time to use trap card
                // check if table is empty
                if (openDeckLength > 0) {
                    //table is not empty
                    let card = this.table.openDeck.getTopCard();
                    // check if top is trap
                    if (card.shape == this.trapShape) {
                        // shapes are the same
                        position = this.avoidTrapCard();

                        if (position == -1) {
                        position = this.avoidOpenDeck();
                            if (position == -1) {
                                position = this.selectAnyCard();
                            }
                        }
                    } else {
                        // shapes are not the same
                        position = this.selectTrapCard();

                        if (position == -1) {
                            position = this.selectAnyCard();
                        }
                    }
                } else {
                    // table is empty
                    position = this.selectTrapCard();

                    if (position == -1) {
                        position = this.selectAnyCard();
                    }
                }
            } else {
                // is not time to use trap card
                // check if table is empty
                if (openDeckLength > 0) {
                    // table is not empty
                    position = this.avoidTrapCard();

                    if (position == -1) {
                        position = this.avoidOpenDeck();

                        if (position == -1) {
                            position = this.selectAnyCard();
                        }
                    }
                } else {
                    // table is empty
                    position = this.avoidTrapCard();

                    if (position == -1) {
                        position = this.selectAnyCard()
                    }
                }
                
            }
        } else {
            // player is losing
            // check if open table is empty
            if(openDeckLength < 1) {
                // open deck is empty
                position = this.selectAnyCard();
            } else {
                // open deck is not empty
                position = this.avoidOpenDeck();

                if (position == -1) {
                    position = this.selectAnyCard()
                }
            }
        }

        this.table.playFromHand(position)
    }

    // play
    play = () => {
        let closedDeckLength = this.table.closedDeck.getLength();

        if (closedDeckLength > 0) {
            // play from closed deck
            this.playFromClosedDeck();
        } else {
            // play from hand
            if (this.level == 1) {
                this.playLevel1();
            } else if (this.level == 2) {
                this.playLevel2();
            } else {
                this.playLevel1();
            }
        }
    }
}


// function to switch pages
const switchPages = (page) => {
    let list = ["loading", "welcome", "select", "match", "preMatch", "gamePlay", "team"];
    let i = 0;
    let length = list.length;

    for (i; i < length; i++) {
        if (page == list[i]) {
            document.getElementById(list[i]).style.display = "flex";
        } else {
            document.getElementById(list[i]).style.display = "none";
        }
    }

    
}

//class for user
class User {
    constructor() {
        this.name = "Player 2";
        this.opponent = "Paris Makhadi";
        this.wins = 0;
        this.loses = 0;
    }
}

let user = new User();

let data = localStorage.getItem("xiuser");

if (data == null) {
    // new user
    localStorage.setItem("xiuser", JSON.stringify(user));
} else {
    user = JSON.parse(data);
}

// function to change user name
const changeUserName = () => {
    user.name = txtUsername.value;
    saveToLocalStorage();
    alert("Name changed successfully to " + user.name);
}

// function to save on local storage
const saveToLocalStorage = () => {
    localStorage.setItem("xiuser", JSON.stringify(user))
}

// function to display user results
const displayUserResults = () => {
    let text = "Wins: " + user.wins + " Loses: " + user.loses;
    document.getElementById("lblUserResults").innerText = text;
}

//function to go to select
const goToSelect = () => {
    switchPages("select");
}

// function to select opponent
const selectOpponent = (opponent) => {
    user.opponent = opponent;
    saveToLocalStorage();

    let text = "";

    if (opponent == "Paris Makhadi") {
        text = "Paris Makhadi is the daughter of Gavin and Marriam Makhadi";
    } else if (opponent == "Gavin Makhadi") {
        text = "Gavin Makhadi is a father to Paris and husband to Marriam Makhadi";
    } else if (opponent == "Marriam Makhadi") {
        text = "Marriam Makhadi is a mother to Paris and wife to Gavin Makhadi";
    }

    document.getElementById("lblOpponent").innerText = text;
}


// function to go to match
const goToMatch = () => {
    switchPages("match");
    start();
}



//choose the loading page

switchPages("loading");

window.addEventListener("load", ()=> {
    switchPages("welcome");
    backgroundMusic.volume = 0.2;
})

// function to display closed deck
const displayClosedDeck = () => {
    closedDeck.innerHTML = "";

    if (table.closedDeck.getLength() > 0) {
        let card = document.createElement("img");
        card.src = "./images/cards/cardbg.png";
        card.classList.add("card");
        card.addEventListener("click", ()=> {
            table.playFromClosedDeck();
            displayAllDecks();
            checkWinner();
            checkForModal();
            if (table.currentPlayer == user.opponent) {
                play();
            }
            
        });
        closedDeck.appendChild(card);

    }

    
}
// function to display open deck
const displayOpenDeck = () => {
    openDeck.innerHTML = "";

    if (table.openDeck.getLength() > 0) {
        let card = document.createElement("img");
        card.src = table.openDeck.cards[table.openDeck.getLength() - 1].image;
        card.classList.add("card");
        openDeck.appendChild(card);
    }
    
}
// function to display player 1 deck
const displayPlayer1Deck = () => {
    let i = 0;
    let length = table.player1Deck.getLength();
    
    player1Deck.innerHTML = "";

    for (i; i < length; i++) {
        let card = document.createElement("img");
        card.src = "./images/cards/cardbg.png";
        card.classList.add("card");
        player1Deck.appendChild(card);
    }
}
// function to display player 2 deck
const displayPlayer2Deck = () => {
    let i = 0;
    let length = table.player2Deck.getLength();
    
    player2Deck.innerHTML = "";

    for (i; i < length; i++) {
        let card = document.createElement("img");
        card.src = table.player2Deck.getSelectedCard(i).image;
        card.classList.add("card");
        card.id = i;
        card.addEventListener("click", (e) => {
            if (table.closedDeck.getLength() > 0) {
                alert("Please play from closed deck first");
                return;
            }
            playFromHand(e.target.id);
            checkForModal();
            if (table.currentPlayer == user.opponent) {
                play();
            }
        });
        player2Deck.appendChild(card);
    }
}

// function to play from hand
const playFromHand = (position) => {
    table.playFromHand(position);
    displayAllDecks()
    checkWinner();
}
// function to display all decks
const displayAllDecks = () => {
    displayClosedDeck();
    displayOpenDeck();
    displayPlayer1Deck();
    displayPlayer2Deck();
    displayMatchResult();
}

// function to start new game
const start = () => {
    table = new Table(user.opponent, user.name);
    gameOver = false;
    displayAllDecks();
    checkForModal();
    maxControl = 0;
    backgroundMusic.play();
    play();
}

// function to display match result
const displayMatchResult = () => {
    lblCurrentPlayer.innerText = table.currentPlayer;
    lblClosedDeck.innerText = table.closedDeck.getLength();
    lblOpenDeck.innerText = table.openDeck.getLength();
    lblPlayer1Deck.innerText = table.player1Deck.getLength();
    lblPlayer2Deck.innerText = table.player2Deck.getLength();
    lblP1.innerText = user.opponent + ": ";
    lblP2.innerText = user.name + ": ";
}

// function for ai player to play
const play = () => {
    if (gameOver) {
        return;
    }
    
    if(table.currentPlayer == user.opponent) {
        setTimeout( () => {
            
            table.AiPlayer.play();
            displayAllDecks();
            if(table.currentPlayer == user.opponent) {
                play();
                
            }
            displayAllDecks();
            checkWinner();
            checkForModal();
        }, 300);
    } 
}

// function to put modal on
const checkForModal = () => {
    if (gameOver) {
        document.getElementById("modal").style.display = "none";
        return;
    }
    
    if (table.currentPlayer == user.opponent) {
        document.getElementById("lblModal").innerText = user.opponent + "'s turn";
        document.getElementById("modal").style.display = "flex";
    } else {
        document.getElementById("modal").style.display = "none";
    }
}

//function to check winner
const checkWinner = () => {
    let closedDeckLength = table.closedDeck.getLength();
    let player1DeckLength = table.player1Deck.getLength();
    let player2DeckLength = table.player2Deck.getLength();

    if (closedDeckLength < 1) {
        if (player1DeckLength < 1) {
            // favor for player 1
            if (player2DeckLength > 0) {
                gameOver = true;
                user.loses++;
                saveToLocalStorage();

                let text = "The winner is " + user.opponent + ", sorry better luck next time!";
                document.getElementById("lblWinner").innerText = text;
                document.getElementById("resultsImg").src = "./images/cards/lose.png";
                //switchPages("results");
                document.getElementById("results").style.display = "flex";
            }
        } else if (player2DeckLength < 1) {
            //favor for player 2
            if (player1DeckLength > 0) {
                gameOver = true;
                user.wins++;
                saveToLocalStorage();

                let text = "The winner is " + user.name + ", Congradulations to you, the game was " + maxControl + " seconds long.";
                document.getElementById("lblWinner").innerText = text;
                document.getElementById("resultsImg").src = "./images/cards/win.jpg";
                //switchPages("results");
                document.getElementById("results").style.display = "flex";
            }
        }
    }
}

// function to play again
const playAgain = () => {
    start();
    document.getElementById("results").style.display = "none";

}
// function to choose Another opponent
const chooseAnotherOpponent = () => {
    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    displayUserResults();
    switchPages("select");
    document.getElementById("results").style.display = "none";
}

// set timer
let timerControl;
let maxControl = 0;

const setTimer = () => {
    
  
    timerControl = setInterval(() => {
        maxControl++
        document.getElementById("lblTimer").innerText = maxControl;
    }, 1000);
  
}

// e is non-finite.

// change volume function
const changeVolume = (number) => {
    backgroundMusic.volume = number;
}
//set the username
txtUsername = document.getElementById("username");
txtUsername.value = user.name;
displayUserResults()


// variables for card decks
let player1Deck = document.getElementById("player1Deck");
let player2Deck = document.getElementById("player2Deck");
let closedDeck = document.getElementById("closedDeck");
let openDeck = document.getElementById("openDeck");

// variables for match info
let lblCurrentPlayer = document.getElementById("lblCurrentPlayer");
let lblClosedDeck = document.getElementById("lblClosedDeck");
let lblOpenDeck = document.getElementById("lblOpenDeck");
let lblPlayer1Deck = document.getElementById("lblPlayer1");
let lblPlayer2Deck = document.getElementById("lblPlayer2");

let lblP1 = document.getElementById("lblP1");
let lblP2 = document.getElementById("lblP2");

// variables for the match
let table = new Table(user.name, user.opponent);
let gameOver = false;

setTimer();

let backgroundMusic = document.getElementById("music");

