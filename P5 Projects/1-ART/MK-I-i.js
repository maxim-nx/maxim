const w = 800;
const h = 800;
let pieceSet = [];
let useMouse = true;
const speedRange = [4, 12];
let randomPos = [w/2, h/2];

function setup() {
	let window = createCanvas(w, h);
	window.parent("canvas-container");
	background(0);

	for (let i = 0; i < 3000; i++) {
		let piece = new Piece(random(width), random(height), random(speedRange[0], speedRange[1]), speedRange, random(2, 12));
        piece.prepAngles(); // Don't forget to call prepAngles
        pieceSet.push(piece);
	}
}

function draw() {
    background(0, 10);
    blendMode(BLEND);
    // clear();
	if(mouseX > 0 && mouseX < height && mouseY > 0 && mouseY < height){
		useMouse = true;
	} else{
		useMouse = false;
	}

	if(frameCount % 180 == 0){
		randomPos=[random(w), random(h)];
	}

	for (let piece of pieceSet) {
		piece.rev();
        piece.modulatePos(width, height);
		if(useMouse){
			piece.update(mouseX, mouseY);
		} else {
			piece.update(randomPos[0],randomPos[1]);
		}
	}
}
