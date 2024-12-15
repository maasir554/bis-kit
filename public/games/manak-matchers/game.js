/*
-------------------------------------------------
github.com/maasir554/card-matching-game/app/data.js
-------------------------------------------------
Function related to populating HTML directly.
-------------------------------------------------
Date Created : 12th of June, 2023
-------------------------------------------------
copyright(c) 2023, Mohammad Maasir
--------------------------------------------------
*/

const game = document.getElementById("game");
const root = document.querySelector(":root");

// Function to generate N random product pairs between a given range
function generateRandomPairs(n, maxRange) {
  const selectedPairs = new Set();

  while (selectedPairs.size < n) {
    let randomIndex = Math.floor(Math.random() * maxRange) + 1; // Random between 1 and maxRange
    selectedPairs.add([`product_${randomIndex}`, `product_${randomIndex}_standard`].join(","));
  }

  // Convert back to array format [["product_x", "product_x_standard"], ...]
  return Array.from(selectedPairs).map((item) => item.split(","));
}

let RelatedPairs;

// Fisher-Yates Shuffle Algorithm
function ShuffledArray(arr) {
  let i = arr.length;
  let i_random;

  while (i != 0) {
    i_random = Math.floor(Math.random() * i);
    i--;
    [arr[i], arr[i_random]] = [arr[i_random], arr[i]];
  }

  return arr;
}

let gridSize = 4; // for a 4 x 4 grid

const populate = (size) => {
  // Generate exactly 8 random pairs from the range product_1 to product_160
  RelatedPairs = generateRandomPairs(8, 160);
  let totalCards = size * size; // total tiles
  let count_required_pairs = Math.floor(totalCards / 2);

  // Flatten the selected pairs to get all images and shuffle
  let images = [];
  RelatedPairs.slice(0, count_required_pairs).forEach((pair) => {
    images.push(...pair); // Add both images of each pair
  });

  images = ShuffledArray(images); // Shuffle the flattened list of images

  // Set grid dimensions
  let sizeStr = "";
  for (let i = 1; i <= size; i++) {
    sizeStr += "1fr ";
  }
  root.style.setProperty("--grid-size", sizeStr);

  // Populate the grid
  game.innerHTML = "";
  images.forEach((e) => {
    game.innerHTML += `
      <button type="button" class="card" data-image="${e}">
          <div class="sides-encloser">
                <img inert src="assets/default.png" alt="question" draggable="false" class="front" />
                <img inert src="assets/${e}.png" alt="item" draggable="false" class="back" />
          </div>
      </button>
    `;
  });
};

populate(gridSize);

let gameCards = document.querySelectorAll(".card");

const shuffle = () => {
  gameCards.forEach((element) => {
    let index = Math.round(Math.random() * gameCards.length);
    element.style.order = index;
  });
};

// Even after the population, shuffling is VERY important
shuffle();

// const root = document.querySelector(":root"); /* root alredy imported in previosus scripts.*/
// `root` was alredy defined in data.js
const togglePlayButton = document.querySelector("#play");
const statusBox = document.getElementById("game-status");
const gameMenu = document.getElementById("game-info");
 
let gameIsRunning = false;

const PlayPause = () => {
  // console.log("The function PlayPause has bee called!");

  if (togglePlayButton.innerText == "Play Again") {
    pairedCards = []; // reset the array of paired cards
    manuallyOpenedCards = [];
    populate(gridSize);
    gameCards = document.querySelectorAll(".card");
    shuffle();
    //NOTE: gameIsRunning is still FALSE. the below if-else seq. will run accordingly.
    //For Stop Clock :
    mins = 0;
    secs = 0;
    movesConsumedCount = 0;
    let MovesConsumedCountContainer = document.getElementById("moves-consumed"); // container alredy defined in one of the subsequent sections but still we have to define it here.
    MovesConsumedCountContainer.innerText = movesConsumedCount 
    // TIMER_INT = setInterval(timeUpdater, 1000); //this will be called in the next if/else block.
    // So, no worries.
  } else {
  }
  // -----------------------------------------------------------------
  if (gameIsRunning) {
    // console.log("just before you clicked button, gameIsRunning was TRUE");
    pauseGame(); // defined in app.js
    gameIsRunning = false;
    togglePlayButton.innerText = "Resume";
    root.style.setProperty("--menu-btn-primary", "rgb(65, 177, 0)");
    root.style.setProperty("--menu-btn-secondary", "rgb(73, 199, 0");
    root.style.setProperty("--menu-btn-tertiary", "rgb(59, 161, 0)");
    statusBox.innerText = "Game(Paused) :";
    gameMenu.style.opacity = "1";
    gameMenu.style.border = "2px solid white";
    //For stop clock :
    clearInterval(TIMER_INT);
  } else {
    // console.log("just before you clicked button, gameIsRunning was FALSE");
    runGame(); // defined in app.js
    gameIsRunning = true;
    togglePlayButton.innerText = "Pause";
    root.style.setProperty("--menu-btn-primary", "rgb(10 80 0)");
    root.style.setProperty("--menu-btn-secondary", "rgb(35 110 0)");
    root.style.setProperty("--menu-btn-tertiary", "rgb(8 65 0)");
    statusBox.innerText = "Game(Running) :";
    gameMenu.style.opacity = "0.75";
    gameMenu.style.border = "2px solid transparent";
    // for stop-clock
    TIMER_INT = setInterval(timeUpdater, 1000);
  }
  //-------------------------
};

togglePlayButton.addEventListener("click", PlayPause);

//when the game is complete, i.e. the user ha won the game, then:
// VictoryChecker wil be used in app.js

const VictoryChecker = () => {
  // this function not only checks victory, but updates the DOM after victory.
  // gridSize can be found in data.js
    if (pairedCards.length == gridSize ** 2) {
      gameIsRunning = false;
      togglePlayButton.innerText = "Play Again";
      root.style.setProperty("--menu-btn-primary", "rgb(65, 177, 0)");
      root.style.setProperty("--menu-btn-secondary", "rgb(73, 199, 0");
      root.style.setProperty("--menu-btn-tertiary", "rgb(59, 161, 0)");
      statusBox.innerText = "Enjoyed? :";
      gameMenu.style.opacity = "1";
      gameMenu.style.border = "1px solid white";
      //For StopClock:
      clearInterval(TIMER_INT);
      // Now, for the dialogue box and overlay, :-
      setTimeout(() => {
        root.style.setProperty("--victory-box-display-switch", "flex");
        root.style.setProperty("--overlay-display-switch", "block");
      }, 250);
      pairedCards.forEach((e) => {
        e.removeEventListener("click", VictoryChecker); // to avoid glitch.
        removeEventListener("click", ScoreUpdater);
        e.removeEventListener("click", MovesCounsumedCountUpdater);
        e.children[0].children[1].style.animation = "rainbow 0.5s infinite";
      });

      // details to be filled in dialogue box : -----
      let timeOfCompletionGreeting =
        document.getElementById("time-of-completion");

      timeOfCompletionGreeting.innerText =
        //using ternary operator, cause... why not!
        secs > 9 ? `${mins}:${secs}` : `${mins}:0${secs}`;

      let movesLeftReport = document.getElementById("moves-of-completion");
      movesLeftReport.innerText = movesConsumedCount;
      //------x--------x--------x--------x--------
    }
};
// Now, for closing the victory box :
crossVictoryBoxButton = document.getElementById("victory-box-close-button");
closeVictoryBoxButton = document.getElementById("close-victory-box");
closeVictoryBoxButton.addEventListener("click", () => {
  root.style.setProperty("--victory-box-display-switch", "none");
  root.style.setProperty("--overlay-display-switch", "none");
});
crossVictoryBoxButton.addEventListener("click", () => {
  root.style.setProperty("--victory-box-display-switch", "none");
  root.style.setProperty("--overlay-display-switch", "none");
});

// For navigation bar :

// For the Info Button
const instrucBtn = document.getElementById("instruction-button");
const instrucCloseBtn = document.getElementById("instructions-close-button");

instrucBtn.addEventListener("click", () => {
  /* Yeh variable andar define karna bahut hi zaroori hai, warna ye update nahi hota hai.. */
  let instrucDisplay = getComputedStyle(root).getPropertyValue(
    "--instructions-display"
  );
  if (instrucDisplay == "none") {
    root.style.setProperty("--instructions-display", "block");
    instrucBtn.style.opacity = "1";
  } else {
    root.style.setProperty("--instructions-display", "none");
    instrucBtn.style.fill = "white";
    instrucBtn.style.opacity = "0.65";
  }
  //For improved UX :
  root.style.setProperty("--settings-display", "none");
  settingsBtn.style.fill = "white";
  settingsBtn.style.opacity = "0.65";
});
instrucCloseBtn.addEventListener("click", () => {
  root.style.setProperty("--instructions-display", "none");
  instrucBtn.style.fill = "white";
  instrucBtn.style.opacity = "0.65";
});

// For the settings button :
const settingsBtn = document.getElementById("settings-button");
const settingsCloseBtn = document.getElementById("settings-close-button");
settingsBtn.addEventListener("click", () => {
  /* Yeh variable andar define karna bahut hi zaroori hai, warna ye update nahi hota hai.. */
  let settingsDisplay =
    getComputedStyle(root).getPropertyValue("--settings-display");
  if (settingsDisplay == "none") {
    root.style.setProperty("--settings-display", "grid");
    settingsBtn.style.opacity = "1";
  } else {
    root.style.setProperty("--settings-display", "none");
    settingsBtn.style.fill = "white";
    settingsBtn.style.opacity = "0.65";
  }
  //For improved UX :-
  root.style.setProperty("--instructions-display", "none");
  instrucBtn.style.opacity = "0.65";
  instrucBtn.style.fill = "white";
});
settingsCloseBtn.addEventListener("click", () => {
  root.style.setProperty("--settings-display", "none");
  settingsBtn.style.fill = "white";
  settingsBtn.style.opacity = "0.65";
});

// For moves Consumed :
let movesConsumedCount = 0;
const MovesCounsumedCountUpdater = () => {
  let MovesConsumedCountContainer = document.getElementById("moves-consumed");
  movesConsumedCount += 1;
  MovesConsumedCountContainer.innerText = movesConsumedCount;
  MovesConsumedCountContainer.style.color = "white";
  MovesConsumedCountContainer.style.opacity = "1";
  MovesConsumedCountContainer.style.textShadow = "0px 0px 5px red";
  setTimeout(() => {
    MovesConsumedCountContainer.style.color = "var(--gi-moves-consumed-color)";
    MovesConsumedCountContainer.style.opacity = "0.75";
    MovesConsumedCountContainer.style.textShadow = "none";
  }, 100);
};

//For score calculation :

highScoreBox = document.getElementById("high-score-box");
currentScoreBox = document.getElementById("current-score-box");
scoreDialogueBox = document.getElementById("score"); // inside the victory box.
if (localStorage.getItem("HighScore") != "null") {
  highScoreBox.innerText = localStorage.getItem("HighScore");
} else {
  highScoreBox.innerText = 0;
} // to populate when page is loaded
ScoreUpdater = () => {
  LSHighScore = localStorage.getItem("HighScore");
  let HighScore = LSHighScore != "null" ? LSHighScore : 0;
  let t = secs + mins * 60;
  let currentScore = Math.floor(
    pairedCards.length ** 5 / (1 + t ** 2 + movesConsumedCount ** 2)
  );
  if (currentScore > HighScore) {
    HighScore = currentScore;
  }

  currentScoreBox.innerText = currentScore;
  scoreDialogueBox.innerText = currentScore;
  highScoreBox.innerText = HighScore;
  localStorage.setItem("HighScore", HighScore);
};


const successStyler = (i) => {
    /* To be fired when two cards gets paired.*/
    i.style.backgroundColor = "transparent";
    i.style.borderColor = "transparent";
    i.children[0].children[1].style.borderColor = "lightgreen";
    i.children[0].children[1].style.outline = "none";
    i.style.animation = "pop 0.5s 1";
    i.children[0].children[1].style.animation = "rainbow 1s 2";
  };
  
  const circleHighlighter = (event) => {
    elem = event.currentTarget;
    elem.children[0].children[0].style.borderColor = "rgba(255, 255, 255, 0.85)";
  };
  
  const circleReverter = (event) => {
    elem = event.currentTarget;
    elem.children[0].children[0].style.borderColor = "rgba(255, 255, 255, 0.5)";
  };

  
  clock = document.getElementById("elapsed-time");
let [mins, secs] = [0, 0];
let TIMER_INT; // this variable will be used in menus.js (I have to do this because of the poor behaviour of JS.)

const timeUpdater = () => {
  if (secs < 60) {
    secs++;
  } else {
    secs = 0;
    mins++;
  }
  clock.innerText = secs;
  if (secs < 10) {
    clock.innerText = `${mins}:0${secs}`;
  } else {
    clock.innerText = `${mins}:${secs}`;
  }
};
// the interval should NOT be toos mall like 100 ms as then JS will lag too much...
// setInterval(timeUpdater, 1000);

gameCards = document.querySelectorAll(".card");
gameBox = document.querySelector("#game");

let maxManuallyOpenableElements = 2; // max no. of cards that can be opened simultaneously.
let manuallyOpenedCards = [];
let pairedCards = [];
let isCheckingCards = false; // Flag to prevent further clicks during evaluation

// Flip card logic
const sideFlipper = (event) => {
  const element = event.currentTarget;
  if (
    !isCheckingCards &&
    !manuallyOpenedCards.includes(element) &&
    manuallyOpenedCards.length < maxManuallyOpenableElements
  ) {
    element.children[0].style.transform = "rotateY(180deg)";
    manuallyOpenedCards.push(element);
  }
};

// Function to check if two cards match
const cardLogic = () => {
  if (manuallyOpenedCards.length === 2) {
    isCheckingCards = true; // Prevent new clicks during check
    const [card1, card2] = manuallyOpenedCards;

    const isRelatedPair = (img1, img2) => {
      return RelatedPairs.some((pair) => pair.includes(img1) && pair.includes(img2));
    };

    if (
      isRelatedPair(
        card1.dataset.image,
        card2.dataset.image
      )
    ) {
      // Cards match: remove event listeners and add to paired cards
      manuallyOpenedCards.forEach((card) => {
        card.removeEventListener("click", sideFlipper);
        pairedCards.push(card);
        successStyler(card); // Style matched cards
      });
      manuallyOpenedCards = [];
      isCheckingCards = false;
    } else {
      // Cards do not match: flip them back after delay
      setTimeout(() => {
        manuallyOpenedCards.forEach((card) => {
          card.children[0].style.transform = "rotateY(0deg)";
        });
        manuallyOpenedCards = [];
        isCheckingCards = false;
      }, 750); // 750ms delay
    }
  }
};

function runGame() {
  gameCards.forEach((e) => {
    if (!pairedCards.includes(e)) {
      e.addEventListener("click", sideFlipper);
      e.addEventListener("click", cardLogic);
      e.addEventListener("mouseenter", circleHighlighter); // Optional styling
      e.addEventListener("mouseleave", circleReverter);    // Optional styling
      e.addEventListener("click", VictoryChecker); // Checks if the user had completed the game
      e.addEventListener("click", MovesCounsumedCountUpdater);
      }
      e.style.opacity = "1"; // Reset opacity when game starts
  });
  addEventListener("click", ScoreUpdater);
}

function pauseGame() {
  gameCards.forEach((e) => {
    e.removeEventListener("click", sideFlipper); // flip the card on click
    e.removeEventListener("click", cardLogic); // this will run cardLogic, every time you click a card.
    e.removeEventListener("mouseenter", circleHighlighter); // Just for dopamine!
    e.removeEventListener("mouseleave", circleReverter); // Just for Dopamine!
    e.removeEventListener("click", VictoryChecker); //in menus.js
    e.removeEventListener("click", MovesCounsumedCountUpdater);
    e.style.opacity = "0.25"; // Visual feedback for paused state
  });
}

// Initialize the game in a paused state
pauseGame();
// Example: runGame can be called to start/restart the game
// runGame();


