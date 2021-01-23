let particles = [];
let result;
let font;
let currentX = 0;
let currentY = 0;
let dragState = false;
let offsetX = 0.0;
let offsetY = 0.0;

// Mini-map
let minX = 99999.0;
let maxX = -99999.0;
let minY = 99999.0;
let maxY = -99999.0;

class PopUp {
    constructor(x, y, name, image) {
        this.x = x;
        this.y = y;

        this.name = name;
        this.image = image;
    }

    show(){
        push();
        fill(255);
        rect(this.x - 10, this.y - 30, this.image.width + 20, this.image.height + 40, 5);
        fill(20);
        text(this.name, this.x, this.y - 15);
        image(this.image, this.x, this.y);
        pop();
    }
}

class Particle{
    constructor(x, y, name, image){
        this.x = x;
        this.y = y;

        this.updated_x = this.x;
        this.updated_y = this.y;

        this.name = name;
        this.image = image;

        this.visible = false;
        this.pressed = false;
    }

    update(){
        this.updated_x = this.x + currentX;
        this.updated_y = this.y + currentY;

        if ((this.updated_x > -this.image.width && this.updated_x < windowWidth) && (this.updated_y > -this.image.height && this.updated_y < windowHeight)) {
            this.visible = true;
        } else {
            this.visible = false;
        }

        if(this.visible){
            if ((mouseX > this.updated_x && mouseX < this.updated_x + this.image.width) && (mouseY > this.updated_y && mouseY < this.updated_y+ this.image.height)){
                this.pressed = true;
                this.popUp = new PopUp(this.updated_x, this.updated_y, this.name, this.image);
            } else {
                this.pressed = false;
                this.popUp = null;
            }
        }
    }

    show(){
        if(this.visible){
            if(this.pressed) {
                this.popUp.show();
            } else {
                push();
                translate(this.x, this.y);
                // text(this.name, currentX, currentY - 20);
                image(this.image, currentX, currentY);
                pop();
            }
        }
    }
}

function preload(){
    result = loadStrings("values.txt");
    font = loadFont('roboto.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    textFont(font);
    fill(20);

    if (result.length > 0) {
        for (let i = 0; i < result.length - 1; i++) {
            let splitString = split(result[i], ',');

            let name = splitString[0];
            let x = float(splitString[1]) * 80;
            let y = float(splitString[2]) * 80;

            let img = loadImage("words/" + name + ".png");

            let p = new Particle(x, y, name, img);
            particles.push(p);

            if (minX > x){
                minX = x;
            }
            if (maxX < x){
                maxX = x;
            }
            if (minY > y){
                minY = y;
            }
            if (maxY < y){
                maxY = y;
            }
        }

        minX = floor(minX);
        maxX = ceil(maxX);
        minY = floor(minY);
        maxY = ceil(maxY);
    }
}

function draw() {
    background("edf6f9");

    // Adjust location if being dragged
    if (dragState) {
        currentX = mouseX + offsetX;
        currentY = mouseY + offsetY;
    }

    let pressed = [];
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();

        if(particles[i].pressed)
            pressed.push(i);
        else
            particles[i].show();
    }
    for (let i = 0; i < pressed.length; i++) {
        particles[pressed[i]].show();
    }

    // Draw mini-map
    push();
    strokeWeight(4);
    fill("edf6f9");
    stroke(0);
    rect(3*windowWidth/4, 3*windowHeight/4, windowWidth/4, windowHeight/4);
    strokeWeight(1);
    for (let i = 0; i < particles.length; i++) {
        let miniX = map(particles[i].x, minX, maxX, 0, windowWidth/4) + (3*windowWidth/4);
        let miniY = map(particles[i].y, minY, maxY, 0, windowHeight/4) + (3*windowHeight/4);

        point(miniX, miniY);
    }

    let miniWindowX = map(-currentX, minX, maxX, 0, windowWidth/4) + (3*windowWidth/4);
    let miniWindowY = map(-currentY, minY, maxY, 0, windowHeight/4) + (3*windowHeight/4);
    let miniWindowW = windowWidth / 20;
    let miniWindowH = windowHeight / 20;

    noFill();
    rect(miniWindowX, miniWindowY, miniWindowW, miniWindowH);

    pop();
}

function mousePressed() {
    dragState = true;

    // If so, keep track of relative location of click to corner of rectangle
    offsetX = currentX - mouseX;
    offsetY = currentY - mouseY;

    print(mouseX, mouseY);
}

//After the mouse is released, the silly state is restored
function mouseReleased() {
    dragState = false;
}