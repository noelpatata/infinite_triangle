// Global variables
const canvasWidth = 400;
const canvasHeight = 400;
let counter = 0;

//holds the coordinates of the triangle's vertices
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
        triangle(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y); //draw triangle
    }

    const { x: randomX, y: randomY } = randomPointInTriangle(v0, v1, v2); // random point in triangle

    const randomVertex = Math.floor(Math.random() * 3);
    const targetVertex = currentTriangle[randomVertex];

    const newBaseX = (targetVertex.x + randomX) / 2;
    const newBaseY = (targetVertex.y + randomY) / 2;

    // depending on the current vertex, define the neighboring vertices
    const vertexPairs = [
        [1, 2],
        [0, 2],
        [0, 1],
    ];

    const [i1, i2] = vertexPairs[randomVertex];

    //vector from one vertex to another
    const oppositeVector = {
        x: currentTriangle[i2].x - currentTriangle[i1].x,
        y: currentTriangle[i2].y - currentTriangle[i1].y,
    };

    const newVertex1 = findSegmentIntersection(
        currentTriangle[i1],
        targetVertex,
        { x: newBaseX, y: newBaseY }, // random point inside the triangle
        { x: newBaseX + oppositeVector.x, y: newBaseY + oppositeVector.y } // sums the opposite vector to the
        // random point inside the triangle to create a line parallel to the opposite side of the triangle
    );

    const newVertex2 = findSegmentIntersection(
        currentTriangle[i2],
        targetVertex,
        { x: newBaseX, y: newBaseY },
        { x: newBaseX + oppositeVector.x, y: newBaseY + oppositeVector.y }
    );

    currentTriangle[i1] = newVertex1; // the triangle's vertex is moved to the random point inside the triangle
    currentTriangle[i2] = newVertex2;

    // draws the line, creating a smaller triangle
    line(
        newVertex1.x, newVertex1.y,
        newVertex2.x, newVertex2.y
    );

    counter++;
}

/**
 * Generates two random numbers between 0 and 1. But the sum cant be greater than 1.
 *
 * Then for each x and y coodrinate, it calculates the length between the first vertex to the second vertex, and the third.
 * Then multiplies each length (from first vertex to second, and from first vertex to third) by either u or v...
 * (Which are random numbers between 0 and 1).
 * The sum of first length * u and second length * v, gives a random point inside the triangle.
 *
 * @param {{x: number, y: number}} p0 - The first vertex of the triangle.
 * @param {{x: number, y: number}} p1 - The second vertex of the triangle.
 * @param {{x: number, y: number}} p2 - The third vertex of the triangle.
 * @returns {{x: number, y: number}} A random point inside the triangle.
 */
function randomPointInTriangle(p0, p1, p2) {
    let u = Math.random();
    let v = Math.random();
    if(u + v > 1) { u = 1 - u; v = 1 - v; }
    const x = p0.x + u * (p1.x - p0.x) + v * (p2.x - p0.x);
    const y = p0.y + u * (p1.y - p0.y) + v * (p2.y - p0.y);
    return { x, y };
}

/**
 * Finds the intersection point of two line segments, if it exists.
 *
 * First, it checks if the two vectors have the same direction, if so they are parallel, therefore, no intersection.
 * But if the denom is != 0, it finds where the intersection is.
 *
 * @param {{x: number, y: number}} line1Start - The starting point of the first line segment.
 * @param {{x: number, y: number}} line1End - The ending point of the first line segment.
 * @param {{x: number, y: number}} line2Start - The starting point of the second line segment.
 * @param {{x: number, y: number}} line2End - The ending point of the second line segment.
 * @returns {{x: number, y: number} | null} The intersection point as `{x, y}` if it exists, or `null` if the lines are parallel.
 */
function findSegmentIntersection(line1Start, line1End, line2Start, line2End) {
    const x1 = line1Start.x, y1 = line1Start.y;
    const x2 = line1End.x,   y2 = line1End.y;
    const x3 = line2Start.x, y3 = line2Start.y;
    const x4 = line2End.x,   y4 = line2End.y;

    // determines the direction of each line
    const dx1 = x2 - x1;
    const dy1 = y2 - y1;
    const dx2 = x4 - x3;
    const dy2 = y4 - y3;

    const denom = dx1 * dy2 - dy1 * dx2;
    if (denom === 0) {
        return null; // Parallel lines
    }

    // solve s
    const s = ((x3 - x1) * dy2 - (y3 - y1) * dx2) / denom;

    // intersection point
    const px = x1 + s * dx1;
    const py = y1 + s * dy1;

    return { x: px, y: py };
}



setup();
draw();