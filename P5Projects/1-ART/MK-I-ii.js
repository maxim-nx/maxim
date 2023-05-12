const w = 700;
const h = 700;
let pieceSet = [];
let useMouse = true;
const speedRange = [3, 14];
let idlePos;
let idleNoise = 0;
const canvasWindowRatio = 0.9;

function setup() {
	let canvasSize = getCanvasSize(canvasWindowRatio);
	let window = createCanvas(canvasSize.w, canvasSize.h);
	window.parent("canvas-container");
	background(0);
	idlePos = createVector(0, 0);

	for (let i = 0; i < 2000; i++) {
		let piece = new Piece(
			random(width),
			random(height),
			random(speedRange[0], speedRange[1]),
			speedRange,
			random(2, 12)
		);
		piece.prepAngles(); // Don't forget to call prepAngles
		pieceSet.push(piece);
	}
}

function getCanvasSize(r) {
	if (windowWidth > windowHeight) {
		// Landscape
		return {
			w: r * windowHeight,
			h: r * windowHeight,
		};
	} else {
		// Portrait
		return {
			w: r * windowWidth,
			h: r * windowWidth,
		};
	}
}

function windowResized() {
	let canvasSize = getCanvasSize(canvasWindowRatio);
	resizeCanvas(canvasSize.w, canvasSize.h);
	background(0);
}

function draw() {
	background(0, 10);
	// blendMode(BLEND);
	// clear();
	if (mouseX > 0 && mouseX < height && mouseY > 0 && mouseY < height) {
		useMouse = true;
	} else {
		useMouse = false;
	}

	idlePos.x = width * noise(idleNoise);
	idlePos.y = width * noise(idleNoise, 100);
	idleNoise += random(-0.03, 0.05);
	// Ideas here: Revert the idle noise positions to original (Radom within 2*d-d for h and w)
	//             Retain elegance and remove random noise step
	//             Keep erratic
	// Make a button to toggle each of these.

	for (let piece of pieceSet) {
		piece.rev();
		piece.modulatePos(width, height);
		if (useMouse) {
			piece.update(mouseX, mouseY);
		} else {
			piece.update(idlePos.x, idlePos.y);
		}
	}
}
