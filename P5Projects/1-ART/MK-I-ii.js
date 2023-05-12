const w = 700;
const h = 700;
let pieceSet = [];
let useMouse = true;
const speedRange = [4, 12];
let idlePos;
let idleNoise = 0;

function setup() {
	let window = createCanvas(w, h);
	window.parent("canvas-container");
	background(0);
    idlePos = createVector(0,0);

	for (let i = 0; i < 2000; i++) {
		let piece = new Piece(random(width), random(height), random(speedRange[0], speedRange[1]), speedRange, random(2, 12));
        piece.prepAngles(); // Don't forget to call prepAngles
        pieceSet.push(piece);
	}
}

function draw() {
    background(0, 10);
    // blendMode(BLEND);
    // clear();
	if(mouseX > 0 && mouseX < height && mouseY > 0 && mouseY < height){
		useMouse = true;
	} else{
		useMouse = false;
	}

    idlePos.x = width*noise(idleNoise);
    idlePos.y = width*noise(idleNoise, 100);
    idleNoise+= 0.03;

	for (let piece of pieceSet) {
		piece.rev();
        piece.modulatePos(width, height);
		if(useMouse){
			piece.update(mouseX, mouseY);
		} else {
			piece.update(idlePos.x, idlePos.y);
		}
	}
}
