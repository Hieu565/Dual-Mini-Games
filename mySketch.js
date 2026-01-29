//menu setup
	let angle = 0; // for spinning shapes
	let particles = [];
	let gameState = "menu";
	let bwidth, bheight, bx, by;	//for button click
 
//paddle game variables
	//adjust for ball
		let xCord, yCord, prevYcord;
		let xSpeed = 5;
		let ySpeed = 5;

	//paddle setup
		let xPaddle, yPaddle;
		let btnSize; //button
		let pauseX, pauseY, pauseW, pauseH;		//pause button
		let backX, backY, backW, backH;				//back button

	//adjust for game start
		let gameStarted = false;
		let gameStartTime;
		let countdown = 3;
		let numarray = ["1","2","3"];

	//adjust for game pause
		let paused = false;
		//adjust for gameover
		let gameover = false;

	//attempt setting
		let lives = 1;
		let lifeLost = false;
		let lifeLostTime = 0;

	//time record
		let PlayTime = 0;
		let StartTime = 0;
		let gamePlayStartTime = 0; //address new to not biased with the count down timing (affect game duration)
		let gamePauseTime = 0;     //address new for pausing time
		let finalTime= 0;					 //death time 
//end for paddle game variables

//initial variables for dice game
	// Game Constants
	const DICE_COUNT = 3;
	const MIN_BET = 10;
	const INITIAL_BALANCE = 200;
	const MATH_REWARD_RANGE = [50, 200];
	const MAX_HISTORY = 10;
	const ROLL_DURATION = 20;
	const BACKGROUND_OPTIONS = {
		basic: { color: [0, 100, 0], price: 0, label: "Basic (Dark Green)" },
		standard: { color: [0, 0, 100], price: 1000, label: "Standard (Dark Blue)" },
		premier: { color: [184, 134, 11], price: 2000, label: "Premier (Dark Gold)" },
		firstClass: { color: [0, 0, 0], price: 10000, label: "First-class (Black)" },
	};

	const WIN_COLORS = {
		high: (0, 150, 0),
		low: (150, 0, 0)
	};

	// Game State
	let game = {
			timer: 10,
		lastTick: 0,
		autoRolling: false,
		balance: INITIAL_BALANCE,
		betAmount: 100,
		diceValues: [1, 1, 1],
		diceSum: 3,
		gameState_1: "waiting",
		betType: "high", // "high" or "high"
		result: "",
		rollCount: 0,
		history: [],
	math: {
		question: null,
		choices: [],
		correctIndex: -1,
		selectedIndex: -1,
		showQuestion: false,
		reward: 0
	},

		ui: {
			buttonActive: false,
			lastClickTime: 0
		}

	}
		game.backgroundColor = [0, 100, 0]; // default dark green
		game.ownedBackgrounds = {
		basic: true,
		standard: false,
		premier: false,
		firstClass: false
		};
//end for initial vars of dice game

function setup() {
  //initial setup
	createCanvas(windowWidth, windowHeight); 
  textAlign(CENTER, CENTER); 
  rectMode(CENTER);
	//textAlign(CENTER, CENTER);
	textFont('monospace');  // 🔑 ensures perfect column alignment
	
	//paddle
	xCord = width / 2;
	yCord = height / 2;
	prevYcord = yCord;
  StartTime = millis();
	reset();
	
	//dice
	generateMathQuestion();
	game.lastTick = millis(); // Initialize countdown timer	
	loadDiceGame()	//load and save
}

function draw() {
  // Gradient background (green → blue → black)
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);

    let c;
    if (inter < 0.5) {
      c = lerpColor(color(100, 255, 150), color(120, 220, 255), inter * 2); 
    } else {
      c = lerpColor(color(120, 220, 255), color(50, 50, 70), (inter - 0.5) * 2);
    }

    stroke(c);
    line(0, y, width, y);
  }
  
  if (gameState == "menu") {
    drawMenu();
  }	
	if(gameState == "Paddle") 
	{
			drawPaddle();
	}	
	if(gameState == "Dice")	{
			drawDiceUI();
	}
}

function drawMenu() {
  // Title
		fill(255, 200, 60);
		textSize(min(width, height) * 0.1);
		text("Choose a Game", width / 2, height / 5);

  // Button sizes (responsive)
		bwidth = min(width * 0.25, 300);		//width of buttons restricted
		bheight = min(height * 0.1, 80);			//height restricted
		bx = width / 2;   							//position of center X
		by = height / 2 								//position of center Y

  // Dice button
		let diceCol = lerpColor(color(100, 255, 100), color(30, 200, 90), 0.4); 
		fill(diceCol);
		stroke(0);
		strokeWeight(1);
		rect(width / 2, height / 2 - bheight / 2 - 15, bwidth, bheight, 15); // 15px above center
		noStroke();
		fill(255);
		textSize(bheight * 0.4);
		text("Dice", width / 2, height / 2 - bheight / 2 - 15);

	// Paddle button
		let paddleCol = lerpColor(color(120, 180, 255), color(50, 100, 180), 0.5);
		fill(paddleCol);
		stroke(0);
		strokeWeight(1);
		rect(width / 2, height / 2 + bheight / 2 + 15, bwidth, bheight, 15); // 15px below center
		noStroke();
		fill(255);
		textSize(bheight * 0.4);
		text("Paddle", width / 2, height / 2 + bheight / 2 + 15);

  // Spinning shapes
		push();		//up
		translate(width / 2, height / 2);
		rotate(angle);
		noFill();
		stroke(0, 255, 120, 120); // faint neon green
		strokeWeight(2);
		pop();
		angle += 0.01;

  // Floating particles (green sparks)
		if (particles.length < 30) {
			particles.push({ 
				x: random(width), 
				y: height + 20, 
				s: random(4, 10), 
				spd: random(0.5, 2) 
			});
		}
  noStroke();
  fill(255);
  for (let p of particles) {
    ellipse(p.x, p.y, p.s);
    p.y -= p.spd;
  }
  particles = particles.filter(p => p.y > -20);
}

//draw ball and paddle and movement rules
	function drawPaddle() 
		{
				background(100);

				//if game is started
				if (!gameStarted) 
					{
						let downtime = floor((millis() - gameStartTime) / 1000);			
						//calculate time of game started (1,2,3 SECONDS) -> Floor rounds to nearest integer
						countdown = 3 - downtime;				
						//let downtime goes range from 3,2,1

						//adjust text
							fill(255);
							textAlign(CENTER);
							textSize(64);
							text("Get Ready ...", width / 2, height / 2);

						//countdown 321
							if (countdown > 0) 
								{
									fill(255);
									text(numarray[countdown - 1], width / 2 + 275, height / 2);		
									//first element of array has index of 0 -> need first countdown =0 to show and reduce error
								}

						//ensure count to 3 seconds
							if (millis() - gameStartTime > 3000) 
								{
									gameStarted = true;
									gamePlayStartTime = millis(); // set the real start time for gameplay
									StartTime = millis(); // start playtime timer
								}
								return; //stop following codes
						}	

				//if game over
					if (gameover) 
						{
							fill(255, 0, 0);
							textSize(128);
							textAlign(CENTER);
							text("Game Over", width / 2, height * 0.35);
							
							fill(255);
							textSize(48);
							textAlign(CENTER);
							text("Your time: " + nf(finalTime, 1, 2) + " seconds", width / 2, height * 0.48);		//nf: round

							//restart button
							fill(247, 145, 27);
							stroke(255, 255, 0);
							rect(width / 2 , height * 3/5, 300, 60, 20);

							fill(255);
							textSize(42);
							text("Restart", width / 2, height * 3/5);
							
							//back home button
							fill(247, 145, 27);
							stroke(255, 255, 0);
							rect(width / 2 , height * 3/5 + 80, 300, 60, 20);

							fill(255);
							textSize(42);
							text("Back", width / 2, height * 3/5 + 80);
							return;
						}

				// Check if ball *should* have hit paddle but missed
					if (
						prevYcord <= yPaddle &&
						yCord >= yPaddle &&
						xCord >= xPaddle - 10 &&
						xCord <= xPaddle + 90 &&
						ySpeed > 0
						 ) 
						{
							console.warn("⚠️ Ball slipped through the paddle!");
						}

				if (yCord > height) 
					{
					// if this is the first frame of life loss
					if (!lifeLost) {
						lives--;
						lifeLost = true;
						lifeLostTime = millis(); // Record when life was lost
					}

					// Always show message while lifeLost is true
					if (lifeLost) 
						{
						gameover = true;
						finalTime = (millis() - gamePlayStartTime) / 1000
						return; // Pause the game during life lost message
						}
					}

				//pause button if game not paused
				if (!paused) {
					//pause button
					pauseX = width - 30; // center X
					pauseY = 30;         // center Y
					pauseW = 35;         // width
					pauseH = 35;         // height
					
					// Pause button (||)
					fill(247, 145, 27);
					stroke(255);
					rect(pauseX, pauseY, pauseW, pauseH, 5); // button box
					fill(255);
					// Pause lines (||)
					noStroke();
					let barW = pauseW * 0.2;   // each bar = 20% of button width
					let barH = pauseH * 0.6;   // each bar = 60% of button height
					let gap = pauseW * 0.3;    // space between bars

					// Left bar
					rect(pauseX - gap / 2, pauseY, barW, barH);

					// Right bar
					rect(pauseX + gap / 2, pauseY, barW, barH);
				} 
				else {
					// Pause button (▶ play icon instead of weird text)
					fill(247, 145, 27);
					stroke(255);
					rect(pauseX, pauseY, pauseW, pauseH, 5); // button box
					fill(255);
					noStroke();

					// Triangle size relative to button
					let triW = pauseW * 0.5;   // width ~50% of button
					let triH = pauseH * 0.6;   // height ~60% of button

					// Centered points
					triangle(
						pauseX - triW * 0.3, pauseY - triH / 2,  // top-left
						pauseX - triW * 0.3, pauseY + triH / 2,  // bottom-left
						pauseX + triW * 0.4, pauseY              // right tip
					);

					// Paused message
					fill(255);
					textAlign(CENTER);
					textSize(48);
					text("Game Paused", width / 2, height / 2);

					// Back button (top-left)
					backW = pauseW;                       // same size as pause
					backH = pauseH;
					backX = 30;                  // little padding from left
					backY = 30;                  // little padding from top
					
					// Back button (← arrow inside a rounded box)
					fill(247, 145, 27);
					stroke(255);
					rect(backX, backY, backW, backH, 5); // button box

					// Arrow size relative to button
					let arrowW = backW * 0.6;
					let arrowH = backH * 0.4;

					// Arrow shape centered inside button
					fill(255);
					beginShape();
					vertex(backX - arrowW * 0.5, backY);             // left tip
					vertex(backX + arrowW * 0.1, backY - arrowH * 2/3);  // top
					vertex(backX + arrowW * 0.1, backY - arrowH * 1/4);  // inner top
					vertex(backX + arrowW * 0.45, backY - arrowH * 1/4);  // far right top
					vertex(backX + arrowW * 0.45, backY + arrowH * 1/4);  // far right bottom
					vertex(backX + arrowW * 0.1, backY + arrowH * 1/4);  // inner bottom
					vertex(backX + arrowW * 0.1, backY + arrowH * 2/3);  // bottom
					endShape(CLOSE);
						return;
					}

				//ball speed and movement
				noStroke();
				fill(255);
				circle(xCord, yCord, 20);
				xCord += xSpeed;
				yCord += ySpeed;

				//wall collision
				if (xCord > width - 10) 
					{
						xSpeed = -xSpeed * 1.05;
					}
				if (xCord < 10) 
					{
						xSpeed = -xSpeed * 1.05;
					}
				if (yCord <= 10) 
					{
						ySpeed = -ySpeed * 1.05;
					}

				//paddle movement and display
				noStroke();
				xPaddle = constrain(mouseX, 40, width - 40); //ensure paddle does not leave screen with constrain (object,maxlimit,min)
				yPaddle = height - 10;

				fill(159, 176, 237);
				rect(xPaddle, yPaddle, 80, 10, 10);

				//  Ball collision with paddle using swept collision
				 let paddleHalfW = 80 / 2;
				 let paddleHalfH = 10 / 2;
			
				if (
					prevYcord <= yPaddle - paddleHalfH  &&		//top
					yCord >= yPaddle - paddleHalfH - 10 &&
					xCord >= xPaddle - paddleHalfW - 10 &&
					xCord <= xPaddle + paddleHalfW + 10  &&
					ySpeed > 0
				  ) 
						{
							yCord = yPaddle - paddleHalfH - 10; // snap to just above paddle
							ySpeed = -Math.abs(ySpeed) * 1.2;

							// Calculate hit position
							let hitPosition = (xCord - xPaddle) / paddleHalfW;
							hitPosition = constrain(hitPosition, -1, 1); // just to be safe
							xSpeed = hitPosition * 8;

 							// xSpeed = xSpeed < 0 ? -2 : 2;
							// -> Ball cannot bounce verticall because the condition limits x change to 2, not near 0

 							// Give extra push when hitting near paddle edges (0.8 to 1 or -0.8 to -1, near edge)
 							if (abs(hitPosition) > 0.8) 		///abs: absolute value to calculate (direction of ball before hit)
 								{
 									xSpeed *= 1.2;
									xSpeed += random(-0.5, 0.5);
 								}
							if (abs(xSpeed) < 2)
								{
									xSpeed = xSpeed < 0 ? -2 : 2;		//limit change of x-coordinate
									xSpeed += random(-0.5, 0.5);
								}
							
							//diagram explain
							//'PADDLE (80px wide)
							//|----|----|----|----|----|----|----|----|
							//0   10   20   30   40   50   60   70   80 (pixels)
							//|                CENTER (40px)           |
							//xPaddle = position of left edge of paddle
							//xPaddle + 40 = center of paddle
							//- Ball hits center → xSpeed = 0
							//- Ball hits far left → xSpeed = -5
							//- Ball hits far right → xSpeed = +5
						}

				// Update total play time
				if (!paused && gameStarted && !lifeLost && !gameover) 
					{
						PlayTime += millis() - StartTime;
						StartTime = millis();
					}

				// Display play time on screen
				fill(255);
				textSize(24);
				textAlign(LEFT);
				let currentTime = millis(); //show current time of gaming
				let visibleTime = (currentTime - gamePlayStartTime) / 1000;
				text("Time Played: " + nf(visibleTime, 1, 2) + "s", 10, 30);

				prevYcord = yCord;
		}

	//reset state for paddle game
		function reset() 
			{
				//reset position of ball
				xCord = width / 2;
				yCord = height / 2;
				xSpeed = 5;
				ySpeed = 5;
				//restart time of get ready
				gameStartTime = millis();
				gameStarted = false;
				countdown = 3;
				paused = false;
				//restart original state of gameover
				gameover = false;
				//restart original state of lives
				lives = 1;
				lifeLost = false;
				lifeLostTime = 0;
				//Restart timing
				PlayTime = 0;
				StartTime = millis();
				gamePlayStartTime = 0;
			}

	// Main draw loop for dice
		function drawDiceUI() {
			background(...game.backgroundColor);
		
			drawDice();
			drawBalance();
			drawHistory();
			drawResult();
			drawBetButtons();
			drawTimer();
			if (game.showMarket) drawMarket();

			if (game.gameState_1 === "rolling") handleRollingState();

			if (game.math.showQuestion) drawMathQuestion();

			// Auto show math question if balance = 0
			if (game.balance === 0 && !game.math.showQuestion) {
						game.math.showQuestion = true;
			}

			drawFeatureButton(); // Always show it
			updateTimer();
		}
//automated game functions: dice, balance, bet
	function drawBalance() {
		fill(255);
		textSize(60)
		text(`Balance: $${game.balance}`, width / 2, 50);
	}

//Update timer
	function updateTimer() {
		if (game.gameState_1 !== "waiting") return;

		let now = millis();
		if (now - game.lastTick >= 1000) {
			game.timer--;
			game.lastTick = now;

			if (game.timer <= 0) {
				game.gameState_1 = "rolling";
				game.rollCount = 0;
				game.autoRolling = true;
			}
		}
	}

//show game hisotry	
	function drawHistory() {
			textSize(24);
			fill(255);
			text("Result history:", 100, 170); // Header stays at the top

			const startX = 70;
			const startY = 200; // Start just below the title
			const lineHeight = 25;

			for (let i = 0; i < game.history.length; i++) {
				const item = game.history[i]; // Oldest first
				const y = startY + i * lineHeight; // Newer goes further down

				if (item.outcome === "win") {
					fill(0, 200, 0); // Green
				} else if (item.outcome === "lose") {
					fill(200, 0, 0); // Red
				} else {
					fill(255); // White (no bet)
				}

				textSize(16);
				text(`${item.sum} (${item.result})`, startX -15, y);
			}
		}

	//game result
		function drawResult() {
			if (game.result) {
				textSize(25)
				fill(game.result === "Win" ? color(0, 200, 0) : color(200, 0, 0));
				text(game.result, width / 2, height - 125);
			}
		}

		function checkResult() {
			const sum = game.diceSum;
			const isHigh = sum >= 11;
			const isLow = sum <= 10;

		let outcome = "no-bet";
		  if (!game.autoRolling) {
					if ((game.betType === "high" && isHigh) || (game.betType === "low" && isLow)) {
				// Determine multiplier based on current background
				let multiplier = 1; // default for basic
				if (game.backgroundColor === BACKGROUND_OPTIONS.basic.color) multiplier = 1;
				if (game.backgroundColor === BACKGROUND_OPTIONS.standard.color) multiplier = 1.5;
				if (game.backgroundColor === BACKGROUND_OPTIONS.premier.color) multiplier = 2;
				if (game.backgroundColor === BACKGROUND_OPTIONS.firstClass.color) multiplier = 3;

				// Apply multiplier to bet amount
				const winAmount = floor(game.betAmount * multiplier);
				game.balance += winAmount;
				game.result = `Win +${winAmount}đ`;
			} else {
				game.balance = max(0, game.balance - game.betAmount);
				game.result = "Lose";
			}
		}
		updateHistory(sum, isHigh ? "High" : "Low", outcome);

		if (game.autoRolling) {
			game.result = "No bet!";
		} else {
			if ((game.betType === "high" && isHigh) || (game.betType === "low" && isLow)) {
				game.balance += game.betAmount;
				game.result = "Win";
			} else {
				game.balance = max(0, game.balance - game.betAmount);
				game.result = "Lose";
			}
		}
			if (game.balance <= 0) {
				game.result = "You are out of money!";
			}

			setTimeout(() => {
				if (game.balance > 0) resetRound();
			}, 2000);
		}

		//update history
			function updateHistory(sum, result, outcome) {
				game.history.unshift({ sum, result, outcome });
				if (game.history.length > MAX_HISTORY) game.history.pop();
			}
		
		//reset round
		function resetRound() {
			game.gameState_1 = "waiting";
			game.result = "";

			// Only allow reset if there's some money to play with
			if (game.balance > 0) {
				game.timer = 20;
				game.lastTick = millis();
				game.autoRolling = false;
				game.rollCount = 0;

				// Ensure betAmount is valid
				if (game.betAmount > game.balance) {
					game.betAmount = game.balance;
				}
			} else {
				game.gameState_1 = "waiting"; // still allow answering math to recover
			}
		}

	//Dice
		function drawDice() {
			fill(255);
			textSize(32);
			text(`Sum: ${game.diceSum}`, width / 2, height/2 - 100);
			textSize(24);
			game.diceValues.forEach((value, i) => drawDie(width / 2 + (i - 1) * 120, height / 2, value));
		}

		// Rolling dice animation
		function handleRollingState() {
			if (game.rollCount < ROLL_DURATION) {
				if (frameCount % 5 === 0) {
					game.diceValues = Array(DICE_COUNT).fill().map(() => floor(random(1, 7)));
					game.diceSum = game.diceValues.reduce((a, b) => a + b, 0);
					game.rollCount++;
				}
			} else {
				game.gameState_1 = "result";
				checkResult();
			}
		}

		function drawDie(x, y, value) {
			fill(255);
			rect(x , y , 100, 100, 10);
			fill(0);
			const dotPositions = {
				1: [[0, 0]],
				2: [[-25, 25], [25, -25]],
				3: [[-25, 25], [0, 0], [25, -25]],
				4: [[-25, -25], [-25, 25], [25, -25], [25, 25]],
				5: [[-25, -25], [-25, 25], [0, 0], [25, -25], [25, 25]],
				6: [[-25, -25], [-25, 0], [-25, 25], [25, -25], [25, 0], [25, 25]]
			};
			dotPositions[value].forEach(pos => ellipse(x + pos[0], y + pos[1], 15, 15));
		}

	//Draw timer
	function drawTimer() {
		fill(255);
		textSize(25);
		text(`Next roll in: ${game.timer}s`, width / 2, 120);
	}

// 🔹 Save current game state
		function saveDiceGame() {
			let saveData = {
				balance: game.balance,
				betAmount: game.betAmount,
				backgroundColor: game.backgroundColor,
				ownedBackgrounds: game.ownedBackgrounds,
				history: game.history
			};
			storeItem("diceGameSave", saveData);
			game.result = "Game saved!";
		}

	// 🔹 Load saved game state
		function loadDiceGame() {
			let saveData = getItem("diceGameSave");
			if (saveData) {
				game.balance = saveData.balance ?? INITIAL_BALANCE;
				game.betAmount = saveData.betAmount ?? MIN_BET;
				game.backgroundColor = saveData.backgroundColor ?? [0, 100, 0];
				game.ownedBackgrounds = saveData.ownedBackgrounds ?? {basic:true,standard:false,premier:false,firstClass:false};
				game.history = saveData.history ?? [];
				game.result = "Game loaded!";
			}
		}

//all buttons
	// Button drawing helper
	function drawButton(x, y, w, h, label, bgColor, size = 24) {
		fill(bgColor);
		rect(x, y, w, h, 10);
		fill(255);
		textSize(size);
		textAlign(CENTER, CENTER);
		text(label, x , y );
	}	

	function drawFeatureButton() {
		
		//solve questions, market, home
		drawButton(125, 100, 250, 50, "Solve questions for money", color(255, 215, 0), 16);
		drawButton(125, 40, 250, 50, "Open Background Market", color(70, 70, 200), 16);
		drawButton(width - 40, 40, 70, 50, "Home", color(70, 70, 200), 16);
		drawButton(width - 40, 100, 70, 50, "Save", color(200, 100, 0), 16);
	}

	function drawBetButtons() {
		drawButton(width / 4 , height - 150, 200, 60, "High", game.betType === "high" ? WIN_COLORS.high : color(0, 100, 0));
		drawButton(3 * width / 4 , height - 150, 200, 60, "Low", game.betType === "low" ? WIN_COLORS.low : color(100, 0, 0));

		if (game.gameState_1 === "waiting") {
			let btnColor = game.balance >= game.betAmount ? color(0, 0, 150) : color(100);
			drawButton(width / 2, height - 50, 200, 60, `BET $${game.betAmount}`, btnColor);
		}

		drawButton(width / 2 - 150, height - 175, 50, 40, "-", color(100));
		drawButton(width / 2 + 150, height - 175, 50, 40, "+", color(100));
		fill(255);
		text(`$${game.betAmount}`, width / 2, height - 220);
		
		drawButton(width / 2, height - 230, 120, 40, "All-in", color(255, 165, 0), 18);
	}

function mousePressed() {
	//boundaries 
	bwidth = min(width * 0.25, 300);
  bheight = min(height * 0.1, 80);
  bx = width / 2;
  by = height / 2 
	//must recalculate in new function
	
	if (gameState == "menu") {
					// Dice button
					if (
							mouseX >= bx - bwidth / 2 &&
							mouseX <= bx + bwidth / 2 &&
							mouseY >= (by - bheight / 2 - 15) - bheight / 2 &&
							mouseY <= (by - bheight / 2 - 15) + bheight / 2
					) {
							gameState = "Dice";
							return;
					}

					// Paddle button
					if (
							mouseX >= bx - bwidth / 2 &&
							mouseX <= bx + bwidth / 2 &&
							mouseY >= (by + bheight / 2 + 15) - bheight / 2 &&
							mouseY <= (by + bheight / 2 + 15) + bheight / 2
					) {
							gameState = "Paddle";
							return;
					}
			}
	
	//within paddle game
		if(gameState == "Paddle")	{
				//pause toggle
				if (
						mouseX >= pauseX - pauseW / 2 &&
						mouseX <= pauseX + pauseW / 2 &&
						mouseY >= pauseY - pauseH / 2 &&
						mouseY <= pauseY + pauseH / 2
						) 
			{
				paused = !paused;
				if (paused) 
					{
						gamePauseTime = millis(); //store when pause started
					} 
				else 
					{
						let playTimeDuration = millis() - gamePauseTime; // Eliminate paused time
						gameStartTime += playTimeDuration; // adjust countdown start time
						gamePlayStartTime += playTimeDuration; // adjust visible time
						StartTime = millis(); // prevent playtime jump
					}
			}
				// back button toggle (when paused)
			if (paused) {
				if (
					mouseX >= backX - backW / 2 &&
					mouseX <= backX + backW / 2 &&
					mouseY >= backY - backH / 2 &&
					mouseY <= backY + backH / 2
					) {
							gameState = "menu";  // or whatever you want back to do
							reset();
						}
				}

				//reset after game over
		if (gameover) {
			if (
					mouseX >= width / 2 - 150 &&
					mouseX <= width / 2 + 150 &&
					mouseY >= height * 3/5 - 30  &&
					mouseY <= height * 3/5 + 30
				 ) 
			{
					reset();
			}
			
			if (
					mouseX >= width / 2 - 150 &&
					mouseX <= width / 2 + 150 &&
					mouseY >= height * 3/5 + 50  &&
					mouseY <= height * 3/5 + 110
				 ) 
				{
					gameState = "menu";
				}
			}
		}
	
		if(gameState=="Dice")	{
			if (millis() - game.ui.lastClickTime < 300) return;
			game.ui.lastClickTime = millis();

			// 1️⃣ Math logic first
			if (game.math.showQuestion) {
				if (HandleMathQuestions()) return;
			}

			// 2️⃣ Game click logic
			if (HandleGameClick()) return;

			// 3️⃣ Market logic
			if (HandleMarket()) return;
		}
	}

// 🎮 Handle main game clicks
		function HandleGameClick() {
			//three buttons needs fix
			// Open Background Market
			if (mouseInRect(0, 10, 250, 50)) {
				game.showMarket = !game.showMarket;
			}

			// Show math question (only if broke)
			if (mouseInRect(0, 80, 250, 50) && game.balance <= 500) {
				game.math.showQuestion = !game.math.showQuestion;
			}

			// Home button
			if (mouseInRect(width - 80, 0, 70, 50)) {
				gameState = "menu";
			}
			
			if (game.gameState_1 !== "waiting") return false;

				// Bet type
				if (mouseInRect(width / 4 - 100, height - 185, 200, 60)) {
					game.betType = "high";
					return true;
				}
			
				if (mouseInRect(3 * width / 4 - 100, height - 185, 200, 60)) {
					game.betType = "low";
					return true;
				}

				// Adjust bet
				if (mouseInRect(width / 2 - 180, height - 200, 50, 40)) {
					game.betAmount = max(1, game.betAmount - 10);
					return true;
				}
				if (mouseInRect(width / 2 + 120, height - 200, 50, 40)) {
					game.betAmount += 10;
					return true;
				}

				// Confirm roll
				if (mouseInRect(width / 2 - 100, height - 100, 200, 60) && game.balance >= game.betAmount) {
					game.gameState_1 = "rolling";
					game.rollCount = 0;
					return true;
				}

				// All-in
				if (mouseInRect(width / 2 - 120, height - 250, 240, 40)) {
					//width / 2, height - 280, 120, 40
					game.betAmount = game.balance;
					return true;
				}

				// Open market
				if (mouseInRect(125, 40, 250, 50)) {
					game.showMarket = true;
					return true;
				}

				//home button
				if (mouseInRect(width - 110, 40, 70, 50)) {
						gameState="menu"
					}
			
				//save game
				if (mouseInRect(width - 80, 60, 70, 60)) {
					saveDiceGame();
					return true;
				}
				
				return false;
			}	

// 🧮 Handle math questions
			function HandleMathQuestions() {
					// Choices
					for (let i = 0; i < game.math.choices.length; i++) {
						const x = width / 2 - 200;
						const y = height / 2 - 130 + i * 60;
						if (mouseInRect(x, y, 400, 60)) {
							game.math.selectedIndex = i;
							return true;
						}
					}

					// Confirm bet with math
					if (mouseInRect(width / 2 - 100, height - 70, 200, 60)) {
						if (game.balance >= game.betAmount) {
							game.gameState_1 = "rolling";
							game.rollCount = 0;
						} else {
							game.result = "Not enough bet!";
						}
						return true;
					}

					// Check answer
					if (mouseInRect(width / 2 - 80, height / 2 + 130, 160, 50)) {
						checkMathAnswer();
						return true;
					}

					// Cancel question
					if (mouseInRect(width / 2 - 80, height / 2 + 200, 160, 50)) {
						game.math.showQuestion = false;
						return true;
					}

					return false;		//continue in question
				}

	//math questions related
	function drawMathQuestion() {
		fill(0, 0, 0, 200);
		rect(width / 2 , height / 2, width, height);

		fill(255);
		rect(width / 2 , height / 2 , 1200, 550, 20); // Increase height from 500 to 550
		fill(0);
		textSize(20);
		text(game.math.question, width / 2, height / 2 - 160);

		game.math.choices.forEach((choice, i) => {
			const x = width / 2 ;
			const y = height / 2 - 100 + i * 60;
			const selected = i === game.math.selectedIndex;
			const bg = selected ? color(0, 150, 0) : color(200);
			drawButton(x, y, 400, 40, choice.toString(), bg, 18);
		});

		drawButton(width / 2 , height / 2 + 160, 160, 50, "Submit", color(0, 120, 200));
		drawButton(width / 2 , height / 2 + 230, 160, 50, "Close", color(200, 0, 0));

	}

	//generate questions:
		function generateMathQuestion() {
			const questions = [
				// Easy: Multiplication
				() => {
					const x = floor(random(2, 10));
					const y = floor(random(2, 10));
					const result = x * y;
					const choices = shuffle([result, result + 2, result - 1, result + 5]);
					return {
						question: `What is ${x} × ${y}?`,
						choices,
						correctIndex: choices.indexOf(result),
						reward: 100
					};
				},

				// Medium: Subtraction
				() => {
					const a = floor(random(10, 30));
					const b = floor(random(1, 10));
					const result = a - b;
					const choices = shuffle([result, result + 1, result - 2, result + 3]);
					return {
						question: `What is ${a} - ${b}?`,
						choices,
						correctIndex: choices.indexOf(result),
						reward: 150
					};
				},

				// Medium: Apples out of total
				() => {
					const apples = floor(random(5, 20));
					const oranges = floor(random(5, 20));
					const total = apples + oranges;
					const choices = shuffle([apples, oranges, total, apples + 1]);
					return {
						question: `You have ${total} fruits. If apples = ${apples}, how many oranges?`,
						choices,
						correctIndex: choices.indexOf(oranges),
						reward: 150
					};
				},

				// Medium: Percentage
				() => {
					const total = floor(random(50, 100));
					const percent = floor(random(10, 90));
					const result = floor((percent / 100) * total);
					const choices = shuffle([result, result + 1, result - 1, result + 5]);
					return {
						question: `What is ${percent}% of ${total}?`,
						choices,
						correctIndex: choices.indexOf(result),
						reward: 150
					};
				},

				// Hard: Circle area
				() => {
					const r = floor(random(5, 15));
					const result = floor(3.14 * r * r);
					const choices = shuffle([result, result - 5, result + 4, result + 8]);
					return {
						question: `Approximate area of a circle with radius ${r}? (π ≈ 3.14)`,
						choices,
						correctIndex: choices.indexOf(result),
						reward: 200
					};
				},

				// Hard: Missing number (algebra-style)
				() => {
					const x = floor(random(3, 12));
					const result = x * 2 + 5;
					const choices = shuffle([result, result + 3, result - 2, result + 7]);
					return {
						question: `If x = ${x}, what is 2x + 5?`,
						choices,
						correctIndex: choices.indexOf(result),
						reward: 200
					};
				},

				// Hard: Fraction to decimal
				() => {
					const numerators = [1, 2, 3, 3, 4];
					const denominators = [2, 4, 5, 10, 5];
					const i = floor(random(numerators.length));
					const result = +(numerators[i] / denominators[i]).toFixed(2);
					const choices = shuffle([
						result,
						+(result + 0.1).toFixed(2),
						+(result - 0.1).toFixed(2),
						+(result + 0.05).toFixed(2)
					]);
					return {
						question: `Convert ${numerators[i]}/${denominators[i]} to decimal (2 decimal places):`,
						choices,
						correctIndex: choices.indexOf(result),
						reward: 200
					};
				}
			];

			const q = random(questions)();
			game.math.question = q.question;
			game.math.choices = q.choices;
			game.math.correctIndex = q.correctIndex;
			game.math.selectedIndex = -1;
			game.math.reward = q.reward;
		}

	//check answers
		function checkMathAnswer() {
			if (game.math.selectedIndex === game.math.correctIndex) {
				game.balance += game.math.reward;
				game.result = `Correct! +${game.math.reward}đ`;

				resetRound(); // ✅ Make game responsive again
			} else {
				const correct = game.math.choices[game.math.correctIndex];
				game.result = `Wrong! Correct answer: ${correct}`;
			}

			if (game.betAmount > game.balance) {
				game.betAmount = game.balance;
			}

			game.math.showQuestion = false;
			generateMathQuestion();
		}


		// 🛒 Handle market
			function HandleMarket() {
				if (!game.showMarket) return false;

				let yStart = height / 2 - 200;
				for (let i = 0; i < Object.keys(BACKGROUND_OPTIONS).length; i++) {
					const key = Object.keys(BACKGROUND_OPTIONS)[i];
					const bg = BACKGROUND_OPTIONS[key];
					const btnX = width / 2 - 300 + 440;
					const btnY = yStart + i * 90 + 50;
					const btnW = 120;
					const btnH = 40;

					if (mouseInRect(btnX, btnY, btnW, btnH)) {
						if (game.ownedBackgrounds[key]) {
							game.backgroundColor = bg.color;
						} else {
							if (game.balance >= bg.price) {
								game.balance -= bg.price;
								game.ownedBackgrounds[key] = true;
								game.backgroundColor = bg.color;
								game.result = `Bought ${bg.label}!`;
							} else {
								game.result = "Not enough balance!";
							}
						}
						return true;
					}
				}

				// Close market
				if (mouseInRect(width / 2 - 100, height / 2 + 225, 300, 50)) {
					//width / 2, height / 2 + 250, 200, 50
					game.showMarket = false;
					return true;
				}

				return false;
			}

	//functions handle additional features (market, math questions)
			//market
			function drawMarket() {
				fill(50);
				rect(width / 2, height / 2 + 20 , width, 560, 20);	//background

				fill(255);
				textSize(32);
				text("Background Market", width / 2, height / 2 - 220);

				let yStart = height / 2 - 200;
				let i = 0;
				for (const key in BACKGROUND_OPTIONS) {
					const bg = BACKGROUND_OPTIONS[key];
					const x = width / 2 - 300;
					const y = yStart + i * 90;

					// Draw color box
					fill(...bg.color);
					rect(x - 10, y + 65, 80, 80, 10);

					// Draw label and price
					fill(255);
					textSize(20);
					text(bg.label, x + 150, y + 50);

					if (bg.price > 0) {
						textSize(16);
						fill(200);
						text(`Price: ${bg.price}đ`, x + 100, y + 80);
					} else {
						textSize(16);
						fill(200);
						text("Free (default)", x + 110, y + 80);
					}

					// Buy/Select Button
					const btnX = x + 500;
					const btnY = y + 70;
					const btnW = 120;
					const btnH = 40;

					let btnLabel = game.ownedBackgrounds[key] ? "Select" : "Buy";
					let btnColor = game.ownedBackgrounds[key] ? color(0, 150, 0) : color(0, 0, 150);

					drawButton(btnX, btnY, btnW, btnH, btnLabel, btnColor, 18);

					i++;
				}

				// Close Market button
					drawButton(width / 2, height / 2 + 250, 200, 50, "Close Market", color(200, 0, 0));
			}

	
//return position of mouse click
	function mouseInRect(x, y, w, h) {
		return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
	}

	function windowResized() {
		resizeCanvas(windowWidth, windowHeight);
	}
