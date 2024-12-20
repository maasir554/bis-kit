let fadeAlpha = 0; // Opacity for fade effect
let fadingIn = true; // Control the direction of fade
let fadeSpeed = 10; // Speed of fade animation
let balloons = [];
let relationships = {}; // Mapping of item1 to item2
let products = []; // List of item1 (products)
let standards = []; // List of item2 (standards)
let usedStandards = []; // Track standards currently in use by balloons
let availableStandards = []; // Pool of standards not currently used
let targetProduct; // Current target product (item1)
let targetAvailable = false; // Flag to check if target product is available
let targetImage; // Image of the target product (item1)
let itemImages = {}; // Loaded images for all items
let balloonSize;
let clickRadius;
let points = 0; // Player score / points
let health = 4;
let popSpriteSheet;
let popFrames = [];
let totalFrames = 8; // Number of frames in the sprite sheet (8 frames)
let frameWidth = 320, frameHeight = 320; // Each frame is now 320x320
let currentPopFrame = 0; // Current frame of the animation
let frameCounter = 0; // Counter to control frame updates
let framesPerUpdate = 10; // Number of frames to wait before changing the animation frame
let sampleSize; // Number of rows to randomly select from the CSV
let soundWrong, soundPop, soundBackground; // Sound effects
let gameState = "loading"; // Options: "menu", "playing", "gameOver", "paused"
let buttonSize, margin;
let soundStarted = false;
let bislogo;
let lastsessionscore = 0;

function preload() {
  // Load sound effects
  gameState = "loading";
  soundWrong = loadSound('/assets/wrong.wav');
  soundPop = loadSound('/assets/pop.wav');
  soundBackground = loadSound('/assets/background.mp3');
  soundPop.setVolume(0.3);
  bislogo = loadImage('/assets/default.png');
  
  // Load CSV file
  let data = loadTable("/assets/data.csv", "csv", "header", () => {
    let rowCount = data.getRowCount();
    let selectedRows = []; // To store randomly selected rows
    sampleSize = 18; // Number of rows to randomly select (adjust as needed)

    // Generate random indices to pick rows
    while (selectedRows.length < sampleSize) {
      let randomIndex = floor(random(rowCount));
      if (!selectedRows.includes(randomIndex)) {
        selectedRows.push(randomIndex);
      }
    }

    // Process only the selected rows
    for (let index of selectedRows) {
      let row = data.getRow(index);
      let item1 = row.getString("item1");
      let item2 = row.getString("item2");
      let path1 = row.getString("pathtoitem1");
      let path2 = row.getString("pathtoitem2");

      // Map relationships
      relationships[item1] = item2;

      // Load images
      itemImages[item1] = loadImage(path1);
      itemImages[item2] = loadImage(path2);

      // Separate item1 (products) and item2 (standards)
      if (!products.includes(item1)) products.push(item1);
      if (!standards.includes(item2)) standards.push(item2);
    }
  });

  // Load the sprite sheet for the balloon pop animation
  popSpriteSheet = loadImage('/assets/pop_spritesheet.png'); // Replace with your sprite sheet path
}

function assetLoaded() {
  // Check if all assets are loaded using isLoaded function
  if (isLoaded(itemImages) && popSpriteSheet && soundWrong && soundPop && soundBackground && bislogo && gameState === "loading") { 
    hideLoadingScreen();
  }
}

function hideLoadingScreen() {
  document.getElementById("p5_loading").style.display = "none";
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  balloonSize = min(width, height) * 0.25; // Balloon size
  clickRadius = balloonSize * 0.6; // Radius for clicking balloons
  // Slice the sprite sheet into individual frames (now 320x320)
  for (let i = 0; i < totalFrames; i++) {
    let x = i * frameWidth; // Horizontal offset for each frame
    let frame = popSpriteSheet.get(x, 0, frameWidth, frameHeight); // Crop the frame from the sprite sheet
    popFrames.push(frame); // Store each frame in the array
  }
  pickNewTarget(); // Select initial target product
  spawnBalloons(); // Create balloons
  pixelDensity(1.5); // For performance
  frameRate(60);
  gameState = "menu";
}

function draw() {
  if (gameState === "menu") {
    drawMainMenu();
  } 
  else if (gameState === "playing") {
    drawBackground();

    for (let balloon of balloons) {
      balloon.move();
      balloon.show();
    }

    drawHUD();
    drawTargetProduct();

    if (health <= 0) {
      gameState = "gameOver";
    }
    if(screen.width > 600){
      drawCrosshair();
    }
  } 
  else if (gameState === "paused") {
    drawPauseMenu();
  } 
  else if (gameState === "gameOver") {
    displayGameOver();
  }
}


let pulseSize = 20;
function drawCrosshair() {
  stroke(255, 0, 0);
  strokeWeight(3);
  noFill();

  pulseSize = 20 + sin(frameCount * 0.1) * 2; // Pulse effect

  line(mouseX - 20, mouseY, mouseX + 20, mouseY);
  line(mouseX, mouseY - 20, mouseX, mouseY + 20);
  ellipse(mouseX, mouseY, pulseSize, pulseSize);
  noStroke();
  strokeWeight(1);
}


function drawMainMenu() {
  if (screen.width > 600){
    //draw the main menu with logo on top left and start button on the center of the screen and game name above the button without image
    textAlign(CENTER, CENTER);
    //draw greyish black background
    fill(18);
    rect(0, 0, width, height);
    //set text color
    fill(255);
    textSize(48);
    //ensure the display the name in one line
    textFont('Comic Sans MS');
    text("Shoot'em Standards", width / 2, height / 2.5);
    textSize(24);
    fill(255);
    text("Click anywhere to start", width / 2, height / 1.5);
    imageMode(CENTER);
    //draw the logo on top left of the screen
    //draw the logo on top left of the screen with some margin

    image(bislogo, width * 0.1, height * 0.2);
    //add text in front of the logo
    textSize(32);
    text("BISKit", width * 0.1, height * 0.25 + bislogo.height / 2);
  }
  else{
    //draw the main menu with logo on top left and start button on the center of the screen and game name above the button without image
    textAlign(CENTER, CENTER);
    //draw greyish black background
    fill(18);
    rect(0, 0, width, height);
    //set text color
    fill(255);
    textSize(24);
    //ensure the display the name in one line
    textFont('Comic Sans MS');
    text("Shoot'em Standards", width / 2, height / 3);
    textSize(16);
    fill(255);
    text("Click anywhere to start", width / 2, height / 1.5);
    imageMode(CENTER);
    //draw the logo on top left of the screen
    //draw the logo on top left of the screen with some margin

    image(bislogo, width/2, height * 0.1, width * 0.3, width * 0.3);
    //add text in front of the logo
    textSize(16);
    text("BISKit", width/2, height * 0.2);
  }
}

function replaceBalloon(index) {
  let oldStandard = balloons[index].standard;

  // Return the popped balloon's standard to available standards
  let usedIndex = usedStandards.indexOf(oldStandard);
  if (usedIndex !== -1) usedStandards.splice(usedIndex, 1);
  if (!availableStandards.includes(oldStandard)) availableStandards.push(oldStandard);

  balloons.splice(index, 1); // Remove the popped balloon

  // Determine the new standard for the replacement
  let newStandard;
  if (!usedStandards.includes(relationships[targetProduct])) {
    // Ensure the correct standard is added if missing
    newStandard = relationships[targetProduct];
  } else {
    // Otherwise, pick a random available standard
    newStandard = pickAndRemoveStandard();
  }

  if (newStandard) addBalloon(newStandard);
}



function drawBackground() {
  // Gradient sky
  for (let y = 0; y < height; y++) {
    let c = lerpColor(color(135, 206, 250), color(255, 250, 200), y / height);
    stroke(c);
    line(0, y, width, y);
  }

  // Clouds
  drawClouds();
}

function drawClouds() {
  noStroke();
  fill(255, 255, 255, 150);
  ellipse(width * 0.3, height * 0.2, 150, 80);
  ellipse(width * 0.6, height * 0.1, 200, 100);
  ellipse(width * 0.8, height * 0.3, 120, 60);
}

function drawTargetProduct() {
  if (!targetImage) return;

  // Adjust fadeAlpha for fade-in/out effect
  if (fadingIn) {
    fadeAlpha += fadeSpeed;
    if (fadeAlpha >= 255) {
      fadeAlpha = 255;
      fadingIn = false; // Fade-in complete
    }
  }

  if (targetImage && screen.width > 600) {
    // Draw product image (item1)
    push();
    tint(255, fadeAlpha); // Apply transparency
    imageMode(CENTER);
    image(targetImage, width / 2, height - height * 0.2, min(width, height) * 0.3, min(width, height) * 0.3);
    pop();

    // Draw a frame around the product image circular frame
    noFill();
    stroke(255);
    strokeWeight(4);
    //center mode
    ellipse(width / 2, height - height * 0.2, min(width, height) * 0.3 + 10, min(width, height) * 0.3 + 10);
  }
  else{
    // Draw product image (item1)
    push();
    tint(255, fadeAlpha); // Apply transparency
    imageMode(CENTER);
    image(targetImage, width / 2, height - height * 0.125, min(width, height) * 0.3, min(width, height) * 0.3);
    pop();

    // Draw a frame around the product image circular frame
    noFill();
    stroke(255);
    strokeWeight(4);
    //center mode
    ellipse(width / 2, height - height * 0.125, min(width, height) * 0.3 + 10, min(width, height) * 0.3 + 10);
  }
}


function drawHUD() {
  //draw a thick frame all around the screen in form of 4 rectangles with dynamic width and height to be responsive in all screen sizes
  fill(0);
  noStroke();
  rect(0, 0, width, height * 0.05); //top rectangle
  // rect(0, 0, width * 0.05, height); //left rectangle
  // rect(width - width * 0.05, 0, width * 0.05, height); //right rectangle
  rect(0, height - height * 0.05, width, height * 0.05); //bottom rectangle

  if (targetImage && screen.width > 600) {
    //enclose the product in a solid circle to create a compartment effect
    fill(0);
    ellipse(width / 2, height - height * 0.2, min(width, height) * 0.35 + 10, min(width, height) * 0.35 + 10);
  }
  else{
    //enclose the product in a solid circle to create a compartment effect
    fill(0);
    ellipse(width / 2, height - height * 0.125, min(width, height) * 0.35 + 10, min(width, height) * 0.35 + 10);
  }


  //set text color
  fill(255);
  textFont('Comic Sans MS');
  //make text size dependent on both width and height
  textSize(max(width*0.03,height*0.03) - 10);
  if(screen.width < 600){
    textSize(2*(max(width*0.03,height*0.03) - 10));
  }
  textAlign(CENTER, CENTER);
  text(`Points: ${points}`, width * 0.2, height * 0.03);
  text(`Tries Left: ${health}`, width * 0.8, height * 0.03);
  fill(0);

  drawPauseButton();
}

function drawPauseButton() {
  if(screen.width < 600){
    buttonSize = width * 0.10;
    margin = 10;
    fill(255, 0, 0);
    stroke(255);
    strokeWeight(2);
    //top center of the screen without margin
    rect(width/2 - buttonSize/2, margin, buttonSize, buttonSize, 10);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("||", width/2, margin + buttonSize / 2);
  }
  else{
    buttonSize = width * 0.05;
    margin = 10;
    fill(255, 0, 0);
    stroke(255);
    strokeWeight(2);
    rect(width/2 - buttonSize/2 - margin, margin, buttonSize, buttonSize, 10);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("||", width/2 - margin, margin + buttonSize / 2);
  }
  
}

function drawPauseMenu() {
  fill(0, 200); // Semi-transparent background
  rect(0, 0, width, height);

  fill(255);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Game Paused", width / 2, height / 3);

  //draw the resume button and back to menu button with dynamic width and height to be responsive in all screen sizes
  fill(0, 200);
  stroke(255);
  strokeWeight(2);
  fill(255, 0, 0);
  rect(width / 2 - width * 0.1, height / 2, width * 0.2, height * 0.1, 10);
  fill(0);
  fill(0,255,0);
  rect(width / 2 - width * 0.1, height / 2 + height * 0.1, width * 0.2, height * 0.1, 10);
  noStroke();

  fill(0);
  textSize(24);
  if(screen.width < 600){
    textSize(10);
  }
  textAlign(CENTER, CENTER);
  text("Resume", width / 2, height / 2 + height * 0.05);
  text("Back to Menu", width / 2, height / 2 + height * 0.15);
}


function displayGameOver() {
  noStroke();
  fill(0, 200);
  rect(0, 0, width, height);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(64);

  if(screen.width < 600){
    textSize(24);
    text("Game Over", width / 2, height / 3);
  }
  else{
    text("Game Over", width / 2, height / 2);
  }

  textSize(24);
  if(screen.width < 600){
    textSize(16);
    text("Click anywhere to return to the main menu", width / 2, height / 2.6);
  }
  else{
    text("Click anywhere to return to the main menu", width / 2, height * 0.6);
  }
  
  //display the final score
  textSize(40);
  if(screen.width < 600){
    textSize(20);
    text(`Final Score: ${points}`, width / 2, height / 2.5 + 100);
  }
  else{
    text(`Final Score: ${points}`, width / 2, height * 0.65 + 100);
  }
  lastsessionscore = points;
  //SCORE__
  window.parent.postMessage({
    type: 'SUBMIT_SCORE',
    score: lastsessionscore
  }, '*');

  console.log(lastsessionscore);
}

function spawnBalloons() {
  // Reset balloons and standards arrays
  balloons = [];
  usedStandards = [];
  availableStandards = [...standards];

  // Add the correct standard balloon
  let correctStandard = relationships[targetProduct];
  addBalloon(correctStandard); // Add the correct balloon

  // Fill up to 4 balloons with random standards
  while (balloons.length < 4) {
    let randomStandard = pickAndRemoveStandard();
    if (!randomStandard) break; // If no standards left
    addBalloon(randomStandard);
  }
}



function addBalloon(standard) {
  let x = random(balloonSize, width - balloonSize);
  let y = random(height, height + 200);

  // Create and add the balloon to the balloons array
  balloons.push(new Balloon(x, y, standard));

  // Update used and available standards
  if (!usedStandards.includes(standard)) usedStandards.push(standard);
  let index = availableStandards.indexOf(standard);
  if (index !== -1) availableStandards.splice(index, 1);
}



let lastTargetProduct; // Track the last target product

function pickNewTarget() {
  let newTargetProduct;

  // Pick a new target product that is different from the last one
  do {
    newTargetProduct = random(products);
  } while (newTargetProduct === lastTargetProduct);

  targetProduct = newTargetProduct;
  targetImage = itemImages[targetProduct];
  lastTargetProduct = targetProduct;
  targetAvailable = true;

  fadeAlpha = 0;
  fadingIn = true;

  // Check if the correct standard balloon is already on screen
  let correctStandard = relationships[targetProduct];
  if (usedStandards.includes(correctStandard)) {
    // If the correct standard is already present, ensure total balloons = 4
    while (balloons.length < 4) {
      let randomStandard = pickAndRemoveStandard();
      if (!randomStandard) break;
      addBalloon(randomStandard);
    }
  } else {
    // Add the correct standard balloon and fill up to 4
    addBalloon(correctStandard);
    while (balloons.length < 4) {
      let randomStandard = pickAndRemoveStandard();
      if (!randomStandard) break;
      addBalloon(randomStandard);
    }
  }
}


function pickAndRemoveStandard() {
  if (availableStandards.length === 0) {
    return null;
  }
  let randomIndex = floor(random(availableStandards.length));
  return availableStandards.splice(randomIndex, 1)[0];
}



function touchStarted() {
  if (gameState === "menu") {
    gameState = "playing";
    if (!soundStarted) { // Start sound only once
      soundBackground.loop();
      soundBackground.setVolume(1);
      soundStarted = true;
      soundBackground.play();
    }
    pickNewTarget();
    spawnBalloons();
  } 
  else if (gameState === "playing") {
    // Check if pause button is clicked
    if (
      mouseX > width / 2 - buttonSize / 2 - margin &&
      mouseX < width / 2 - buttonSize / 2 - margin + buttonSize &&
      mouseY > margin &&
      mouseY < margin + buttonSize
    ) {
      gameState = "paused";
    }
    else{
      handleInput(mouseX, mouseY);
    }     
  }
  else if (gameState === "loading") {
    // Do nothing while loading
  }
  else if (gameState === "paused") {
    // Resume button logic
    if (
      mouseX > width / 2 - width * 0.1 &&
      mouseX < width / 2 - width * 0.1 + width * 0.2 &&
      mouseY > height / 2 &&
      mouseY < height / 2 + height * 0.1
    ) {
      gameState = "playing";
    }

    // Back to Menu button logic
    if (
      mouseX > width / 2 - width * 0.1 &&
      mouseX < width / 2 - width * 0.1 + width * 0.2 &&
      mouseY > height / 2 + height * 0.1 &&
      mouseY < height / 2 + height * 0.1 + height * 0.1
    ) {
      gameState = "menu";
      lastsessionscore = points;
      //SCORE__
      window.parent.postMessage({
        type: 'SUBMIT_SCORE',
        score: lastsessionscore
      }, '*');
      console.log(lastsessionscore);
      health = 4; // Reset health
      points = 0; // Reset points
      soundBackground.stop(); // Stop background music
      soundStarted = false;
    }
  }
  else if (gameState === "gameOver") {
    gameState = "menu";
    //reset score and health
    health = 4;
    points = 0;
    soundBackground.stop(); // Stop background music
    soundStarted = false;
  }
}


function mousePressed() {
  if (gameState === "menu") {
    gameState = "playing";
    if (!soundStarted) { // Start sound only once
      soundBackground.loop();
      soundBackground.setVolume(1);
      soundStarted = true;
      soundBackground.play();
    }
    pickNewTarget();
    spawnBalloons();
  } 
  else if (gameState === "playing") {
    // Check if pause button is clicked the button is in top center of the screen
    if (
      mouseX > width / 2 - buttonSize / 2 - margin &&
      mouseX < width / 2 - buttonSize / 2 - margin + buttonSize &&
      mouseY > margin &&
      mouseY < margin + buttonSize
    ) {
      gameState = "paused";
    }
    else{
      handleInput(mouseX, mouseY);
    }    
  } 
  else if (gameState === "loading") {
    // Do nothing while loading
  }
  else if (gameState === "paused") {
    // Resume button logic
    if (
      mouseX > width / 2 - width * 0.1 &&
      mouseX < width / 2 - width * 0.1 + width * 0.2 &&
      mouseY > height / 2 &&
      mouseY < height / 2 + height * 0.1
    ) {
      gameState = "playing";
    }

    // Back to Menu button logic
    if (
      mouseX > width / 2 - width * 0.1 &&
      mouseX < width / 2 - width * 0.1 + width * 0.2 &&
      mouseY > height / 2 + height * 0.1 &&
      mouseY < height / 2 + height * 0.1 + height * 0.1
    ) {
      gameState = "menu";
      lastsessionscore = points;
      //SCORE__
      window.parent.postMessage({
        type: 'SUBMIT_SCORE',
        score: lastsessionscore
      }, '*');
      console.log(lastsessionscore);
      health = 4; // Reset health
      points = 0; // Reset points
      soundBackground.stop(); // Stop background music
      soundStarted = false;
    }
  }
  else if (gameState === "gameOver") {
    gameState = "menu";
    //reset score and health
    health = 4;
    points = 0;
    soundBackground.stop(); // Stop background music
    soundStarted = false;
  }
}


function popAllBalloons() {
  // Iterate through all balloons and mark them as popped (clicked)
  for (let balloon of balloons) {
    balloon.clicked = true; // Trigger pop animation for all balloons
  }
}


function handleInput(x, y) {
  if(targetAvailable){
    let hit = false;
    let correctBalloonClicked = false;

    for (let i = balloons.length - 1; i >= 0; i--) {
      let balloon = balloons[i];
      if (dist(x, y, balloon.x, balloon.y) < clickRadius) {
        hit = true;

        // Check if the balloon clicked is the correct one
        if (relationships[targetProduct] === balloon.standard) {
          correctBalloonClicked = true;
          points += 10; // Award points for correct balloon
          soundPop.play(); // Play pop sound
        } else {
          points -= 5; // Penalize for wrong balloon
          health--;
          soundWrong.play(); // Play wrong sound
        }

        // Mark the balloon as clicked to trigger the pop animation
        balloon.clicked = true;

        // If the correct balloon was clicked, pop all balloons display Good Job and then wait 1 sec then pick new target and spawn balloons
        if (correctBalloonClicked) {
          targetAvailable = false;
          popAllBalloons();
          setTimeout(() => {
            pickNewTarget();
            spawnBalloons();
          }, 1000);
        } else {
          // If the wrong balloon was clicked, replace the popped balloon
          replaceBalloon(i);
        }

        break;
      }
    }
  }
}


class Balloon {
  constructor(x, y, standard) {
    this.x = x;
    this.y = y;
    this.standard = standard;
    this.size = balloonSize;
    this.clicked = false;
    this.popAnimationComplete = false; // To track animation completion
    this.speed = (random(0.1, 0.3) * deltaTime)/window.devicePixelRatio; // Rising speed
    //pixel density of the window
    console.log(window.devicePixelRatio);
    this.angle = 0; // For wobble effect
  }

  move() {
    if (!this.clicked) {
      this.y -= this.speed;
      this.angle += 0.05;
      this.x += sin(this.angle) * 0.5;
      if (this.y < -this.size) {
        this.y = height + this.size;
        this.x = random(balloonSize, width - balloonSize);
      }
    }
  }

  show() {
    push();
    if (this.clicked && !this.popAnimationComplete) {
      this.showPopAnimation(); // Show the pop animation if clicked
    } else {
      translate(this.x, this.y);
      noStroke();

      // Get balloon color from the image of the standard
      let img = itemImages[this.standard];
      let c = img.get(0, 0);
      fill(c);

      ellipse(0, 0, balloonSize);

      // Add tether (string)
      stroke(100);
      line(0, balloonSize / 2, 0, balloonSize);

      // Display the standard's image inside the balloon
      if (itemImages[this.standard]) {
        imageMode(CENTER);
        image(
          itemImages[this.standard],
          0,
          0,
          balloonSize * 0.7,
          balloonSize * 0.7
        );
      } else {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(balloonSize * 0.2);
        text(this.standard, 0, 0);
      }
    }
    pop();
  }

  showPopAnimation() {
    frameCounter++;
    if (frameCounter >= framesPerUpdate) {
      currentPopFrame++;
      frameCounter = 0;
  
      // Check if the pop animation is complete
      if (currentPopFrame >= totalFrames) {
        this.popAnimationComplete = true;
        currentPopFrame = 0; // Reset frame index for the next pop animation
        this.removeBalloon(); // Remove balloon after pop animation
        return; // Exit if animation is done
      }
    }
    image(popFrames[currentPopFrame], this.x, this.y, this.size, this.size);
  }
  
  removeBalloon() {
    // This will remove the balloon from the balloons array when the pop animation completes
    let balloonIndex = balloons.indexOf(this);
    if (balloonIndex !== -1) {
      balloons.splice(balloonIndex, 1); // Remove the balloon from the array
    }
  }  
}
