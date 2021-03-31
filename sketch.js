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
let sf = 80.0;

// Switch button
let color_button;
let color = 0;


class PopUp {
    constructor(x, y, name, image, image_color) {
        this.x = x;
        this.y = y;

        this.name = name;
        this.image = image;
        this.image_color = image_color;
    }

    show(){
        let this_image;

        if (color === 0)
            this_image = this.image;
        else
            this_image = this.image_color;

        push();
        fill(255);
        rect(this.x - 10, this.y - 30, this.image.width + 20, this.image.height + 40, 5);
        fill(20);
        text(this.name, this.x, this.y - 15);
        image(this_image, this.x, this.y);
        pop();
    }
}

class Particle{
    constructor(x, y, name, image, image_color){
        this.x = x;
        this.y = y;

        this.updated_x = (this.x * sf);
        this.updated_y = (this.y * sf);

        this.name = name;
        this.image = image;
        this.image_color = image_color;

        this.hovered = false;
    }

    update(){
        this.updated_x = (this.x * sf) + currentX;
        this.updated_y = (this.y * sf) + currentY;

        if ((mouseX > this.updated_x && mouseX < this.updated_x + this.image.width) && (mouseY > this.updated_y && mouseY < this.updated_y+ this.image.height)){
            this.hovered = true;
            this.popUp = new PopUp(this.updated_x, this.updated_y, this.name, this.image, this.image_color);
        } else {
            this.hovered = false;
            this.popUp = null;
        }
    }

    show(){
        if(this.hovered) {
            this.popUp.show();
        } else {
            let this_image;

            if (color === 0)
                this_image = this.image;
            else
                this_image = this.image_color;

            push();
            text(this.name, this.updated_x, this.updated_y - 10);
            image(this_image, this.updated_x, this.updated_y);
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
    createCanvas(windowWidth, windowHeight);

    textFont(font);
    fill(20);

    if (result.length > 0) {
        for (let i = 0; i < result.length - 1; i++) {
            let splitString = split(result[i], ',');

            let name = splitString[0];
            let x = float(splitString[1]);
            let y = float(splitString[2]);

            let img = loadImage("words/" + name + ".png");
            let img_color = loadImage("words_3/" + name + ".png");

            let p = new Particle(x, y, name, img, img_color);
            particles.push(p);
        }
    }

    // Create input element
    inputElem = createInput('');
    inputElem.position(30, 60);

    button = createButton('Search');
    button.position(inputElem.x + inputElem.width, 60);
    button.mousePressed(find);

    color_button = createButton('Switch color');
    color_button.position(inputElem.x, inputElem.y + inputElem.height);
    color_button.mousePressed(switch_color);
}

function find() {
    for (let i = 0; i < particles.length - 1; i++) {
        if (particles[i].name === inputElem.value()){
            currentX = (windowWidth / 2) - (particles[i].x * sf);
            currentY = (windowHeight / 2) - (particles[i].y * sf);

            break;
        }
    }
}

function draw() {
    background("edf6f9");

    // Adjust location if being dragged
    if (dragState) {
        currentX = mouseX + offsetX;
        currentY = mouseY + offsetY;
    }

    let hovered = [];
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();

        if(particles[i].hovered)
            hovered.push(i);
        else
            particles[i].show();
    }
    for (let i = 0; i < hovered.length; i++) {
        particles[hovered[i]].show();
    }
}

function switch_color() {
    color = 1 - color;
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

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        sf -= 5;
        currentX += 70;
        currentY += 35;
    } else if (keyCode === RIGHT_ARROW) {
        sf += 5;
        currentX -= 75;
        currentY -= 35;
    }
}

/*
window.addEventListener("wheel", function(e) {
    if (e.deltaY > 0)
        sf -= 2;
    else
        sf += 2;
});
 */