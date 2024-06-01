class Simulator {
    constructor(vo, angle, g, y0) {
        this.vo = vo;
        this.angle = angle;
        this.g = g;
        this.y0 = y0;
        this.reset();
    }

    reset(params) {
        if (params) {
            this.vo = params.vo;
            this.angle = params.angle;
            this.g = params.g;
            this.y0 = params.y0;
        }
        this.time = 0;
        this.x = 0;
        this.y = this.y0;
        this.vx = this.vo * Math.cos(this.angle);
        this.vy = this.vo * Math.sin(this.angle);
        this.positions = [];
        this.positions.push({ x: this.x, y: this.y });
    }

    updateInitialPosition(newY0) {
        this.y0 = newY0;
        this.y = this.y0;
        this.positions[0] = { x: this.x, y: this.y }; // Atualiza a posição inicial
    }

    update(dt) {
        this.time += dt;
        this.x = this.vx * this.time;
        this.y = this.y0 + (this.vy * this.time) - (0.5 * this.g * Math.pow(this.time, 2));
        if (this.y < 0) {
            this.y = 0;
        }
        this.positions.push({ x: this.x, y: this.y });
    }

    getPositions() {
        return this.positions;
    }

    isGrounded() {
        return this.y === 0 && this.time > 0;
    }
}
