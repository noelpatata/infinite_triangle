// Global variables
const canvasWidth = 400;
const canvasHeight = 400;
let counter = 0;
let currentTriangle = [
    { x: 20, y: 20 },
    { x: canvasWidth / 2, y: canvasHeight - 20 },
    { x: canvasWidth - 20, y: 20 }
];

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    background(220);
}

function draw() {
    if (counter > 4) return;

    const [v0, v1, v2] = currentTriangle;

    if (counter === 0) {
        triangle(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y);
    }

    const { x: randomX, y: randomY } = randomPointInTriangle(v0, v1, v2);

    const randomVertex = Math.floor(Math.random() * 3);
    const targetVertex = currentTriangle[randomVertex];

    const newBaseX = (targetVertex.x + randomX) / 2;
    const newBaseY = (targetVertex.y + randomY) / 2;

    const vertexPairs = [
        [1, 2],
        [0, 2],
        [0, 1],
    ];

    const [i1, i2] = vertexPairs[randomVertex];

    const oppositeVector = {
        x: currentTriangle[i2].x - currentTriangle[i1].x,
        y: currentTriangle[i2].y - currentTriangle[i1].y,
    };

    const newVertex1 = findSegmentIntersection(
        currentTriangle[i1], targetVertex,
        { x: newBaseX, y: newBaseY },
        { x: newBaseX + oppositeVector.x, y: newBaseY + oppositeVector.y }
    );

    const newVertex2 = findSegmentIntersection(
        currentTriangle[i2], targetVertex,
        { x: newBaseX, y: newBaseY },
        { x: newBaseX + oppositeVector.x, y: newBaseY + oppositeVector.y }
    );

    currentTriangle[i1] = newVertex1;
    currentTriangle[i2] = newVertex2;

    line(
        newVertex1.x, newVertex1.y,
        newVertex2.x, newVertex2.y
    );

    counter++;
}


function drawCoordinateSystem() {
    stroke(150);
    strokeWeight(1);

    line(0, 0, canvasWidth, 0);
    line(0, canvasHeight - 1, canvasWidth, canvasHeight - 1);
    line(0, 0, 0, canvasHeight);
    line(canvasWidth - 1, 0, canvasWidth - 1, canvasHeight);

    stroke(200);
    textSize(10);
    fill(100);

    for (let x = 50; x < canvasWidth; x += 50) {
        line(x, 0, x, canvasHeight);
        text(x, x + 2, 12);
    }

    for (let y = 50; y < canvasHeight; y += 50) {
        line(0, y, canvasWidth, y);
        text(y, 2, y - 2);
    }

    stroke(0);
    fill(0);
}

function randomPointInTriangle(p0, p1, p2) {
    let u = Math.random();
    let v = Math.random();
    if(u + v > 1) { u = 1 - u; v = 1 - v; }
    const x = p0.x + u * (p1.x - p0.x) + v * (p2.x - p0.x);
    const y = p0.y + u * (p1.y - p0.y) + v * (p2.y - p0.y);
    return { x, y };
}

function findSegmentIntersection(line1Start, line1End, line2Start, line2End) {
    const x1 = line1Start.x;
    const y1 = line1Start.y;
    const x2 = line1End.x;
    const y2 = line1End.y;
    const x3 = line2Start.x;
    const y3 = line2Start.y;
    const x4 = line2End.x;
    const y4 = line2End.y;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denom === 0) {
        return null;
    }

    const px = ((x1 * y2 - y1 * x2) * (x3 - x4) -
        (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const py = ((x1 * y2 - y1 * x2) * (y3 - y4) -
        (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

    return { x: px, y: py };
}


setup();
draw();