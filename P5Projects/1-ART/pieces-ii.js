class Piece {
	constructor(x, y, s, sRange, d) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, s);
		this.framesToUpd8 = 1;
		this.atDest = false;
		this.destRange = 1;
		this.availableAngles = [-45, 45, -135, 135];
		this.pathDecay = d;
		this.xyAngles = [[], [], [], []]; // +x, -x, +y, -y
		this.pPos = createVector(x, y);
		this.color = map(s, sRange[0], sRange[1], 0, 255);
		this.transparency = map(s, sRange[0], sRange[1], 120, 255);
	}

	prepAngles() {
		for (let a of this.availableAngles) {
			let angle = a;
			const toRad = radians(angle);
			if (cos(toRad) > 0) {
				this.xyAngles[0].push(toRad);
			} else {
				this.xyAngles[1].push(toRad);
			}

			if (sin(toRad) > 0) {
				this.xyAngles[2].push(toRad);
			} else {
				this.xyAngles[3].push(toRad);
			}
		}
	}

	modulatePos(xMax, yMax) {
		this.pos.x = (this.pos.x + xMax) % xMax; //Had to add maxes to prevent negative modulo behaviour!
		this.pos.y = (this.pos.y + yMax) % yMax;
	}

	near(i, d, t) {
		// if input i is within t of d, returns true.
		return abs(d - i) <= t ? true : false;
	}

	rev() {
		strokeWeight(1);
		stroke(120, 0, this.color, this.transparency);
		// point(this.pos.x, this.pos.y);
		line(this.pPos.x, this.pPos.y, this.pos.x, this.pos.y);
	}

	update(dX, dY) {
		const destVector = createVector(dX, dY);
		if (this.pos.dist(destVector) <= this.destRange) {
			this.atDest = true;
		} else {
			if (this.atDest) {
				// Piece just got freed
				this.framesToUpd8 = 10;
			}
			this.atDest = false;
		}
		if (!this.atDest) {
			this.pPos.x = this.pos.x;
			this.pPos.y = this.pos.y;
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
			this.framesToUpd8--;
			if (this.framesToUpd8 < 0) {
				this.setCourse(dX, dY);
			}
		}
	}

	newAngle(index, current, d3) {
		let newAngle = current;
		const usableLength = this.xyAngles[index].length;
		while (this.near(newAngle, current, 0.05) || this.near(newAngle, current + PI, 0.05)) {
			//Keep choosing new angles until not at same or 180 flip
			newAngle = this.xyAngles[index][floor(random(0, usableLength))];
		}
		this.vel.setHeading(newAngle);
		if (index < 2) {
			this.framesToUpd8 = floor(d3 / (cos(newAngle) * this.vel.mag()));
		} else {
			this.framesToUpd8 = floor(d3 / (sin(newAngle) * this.vel.mag()));
		}
		this.framesToUpd8 %= 60;
	}

	setCourse(destX, destY) {
		const lX = destX - this.pos.x;
		const lY = destY - this.pos.y;
		const tXfY = abs(lX) > abs(lY) ? true : false;
		const currAngle = this.vel.heading();
		// X is the larger dimension
		if (tXfY) {
			const d3 = lX / this.pathDecay;

			// X dim is +
			if (lX > 0) {
				this.newAngle(0, currAngle, d3);
			} else {
				// Y dim is -
				this.newAngle(1, currAngle, d3);
			}
		} else {
			// Y is the larger
			const d3 = lY / this.pathDecay;
			// Y dim is +
			if (lY > 0) {
				this.newAngle(2, currAngle, d3);
			} else {
				// Y dim is -
				this.newAngle(3, currAngle, d3);
			}
		}
	}
}
