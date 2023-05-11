class Piece {
	constructor(x, y, s, d) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, s);
		this.framesToUpd8 = 1;
		this.atDest = false;
		this.destRange = 20;
		this.availableAngles = [60, 120, 180, 240, 300, 360];
		this.pathDecay = d;
		this.xyAngles = [[], [], [], []]; // +x, -x, +y, -y
	}

	prepAngles() {
		for (let i = 0; i < this.availableAngles.length; i++) {
			let angle = this.availableAngles[i]+45;
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
		strokeWeight(5);
		stroke(120, 0, 0, 120);
		point(this.pos.x, this.pos.y);
	}

	update(dX, dY) {
		if (dist(this.pos.x, this.pos.y, dX, dY) <= this.destRange) {
            this.atDest = true;
          } else {
            if (this.atDest) { // Piece just got freed
                this.framesToUpd8 = 10;
              }
            this.atDest = false;
          }
		if (!this.atDest) {
			this.pos.x += this.vel.x;
			this.pos.y += this.vel.y;
			this.framesToUpd8--;
			if (this.framesToUpd8 < 0) {
				this.setCourse(dX, dY);
			}
		}
	}

	setCourse(destX, destY) {
		const lX = destX - this.pos.x;
		const lY = destY - this.pos.y;
		const tXfY = abs(lX) > abs(lY) ? true : false;
		let newAngle = this.vel.heading();
		const currAngle = this.vel.heading();

		// X is the larger dimension
		if (tXfY) {
			const d3 = lX / this.pathDecay;

			// X dim is +
			if (lX > 0) {
				while (this.near(newAngle, currAngle, 0.05) || this.near(newAngle, currAngle + PI, 0.05)) {
					//Keep choosing new angles until not at same or 180 flip
					newAngle = this.xyAngles[0][floor(random(0, this.xyAngles[0].length))];
				}
				this.vel.setHeading(newAngle);
				this.framesToUpd8 = floor(d3 / (cos(newAngle) * this.vel.mag()));
			} else {
				while (this.near(newAngle, currAngle, 0.05) || this.near(newAngle, currAngle + PI, 0.05)) {
					//Keep choosing new angles until not at same or 180 flip
					newAngle = this.xyAngles[1][floor(random(0, this.xyAngles[1].length))];
				}
				this.vel.setHeading(newAngle);
				this.framesToUpd8 = floor(d3 / (cos(newAngle) * this.vel.mag()));
			}
		} else {
			const d3 = lY / this.pathDecay;

			if (lY > 0) {
				while (this.near(newAngle, currAngle, 0.05) || this.near(newAngle, currAngle + PI, 0.05)) {
					//Keep choosing new angles until not at same or 180 flip
					newAngle = this.xyAngles[2][floor(random(0, this.xyAngles[2].length))];
				}
				this.vel.setHeading(newAngle);
				this.framesToUpd8 = floor(d3 / (sin(newAngle) * this.vel.mag()));
			} else {
				while (this.near(newAngle, currAngle, 0.05) || this.near(newAngle, currAngle + PI, 0.05)) {
					//Keep choosing new angles until not at same or 180 flip
					newAngle = this.xyAngles[3][floor(random(0, this.xyAngles[3].length))];
				}
				this.vel.setHeading(newAngle);
				this.framesToUpd8 = floor(d3 / (sin(newAngle) * this.vel.mag()));
			}
		}
	}
}
