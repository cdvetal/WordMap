let images = [];
let result;
let font;
let currentX = 0;
let currentY = 0;
let dragState = false;
let offsetX = 0.0;
let offsetY = 0.0;

function preload(){
    result = loadStrings("values.txt");
    font = loadFont('roboto.ttf');
}

function setup() {
    createCanvas(1920, 1080);

    textFont(font);
    textAlign(CENTER, CENTER);
    fill(20);

    if (result.length > 0) {
        for (let i = 0; i < result.length - 1; i++) {
            let splitString = split(result[i], ',');

            let name = splitString[0];

            let img = loadImage("words/" + name + ".png");
            images.push(img);
        }
        print("Done");
    }
}

function draw() {
    background(255);

    // Adjust location if being dragged
    if (dragState) {
        currentX = mouseX + offsetX;
        currentY = mouseY + offsetY;
    }

    if (result.length > 0) {
        for (let i = 0; i < result.length - 1; i++) {
            let splitString = split(result[i], ',');

            let name = splitString[0];
            let x = float(splitString[1]) * 50;
            let y = float(splitString[2]) * 50;
            let z = float(splitString[3]) * 50;

            push();
            translate(x, y, z);
            text(name, currentX, currentY - 20);
            image(images[i], currentX, currentY);
            pop();

        }
    }
}

/*
function mouseDragged() {
    if (dragState) {
        let diff_x = (last_x - mouseX);
        print(diff_x);
        let diff_y = (last_y - mouseY);
        print(diff_y);

        x_step += (diff_x / 10);
        y_step += (diff_y / 10);

        last_x = mouseX;
        last_Y = mouseY;
    }
}
*/

function mousePressed() {
    dragState = true;

    // If so, keep track of relative location of click to corner of rectangle
    offsetX = currentX - mouseX;
    offsetY = currentY - mouseY;
}

//After the mouse is released, the silly state is restored
function mouseReleased() {
    dragState = false;
}