let particles = [];
let result;
let font;

let currentX = 0;
let currentY = 0;
let dragState = false;
let offsetX = 0.0;
let offsetY = 0.0;

// Search
let inputElem;
let button;

// Zoom
let sf = 1.0;

// Switch button
let color_button;
let color = 0;
let position_button;
let position = 0;


class PopUp {
    constructor(x, y, name, image, image_color) {
        this.pos = createVector(x, y);

        this.name = name;
        this.image = image;
        this.image_color = image_color;
    }

    show(){
        let this_img;

        if (color === 0)
            this_img = this.image;
        else
            this_img = this.image_color;

        push();
        fill(255);
        rect(this.pos.x - 10, this.pos.y - 30, this_img.width + 20, this_img.height + 40, 5);
        fill(0);
        text(this.name, this.pos.x, this.pos.y - 10);
        image(this_img, this.pos.x, this.pos.y);
        pop();
    }
}


class Particle{
    constructor(x, y, x_img, y_img, name, image, image_color){
        this.pos = createVector(x, y);
        this.pos_img = createVector(x_img, y_img);
        this.name = name;
        this.image = image;
        this.image_color = image_color;
        this.hovered = false;
    }

    update(){
        let updated_x = -(currentX - mouseX + (windowWidth / 2));
        let updated_y =  -(currentY - mouseY + (windowHeight / 2));

        if (dist(updated_x, updated_y, this.pos.x + (this.image.width / 2), this.pos.x + (this.image.height / 2)) < (this.image.height / 2)){
            this.hovered = true;
            this.popUp = new PopUp(this.pos.x, this.pos.y, this.name, this.image);
        } else {
            this.hovered = false;
            this.popUp = null;
        }
    }

    show(){
        if (this.hovered){
            this.popUp.show();
        } else {
            let this_pos;
            let this_img;

            if (color === 0)
                this_img = this.image;
            else
                this_img = this.image_color;

            if (position === 0)
                this_pos = this.pos;
            else
                this_pos = this.pos_img;

            push();
            text(this.name, this_pos.x, this_pos.y - 20);
            stroke(255, 0, 0);
            noFill();
            rect(this.pos.x, this.pos.y, this.image.width, this.image.height);
            // image(this_img, this_pos.x, this_pos.y, 0);
            pop();
        }
    }
}


function preload(){
    result = loadStrings("values.txt");
    result_img = loadStrings("values_img.txt");
    font = loadFont('roboto.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    textFont(font);
    fill(20);

    if (result.length > 0 && result_img.length > 0) {
        for (let i = 0; i < result.length - 1; i++) {
            let splitString = split(result[i], ',');

            let name = splitString[0];
            let x = float(splitString[1]) * 80;
            let y = float(splitString[2]) * 80;

            let splitString_img = split(result_img[i], ',');

            let x_img = float(splitString_img[1]) * 0.6;
            let y_img = float(splitString_img[2]) * 0.6;

            let img = loadImage("words/" + name + ".png");
            let img_c = loadImage("words_3/" + name + ".png");

            let p = new Particle(x, y, x_img, y_img, name, img, img_c);
            particles.push(p);

            if (i > 5)
                break;
        }
    }

    cam = createCamera(0, 0, 700);

    // Create input element
    inputElem = createInput('');
    inputElem.position(30, 60);

    button = createButton('Search');
    button.position(inputElem.x + inputElem.width, 60);
    button.mousePressed(find);

    color_button = createButton('Switch color');
    color_button.position(inputElem.x, inputElem.y + inputElem.height);
    color_button.mousePressed(switch_color);

    position_button = createButton('Switch mapping');
    position_button.position(color_button.x, color_button.y + color_button.height);
    position_button.mousePressed(switch_position);
}

function draw() {
    background("edf6f9");

     // Adjust location if being dragged
     if (dragState) {
         currentX = mouseX + offsetX;
         currentY = mouseY + offsetY;
     }

     cam.setPosition(-currentX, -currentY, 700 * sf);

    for (let i = 0; i < particles.length; i++) {
        // particles[i].update();
        particles[i].show();
    }
}

function find() {
    let multiplier;
    if (result.length > 0) {
        for (let i = 0; i < result.length - 1; i++) {
            let splitString;
            if (position === 0) {
                splitString = split(result[i], ',');
                multiplier = 80;
            } else {
                splitString = split(result_img[i], ',');
                multiplier = 0.6;
            }

            let name = splitString[0];
            let x = float(splitString[1]) * multiplier;
            let y = float(splitString[2]) * multiplier;

            if (name === inputElem.value()){
                currentX = -x;
                currentY = -y;
            }
        }
    }
}

function switch_color() {
    color = 1 - color;
}

function switch_position() {
    position = 1 - position;
}

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

window.addEventListener("wheel", function(e) {
    if (e.deltaY > 0)
        sf *= 1.02;
    else
        sf *= 0.98;
});