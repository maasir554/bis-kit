let fadeAlpha = 0;
let fadingIn = true;
let fadeSpeed = 10;
let balloons = [];
let relationships = {};
let products = [];
let standards = [];
let usedStandards = [];
let availableStandards = [];
let targetProduct;
let targetAvailable = false;
let targetImage;
let itemImages = {};
let balloonSize;
let clickRadius;
let points = 0;
let health = 4;
let popSpriteSheet;
let popFrames = [];
let totalFrames = 8;
let frameWidth = 320, frameHeight = 320;
let currentPopFrame = 0;
let frameCounter = 0;
let framesPerUpdate = 10;
let sampleSize;
let soundWrong, soundPop, soundBackground;
let gameState = "loading";
let buttonSize, margin;
let soundStarted = false;
let bislogo;
let lastsessionscore = 0;
let screenShake = 0;
let floatingTexts = [];
let lastFrame;
let standardImages = {};

// Add these constants at the top with other global variables
const OVERLAP_PADDING = 2; // Increase minimum distance requirement by 50%
const MIN_BALLOON_DISTANCE = balloonSize * OVERLAP_PADDING;
const VERTICAL_SPACING = balloonSize * 2; // Ensure vertical separation between balloons
const MAX_SPAWN_ATTEMPTS = 50;

function preload() {
  gameState = "loading";
  soundWrong = loadSound('/assets/wrong.wav');
  soundPop = loadSound('/assets/pop.wav');
  soundBackground = loadSound('/assets/background.mp3');
  soundPop.setVolume(0.3);
  bislogo = loadImage('/assets/default.png');
  
  let data = loadTable("/assets/data.csv", "csv", "header", () => {
    let rowCount = data.getRowCount();
    let selectedRows = [];
    sampleSize = 20;

    while (selectedRows.length < sampleSize) {
      let randomIndex = floor(random(rowCount));
      if (!selectedRows.includes(randomIndex)) {
        selectedRows.push(randomIndex);
      }
    }

    for (let index of selectedRows) {
      let row = data.getRow(index);
      let item1 = row.getString("item1");
      let item2 = row.getString("item2");
      let path1 = row.getString("pathtoitem1");
      let standardImage = row.getString("pathtoitem2"); // Add this line to get standard image path
      //let path2 = row.getString("ballooncolor");

      //give path2 random path out of 7 paths
      let path2 = "/assets/balloon" + floor(random(1, 8)) + ".png";

      relationships[item1] = item2;
      itemImages[item1] = loadImage(path1);
      itemImages[item2] = loadImage(path2);
      standardImages[item2] = loadImage(standardImage); // Load standard image
      
      if (!products.includes(item1)) products.push(item1);
      if (!standards.includes(item2)) standards.push(item2);
    }
  });

  popSpriteSheet = loadImage('/assets/pop_spritesheet.png');
}

function assetLoaded() {
  if (isLoaded(itemImages) && popSpriteSheet && soundWrong && soundPop && soundBackground && bislogo && gameState === "loading") { 
    hideLoadingScreen();
  }
}

function hideLoadingScreen() {
  document.getElementById("p5_loading").style.display = "none";
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  balloonSize = min(width, height) * 0.3;
  clickRadius = balloonSize * 0.75;
  for (let i = 0; i < totalFrames; i++) {
    let x = i * frameWidth;
    let frame = popSpriteSheet.get(x, 0, frameWidth, frameHeight);
    popFrames.push(frame);
  }
  pickNewTarget();
  spawnBalloons();
  pixelDensity(1.5);
  frameRate(60);
  gameState = "menu";
}

function addScreenShake(intensity) {
  screenShake = intensity;
}

function showFloatingText(txt, x, y, textColor) {
  floatingTexts.push({
    text: txt,
    x: x,
    y: y,
    color: textColor,
    alpha: 255,
    life: 60
  });
}

function draw() {
  push();

  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
    screenShake *= 0.1;
    if (screenShake < 0.1) screenShake = 0;
  }

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

    floatingTexts = floatingTexts.filter(ft => {
      ft.y -= 2;
      ft.alpha -= 255 / ft.life;
      
      if (ft.alpha > 0) {
        push();
        fill(red(ft.color), green(ft.color), blue(ft.color), ft.alpha);
        textSize(24);
        textAlign(CENTER, CENTER);
        text(ft.text, ft.x, ft.y);
        pop();
        return true;
      }
      return false;
    });

    if (health <= 0) {
      gameState = "gameOver";
    }
    
    if (screen.width > 600) {
      drawCrosshair();
    }
  } 
  else if (gameState === "paused") {
    drawPauseMenu(); // This now shows a static background
  } 
  else if (gameState === "gameOver") {
    displayGameOver();
  }

  pop();
}

function drawGlowingText(txt, x, y, glowColor) {
  // Draw glow effect
  push();
  noStroke();
  fill(red(glowColor), green(glowColor), blue(glowColor), 60);
  textSize(textSize() + 2);
  text(txt, x, y);
  
  // Draw main text
  fill(glowColor);
  textSize(textSize() - 2);
  text(txt, x, y);
  pop();
}



let pulseSize = 20;
function drawCrosshair() {
  stroke(255, 0, 0);
  strokeWeight(3);
  noFill();

  pulseSize = 20 + sin(frameCount * 0.1) * 2;

  line(mouseX - 20, mouseY, mouseX + 20, mouseY);
  line(mouseX, mouseY - 20, mouseX, mouseY + 20);
  ellipse(mouseX, mouseY, pulseSize, pulseSize);
  noStroke();
  strokeWeight(1);
}


function drawMainMenu() {
  if (screen.width > 600) {
    textAlign(CENTER, CENTER);
    fill(18);
    rect(0, 0, width, height);
    fill(255);
    textSize(48);
    textFont('Comic Sans MS');
    text("Shoot'em Standards", width / 2, height / 2.5);
    textSize(24);
    fill(255);
    text("Click anywhere to start", width / 2, height / 1.5);
    imageMode(CENTER);
    image(bislogo, width * 0.1, height * 0.2);
    textSize(32);
    text("BISKit", width * 0.1, height * 0.25 + bislogo.height / 2);
  } else {
    textAlign(CENTER, CENTER);
    fill(18);
    rect(0, 0, width, height);
    fill(255);
    textSize(24);
    textFont('Comic Sans MS');
    text("Shoot'em Standards", width / 2, height / 3);
    textSize(16);
    fill(255);
    text("Click anywhere to start", width / 2, height / 1.5);
    imageMode(CENTER);
    image(bislogo, width/2, height * 0.1, width * 0.3, width * 0.3);
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
  // Create a gentle gradient sky
  let topColor = color(135, 206, 235);    // Sky blue
  let bottomColor = color(176, 226, 255);  // Lighter blue
  
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let skyColor = lerpColor(topColor, bottomColor, inter);
    stroke(skyColor);
    line(0, y, width, y);
  }
  
  drawClouds();
}

function drawClouds() {
  noStroke();
  fill(255, 250);  // Slightly transparent white
  
  // Create a few simple, clean clouds
  for (let i = 0; i < 3; i++) {
    let cloudWidth = 100; // Adjust this based on actual cloud size
    let xOffset = (frameCount * 0.2 + i * width / 3) % (width + cloudWidth);

    if (xOffset > width) {
        xOffset -= width + cloudWidth; // Wrap smoothly from left when fully out
    }

    let y = height * (0.2 + i * 0.15);
    
    // Draw each cloud as a group of overlapping circles
    push();
    translate(xOffset, y);
    
    // Main cloud body
    ellipse(0, 0, 100, 60);
    ellipse(-30, 0, 70, 50);
    ellipse(30, 0, 70, 50);
    
    pop();
  }
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
  // Create a semi-transparent header bar
  fill(0, 180);
  noStroke();
  rect(0, 0, width, height * 0.08);

  if (targetImage && screen.width > 600) {
    fill(0);
    ellipse(width / 2, height - height * 0.2, min(width, height) * 0.35 + 10, min(width, height) * 0.35 + 10);
  } else {
    fill(0);
    ellipse(width / 2, height - height * 0.125, min(width, height) * 0.35 + 10, min(width, height) * 0.35 + 10);
  }

  // Draw score and health with glow effect
  let fontSize = screen.width < 600 ? 
    2 * (max(width*0.03, height*0.03) - 10) : 
    max(width*0.03, height*0.03) - 10;
  
  textFont('Comic Sans MS');
  textAlign(CENTER, CENTER);
  textSize(fontSize);

  // Draw score with golden glow
  drawGlowingText(`Points: ${points}`, width * 0.2, height * 0.04, color(0, 255, 0));
  
  // Draw health with red glow
  drawGlowingText(`Tries Left: ${health}`, width * 0.8, height * 0.04, color(255, 0, 0));

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
  if (!lastFrame) return; // Ensure last frame is available

  image(lastFrame, 0, 0); // Draw the last captured game frame

  fill(0, 150); // Translucent overlay
  rect(0, 0, width, height);

  fill(255);
  textSize(balloonSize * 0.2);
  textAlign(CENTER, CENTER);
  text("Game Paused", width / 2, height / 3);

  fill(255, 0, 0, 180);
  stroke(255, 200);
  strokeWeight(2);
  rect(width / 2 - width * 0.1, height / 2, width * 0.2, height * 0.1, 10);

  fill(0, 255, 0, 180);
  rect(width / 2 - width * 0.1, height / 2 + height * 0.12, width * 0.2, height * 0.1, 10);
  noStroke();

  fill(0);
  textSize(balloonSize * 0.1);
  text("Resume", width / 2, height / 2 + height * 0.05);
  text("Back to Menu", width / 2, height / 2 + height * 0.17);
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

  // Create spawn zones to better distribute balloons
  const numZones = 4;
  const zoneWidth = width / numZones;
  
  // Add the correct standard balloon first in a random zone
  let correctStandard = relationships[targetProduct];
  let startZone = floor(random(numZones));
  let x = random(zoneWidth * startZone + balloonSize, zoneWidth * (startZone + 1) - balloonSize);
  let y = height + random(0, 200);
  
  addBalloonWithZoning(correctStandard, x, y);

  // Fill remaining zones with random standards
  let usedZones = [startZone];
  while (balloons.length < 4) {
    let randomStandard = pickAndRemoveStandard();
    if (!randomStandard) break;
    
    // Find an unused zone
    let zone;
    do {
      zone = floor(random(numZones));
    } while (usedZones.includes(zone));
    
    usedZones.push(zone);
    
    x = random(zoneWidth * zone + balloonSize, zoneWidth * (zone + 1) - balloonSize);
    y = height + random(0, 200);
    
    addBalloonWithZoning(randomStandard, x, y);
  }
}

function addBalloonWithZoning(standard, x, y) {
  let attempts = 0;
  let validPosition = false;
  let finalX = x, finalY = y;

  while (!validPosition && attempts < MAX_SPAWN_ATTEMPTS) {
    validPosition = true;
    
    // Check distance from all existing balloons
    for (let balloon of balloons) {
      let d = dist(finalX, finalY, balloon.x, balloon.y);
      if (d < MIN_BALLOON_DISTANCE * 1.2) { // Add extra padding during spawn
        validPosition = false;
        // Try adjusting position
        finalX = x + random(-50, 50);
        finalY = y + random(-50, 50);
        finalX = constrain(finalX, balloonSize, width - balloonSize);
        finalY = constrain(finalY, height, height + 200);
        break;
      }
    }
    attempts++;
  }

  // Create and add the balloon
  balloons.push(new Balloon(finalX, finalY, standard));
  
  // Update used and available standards
  if (!usedStandards.includes(standard)) usedStandards.push(standard);
  let index = availableStandards.indexOf(standard);
  if (index !== -1) availableStandards.splice(index, 1);
}


function addBalloonWithCollisionCheck(standard) {
  let attempts = 0;
  let validPosition = false;
  let x, y;

  while (!validPosition && attempts < MAX_SPAWN_ATTEMPTS) {
    x = random(balloonSize, width - balloonSize);
    y = random(height, height + 200);
    validPosition = isValidBalloonPosition(x, y);
    attempts++;
  }

  // If we couldn't find a valid position, try with a smaller minimum distance
  if (!validPosition) {
    x = random(balloonSize, width - balloonSize);
    y = random(height, height + 200);
  }

  // Create and add the balloon
  balloons.push(new Balloon(x, y, standard));

  // Update used and available standards
  if (!usedStandards.includes(standard)) usedStandards.push(standard);
  let index = availableStandards.indexOf(standard);
  if (index !== -1) availableStandards.splice(index, 1);
}

function isValidBalloonPosition(x, y) {
  for (let balloon of balloons) {
    let d = dist(x, y, balloon.x, balloon.y);
    if (d < MIN_BALLOON_DISTANCE) {
      return false;
    }
  }
  return true;
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
    floatingTexts = []; // Clear floating texts when starting game
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
    if (screen.width < 600) {
      if (
        mouseX > width/2 - buttonSize/2 &&
        mouseX < width/2 - buttonSize/2 + buttonSize &&
        mouseY > margin &&
        mouseY < margin + buttonSize
      ) {
        lastFrame = get(); // Capture screen before pausing
        gameState = "paused";
        floatingTexts = []; // Clear floating texts when pausing
      }
      else {
        handleInput(mouseX, mouseY);
      }
    } else {
      if (
        mouseX > width/2 - buttonSize/2 - margin &&
        mouseX < width/2 - buttonSize/2 - margin + buttonSize &&
        mouseY > margin &&
        mouseY < margin + buttonSize
      ) {
        lastFrame = get(); // Capture screen before pausing
        gameState = "paused";
        floatingTexts = []; // Clear floating texts when pausing
      }
      else {
        handleInput(mouseX, mouseY);
      }
    }
  }
  else if (gameState === "loading") {
    // Do nothing while loading
  }
  else if (gameState === "paused") {
    // Resume button logic
    if (
      mouseX > width/2 - width * 0.1 &&
      mouseX < width/2 - width * 0.1 + width * 0.2 &&
      mouseY > height/2 &&
      mouseY < height/2 + height * 0.1
    ) {
      gameState = "playing";
      floatingTexts = []; // Clear floating texts when resuming
    }

    // Back to Menu button logic
    if (
      mouseX > width/2 - width * 0.1 &&
      mouseX < width/2 - width * 0.1 + width * 0.2 &&
      mouseY > height/2 + height * 0.1 &&
      mouseY < height/2 + height * 0.1 + height * 0.1
    ) {
      gameState = "menu";
      floatingTexts = []; // Clear floating texts when returning to menu
      lastsessionscore = points;
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
    floatingTexts = []; // Clear floating texts when game over
    health = 4;
    points = 0;
    soundBackground.stop(); // Stop background music
    soundStarted = false;
  }
}

function mousePressed() {
  if (gameState === "menu") {
    gameState = "playing";
    floatingTexts = []; // Clear floating texts when starting game
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
    if (screen.width < 600) {
      if (
        mouseX > width/2 - buttonSize/2 &&
        mouseX < width/2 - buttonSize/2 + buttonSize &&
        mouseY > margin &&
        mouseY < margin + buttonSize
      ) {
        lastFrame = get(); // Capture screen before pausing
        gameState = "paused";
        floatingTexts = []; // Clear floating texts when pausing
      }
      else {
        handleInput(mouseX, mouseY);
      }
    } else {
      if (
        mouseX > width/2 - buttonSize/2 - margin &&
        mouseX < width/2 - buttonSize/2 - margin + buttonSize &&
        mouseY > margin &&
        mouseY < margin + buttonSize
      ) {
        lastFrame = get(); // Capture screen before pausing
        gameState = "paused";
        floatingTexts = []; // Clear floating texts when pausing
      }
      else {
        handleInput(mouseX, mouseY);
      }
    }
  } 
  else if (gameState === "loading") {
    // Do nothing while loading
  }
  else if (gameState === "paused") {
    // Resume button logic
    if (
      mouseX > width/2 - width * 0.1 &&
      mouseX < width/2 - width * 0.1 + width * 0.2 &&
      mouseY > height/2 &&
      mouseY < height/2 + height * 0.1
    ) {
      gameState = "playing";
      floatingTexts = []; // Clear floating texts when resuming
    }

    // Back to Menu button logic
    if (
      mouseX > width/2 - width * 0.1 &&
      mouseX < width/2 - width * 0.1 + width * 0.2 &&
      mouseY > height/2 + height * 0.1 &&
      mouseY < height/2 + height * 0.1 + height * 0.1
    ) {
      gameState = "menu";
      floatingTexts = []; // Clear floating texts when returning to menu
      lastsessionscore = points;
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
    floatingTexts = []; // Clear floating texts when game over
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
  if(targetAvailable) {
    let hit = false;
    let correctBalloonClicked = false;

    for (let i = balloons.length - 1; i >= 0; i--) {
      let balloon = balloons[i];
      if (dist(x, y, balloon.x, balloon.y) < clickRadius) {
        hit = true;

        if (relationships[targetProduct] === balloon.standard) {
          correctBalloonClicked = true;
          points += 10;
          soundPop.play();
          showFloatingText("+10", x, y, color(0, 255, 0));
        } else {
          points -= 5;
          health--;
          soundWrong.play();
          showFloatingText("-5", x, y, color(255, 0, 0));
          addScreenShake(10);
        }

        balloon.clicked = true;

        if (correctBalloonClicked) {
          targetAvailable = false;
          popAllBalloons();
          setTimeout(() => {
            pickNewTarget();
            spawnBalloons();
          }, 1000);
        } else {
          replaceBalloon(i);
        }

        break;
      }
    }
  }
}

// Add this helper function above the Balloon class
function wrapText(text, maxWidth, textSize) {
  //textSize(textSize);
  let words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let word of words) {
    let testLine = currentLine ? currentLine + ' ' + word : word;
    let testWidth = textWidth(testLine);
    if (testWidth > maxWidth) {
      if (currentLine === '') {
        lines.push(word);
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine !== '') {
    lines.push(currentLine);
  }
  return lines;
}

// Add this function to find product name from standard
function getProductForStandard(standard) {
  for (let product in relationships) {
    if (relationships[product] === standard) {
      return product;
    }
  }
  return "Unknown Product";
}


class Balloon {
  constructor(x, y, standard) {
    this.x = x;
    this.y = y;
    this.standard = standard;
    this.size = balloonSize;
    this.clicked = false;
    this.popAnimationComplete = false;
    this.speed = (random(0.1, 0.3) * deltaTime)/window.devicePixelRatio;
    this.angle = random(TWO_PI);
    this.angleSpeed = random(0.01, 0.02);
    this.horizontalRange = random(10, 20);
    this.particles = null;
    this.lastValidX = x;
    this.lastValidY = y;
    this.stuckFrames = 0;
    this.emergencyRepositionTimer = 0;
  }

  move() {
    if (!this.clicked) {
      let newY = this.y - this.speed;
      let newX = this.x + sin(this.angle) * this.horizontalRange * 0.01;
      
      // Check for collisions at new position
      let collision = false;
      for (let other of balloons) {
        if (other !== this) {
          let d = dist(newX, newY, other.x, other.y);
          if (d < MIN_BALLOON_DISTANCE) {
            collision = true;
            break;
          }
        }
      }

      if (!collision) {
        // Position is safe, update coordinates
        this.x = newX;
        this.y = newY;
        this.lastValidX = newX;
        this.lastValidY = newY;
        this.stuckFrames = 0;
      } else {
        this.stuckFrames++;
        
        if (this.stuckFrames > 30) { // If stuck for too long
          // Try emergency repositioning
          let emergencyX = this.x;
          let emergencyY = this.y;
          let found = false;
          
          // Try different positions in increasing radius
          for (let radius = MIN_BALLOON_DISTANCE; radius < MIN_BALLOON_DISTANCE * 3 && !found; radius += 20) {
            for (let angle = 0; angle < TWO_PI; angle += PI/4) {
              let testX = this.x + cos(angle) * radius;
              let testY = this.y + sin(angle) * radius;
              
              // Check if position is valid
              let valid = true;
              for (let other of balloons) {
                if (other !== this && dist(testX, testY, other.x, other.y) < MIN_BALLOON_DISTANCE) {
                  valid = false;
                  break;
                }
              }
              
              if (valid) {
                emergencyX = testX;
                emergencyY = testY;
                found = true;
                break;
              }
            }
          }
          
          // Update position and reset stuck counter
          this.x = constrain(emergencyX, balloonSize, width - balloonSize);
          this.y = emergencyY;
          this.stuckFrames = 0;
          this.angle = random(TWO_PI); // Reset movement angle
        } else {
          // Try to move away from nearest balloon
          let nearestBalloon = null;
          let minDist = Infinity;
          
          for (let other of balloons) {
            if (other !== this) {
              let d = dist(this.x, this.y, other.x, other.y);
              if (d < minDist) {
                minDist = d;
                nearestBalloon = other;
              }
            }
          }
          
          if (nearestBalloon) {
            let angle = atan2(this.y - nearestBalloon.y, this.x - nearestBalloon.x);
            this.x += cos(angle) * 2;
            this.y += sin(angle) * 2;
            this.x = constrain(this.x, balloonSize, width - balloonSize);
          }
        }
      }

      // Reset position if balloon goes off screen
      if (this.y < -this.size) {
        let attempts = 0;
        let validRespawn = false;
        
        while (!validRespawn && attempts < MAX_SPAWN_ATTEMPTS) {
          let respawnX = random(this.size, width - this.size);
          let respawnY = height + this.size;
          
          validRespawn = true;
          for (let other of balloons) {
            if (other !== this && dist(respawnX, respawnY, other.x, other.y) < MIN_BALLOON_DISTANCE) {
              validRespawn = false;
              break;
            }
          }
          
          if (validRespawn) {
            this.x = respawnX;
            this.y = respawnY;
            this.lastValidX = respawnX;
            this.lastValidY = respawnY;
            this.angle = random(TWO_PI);
            this.stuckFrames = 0;
            break;
          }
          attempts++;
        }
        
        if (!validRespawn) {
          this.y = height + this.size * 3; // Push it further down to try again next frame
        }
      }
    }
  }

  show() {
    if (!this.clicked) {
      imageMode(CENTER);
      image(itemImages[this.standard], this.x, this.y - this.size/4, this.size, this.size*1.2);
    
      // if (standardImages[this.standard]) {
      //   image(standardImages[this.standard], this.x, this.y + this.size/1.2, this.size, this.size);
      // }
    
      // Get product name and standard text
      const productName = getProductForStandard(this.standard);
      const standardText = this.standard;
      const combinedText = `${productName}\n${standardText}`;
    
      // Text styling
      fill(0);
      stroke(0);
      strokeWeight(0.2);
      textAlign(CENTER, CENTER);
      
      // Calculate text dimensions
      const maxWidth = this.size * 0.8;
      let fontSize = this.size * 0.1;
      let lines = [];
      
      // Adjust font size to fit
      while (fontSize > 8) {
        textSize(fontSize);
        lines = wrapText(combinedText, maxWidth, fontSize);
        const lineHeight = textAscent() + textDescent();
        const totalHeight = lines.length * lineHeight;
        
        if (totalHeight < this.size * 0.4) break;
        fontSize -= 1;
      }
    
      // Calculate vertical position
      const lineHeight = textAscent() + textDescent();
      const startY = this.y - this.size/2.5 - (lines.length * lineHeight)/2;
    
      // Draw each line
      lines.forEach((line, index) => {
        text(line, this.x, startY + index * lineHeight*1.5);
      });
    } else {
      this.showPopAnimation();
    }
  }

  showPopAnimation() {
    // Initialize particles on first pop frame
    if (!this.particles) {
      this.particles = Array(15).fill().map(() => ({
        x: this.x,
        y: this.y,
        vx: random(-5, 5),
        vy: random(-5, 5),
        alpha: 255
      }));
    }
    
    // Draw particles
    noStroke();
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 5;
      
      if (p.alpha > 0) {
        fill(255, p.alpha);
        ellipse(p.x, p.y, 5, 5);
      }
    }
    
    frameCounter++;
    if (frameCounter >= framesPerUpdate) {
      currentPopFrame++;
      frameCounter = 0;
      
      if (currentPopFrame >= totalFrames) {
        this.popAnimationComplete = true;
        currentPopFrame = 0;
        this.removeBalloon();
        return;
      }
    }
    image(popFrames[currentPopFrame], this.x, this.y, this.size/1.5, this.size/1.5);
  }

  removeBalloon() {
    let balloonIndex = balloons.indexOf(this);
    if (balloonIndex !== -1) {
      balloons.splice(balloonIndex, 1);
    }
  }
}
