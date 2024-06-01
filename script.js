const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 600;

const voSlider = document.getElementById('vo');
const gSlider = document.getElementById('g');
const angleSlider = document.getElementById('angle');
const speedSlider = document.getElementById('speed');
const voInput = document.getElementById('voInput');
const gInput = document.getElementById('gInput');
const angleInput = document.getElementById('angleInput');
const speedInput = document.getElementById('speedInput');
const y0Slider = document.getElementById('y0');
const y0Input = document.getElementById('y0Input');

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear');

let vo = Number(voSlider.value);
let g = Number(gSlider.value);
let angle = Number(angleSlider.value) * (Math.PI / 180);
let speed = Number(speedSlider.value);
let y0 = Number(y0Slider.value);

let simulator = new Simulator(vo, angle, g, y0);
let isRunning = false;
let intervalId = null;

function updateSimulationParams() {
    vo = Number(voSlider.value);
    voInput.value = vo;

    y0 = Number(y0Slider.value);
    y0Input.value = y0;

    g = Number(gSlider.value);
    gInput.value = g;

    angle = Number(angleSlider.value) * (Math.PI / 180);
    angleInput.value = angleSlider.value;

    resetSimulation();
}

function resetSimulation() {
    isRunning = false;
    clearInterval(intervalId);
    simulator.reset({ vo: vo, angle: angle, g: g, y0: y0 });
    clearCanvas();
    drawAxes();
    drawInitialProjectile();
    startButton.textContent = "Iniciar Trajetória";
}

function updateInitialProjectilePosition() {
    clearCanvas();
    drawAxes();
    drawInitialProjectile();
    drawTrail();
}

voSlider.oninput = updateSimulationParams;
voInput.oninput = updateSimulationParams;

gSlider.oninput = updateSimulationParams;
gInput.oninput = updateSimulationParams;

angleSlider.oninput = updateSimulationParams;
angleInput.oninput = updateSimulationParams;

speedSlider.oninput = () => {
    speed = Number(speedSlider.value);
    speedInput.value = speed;
};

speedInput.oninput = () => {
    speed = Number(speedInput.value);
    speedSlider.value = speed;
};

y0Slider.oninput = () => {
    y0 = Number(y0Slider.value);
    y0Input.value = y0;
    simulator.updateInitialPosition(y0);
    updateInitialProjectilePosition();
};

y0Input.oninput = () => {
    y0 = Number(y0Input.value);
    y0Slider.value = y0;
    simulator.updateInitialPosition(y0);
    updateInitialProjectilePosition();
};

startButton.onclick = () => {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(updateSimulation, 1000 / speed);
        startButton.textContent = "Pausar";
        window.scrollBy(0, 500);
    } else {
        isRunning = false;
        clearInterval(intervalId);
        startButton.textContent = "Iniciar Trajetória";
    }
};

resetButton.onclick = resetSimulation;
clearButton.onclick = clearTrail;

function updateSimulation() {
    simulator.update(0.1);

    if (simulator.isGrounded()) {
        isRunning = false;
        clearInterval(intervalId);
    } else {
        clearCanvas();
        drawAxes();
        drawTrail();
        drawProjectile();
    }
}

function clearTrail() {
    simulator.positions = [];
    clearCanvas();
    drawAxes();
    drawInitialProjectile();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawAxes() {
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 20); // Eixo X
    ctx.lineTo(canvas.width, canvas.height - 20);
    ctx.moveTo(20, canvas.height - 20); // Eixo Y
    ctx.lineTo(20, 0);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText("X", canvas.width - 10, canvas.height - 25);
    ctx.fillText("Y", 5, 10);
    ctx.fillText("0", 5, canvas.height - 5);
}

function drawTrail() {
    const positions = simulator.getPositions();
    ctx.beginPath();
    ctx.moveTo(positions[0].x + 20, canvas.height - 20 - positions[0].y);
    for (const pos of positions) {
        ctx.lineTo(pos.x + 20, canvas.height - 20 - pos.y);
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function drawProjectile() {
    const pos = simulator.positions[simulator.positions.length - 1];
    const screenX = pos.x + 20;
    const screenY = canvas.height - 20 - pos.y;

    ctx.beginPath();
    ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    drawInfo(screenX, screenY);
}

function drawInitialProjectile() {
    const initialX = 20;
    const initialY = canvas.height - 20 - y0;

    ctx.beginPath();
    ctx.arc(initialX, initialY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    drawInfo(initialX, initialY);
}

function drawInfo(screenX, screenY) {
    ctx.fillStyle = 'black'; // Define a cor do texto como branco
    ctx.font = '14px Arial'; // Define o tamanho e a fonte do texto

    // Define a posição horizontal inicial
    let xPosition = 30;

    // Define a posição vertical inicial
    const yPosition = 50;

    // Desenha os valores com uma distância específica entre eles
    ctx.fillText(`Tempo: ${simulator.time.toFixed(2)}s`, xPosition, yPosition);
    xPosition += ctx.measureText(`Tempo: ${simulator.time.toFixed(2)}s`).width + 20;

    ctx.fillText(`Posição X: ${(screenX - 20).toFixed(2)}m`, xPosition, yPosition);
    xPosition += ctx.measureText(`Posição X: ${(screenX - 20).toFixed(2)}m`).width + 20;

    ctx.fillText(`Posição Y: ${(canvas.height - 20 - screenY).toFixed(2)}m`, xPosition, yPosition);
    xPosition += ctx.measureText(`Posição Y: ${(canvas.height - 20 - screenY).toFixed(2)}m`).width + 20;

    ctx.fillText(`Velocidade X: ${simulator.vx.toFixed(2)}m/s`, xPosition, yPosition);
    xPosition += ctx.measureText(`Velocidade X: ${simulator.vx.toFixed(2)}m/s`).width + 20;

    ctx.fillText(`Velocidade Y: ${(simulator.vy - simulator.g * simulator.time).toFixed(2)}m/s`, xPosition, yPosition);
}

clearCanvas();
drawAxes();
drawInitialProjectile();