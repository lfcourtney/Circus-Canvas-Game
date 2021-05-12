class Person {
    constructor(x,y,flipped,state){
        this.state = state;
        this.x = x;
        this.origX = x;
        this.y = y;
        this.sprite = walkSprites[0];
        this.walkSpeed = 0.3;
        this.walkSpeedStore = 0; //Used to sort out jumping position when flipped
        this.startJump = false;
        this.shouldSpin = false;
        this.spinNum = 270;
        this.velocityX = 1.5;
        this.velocityY = 7.5;
        this.spriteFrame = 0;
        this.frameWait = 0; //Used to make sprite animations look good
        this.flipped = flipped;
        this.width = 30;
        this.height = 50;
    }

    newState(velocityX, width) {
        this.velocityX = velocityX;
        this.velocityY = 7.5;
        this.spriteFrame = 0;
        this.frameWait = 0;
        this.shouldSpin = false; //Make it so player can no longer spin
        this.spinNum = 270;
        this.width = width;
    }

    stand(){
        this.sprite = standSprite;
        let xPos = 190;
        if(p1Cord.flipped === 1){ //Player is on the right of see saw when other player is unflipped
            xPos = 190; //This is if the seeSaw has not been moved with mouse
            if(mousePos) xPos = sortMouseXPos(mousePos.x) + 40;
        }else{
            xPos = 80;
            if(mousePos) xPos = sortMouseXPos(mousePos.x) - 70;
        }
        
        this.x = xPos;
        this.y = 545;
        this.draw();
    }

    walk(){
        this.flipped === 1 ? this.x += this.walkSpeed : this.x -= this.walkSpeed;
        this.walkSpeedStore += this.walkSpeed; //This is so flipped sprite can be put into the correct position
        let spriteNum = this.spriteFrame % 2; //Modulus is 2 because that is number of sprites in walk animation
        this.sprite = walkSprites[spriteNum];
        this.frameWait++;
        this.draw();
        //Only change sprite once every 10 frames (keeps the animation from playing too fast)
        if(this.frameWait >= 10){
            this.spriteFrame++;
            this.frameWait = 0;
        }
        //Check to see if jump should happen now
        if(this.x > this.origX + 35 || this.x < this.origX - 35){
            //The player should jump now
            this.newState(1.5, 50);
            //Sort Width Out
            this.state = "JUMP";
            this.startJump = true;
            //Need to revert coordinates because player has been walking in reverse
            if(this.flipped === 0){
                this.x -= this.walkSpeedStore; 
            }
        }
    }

    spin(){
        //Work out the centre points of the player first
        let midX = this.x + (this.width / 2);
        let midY = this.y + (this.height / 2);
        ctx.translate(midX,midY);
        ctx.rotate(this.spinNum * Math.PI / 180);
        ctx.translate(-midX,-midY);
        if(this.frameWait >= 10) this.spinNum += 90; //Increment. Make it so that rotation can only happen on new sprite.
        if(this.spinNum > 270) this.spinNum = 0;
    }

    jump(){
        let spriteNum = this.spriteFrame % 4; //Modulus is 4 because that is the number of sprites in jump animation
        this.sprite = flySprites[spriteNum];
        if(!this.shouldSpin){
            if( this.y > 350) this.sprite = flySprites[0]; //Show the sprite on first 10 frames & when player is coming down
        }
        this.frameWait++;
        //Do Velocity Stuff
        this.flipped === 1 ? this.x += this.velocityX : this.x -= this.velocityX ;
        this.y -= this.velocityY; //Minus makes the player travel upwards
        //Sort out gravity & friction
        this.velocityY -= gravity;
        this.velocityX = this.velocityX - (this.velocityX*friction);
        this.draw();
        //Only change sprite once every 10 frames (keeps the animation from playing too fast)
        if(this.frameWait >= 10){
            this.spriteFrame++;
            this.frameWait = 0;
            this.startJump = false;
        }
    }

    fail(){
        let spriteNum = this.spriteFrame % 3;
        this.sprite = fallSprites[spriteNum];
        if(this.sprite !== fallSprites[2]) this.frameWait++;
        this.draw();
        //Only change sprite once every 10 frames (keeps the animation from playing too fast)
        if(this.frameWait >= 10){
            this.spriteFrame++;
            this.frameWait = 0;
        }
    }

    draw() {
        ctx.save();
        //Flip horizontally
        if(this.flipped === 0 && this.state === "WALK") {
            ctx.translate(this.x, this.y );
            ctx.scale(-1, 1); //This is what rotates sprite horizontally
            ctx.drawImage(spriteSheet, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, 0, 0, this.width, this.height); //0 position. We will let translate do the work instead.
        }else{
            if(this.shouldSpin) this.spin();
            ctx.drawImage(spriteSheet, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}

//Player can be spawned on any one of the four platforms
function spawnPlayer() {
    //Considering that the height of the player is 50px
    let choice = Math.floor(Math.random() * 4) + 1;
    switch(choice){
        case 1:
            return {x: -15, y: 200, flipped: 1}
        case 2:
            return {x: canvas.width + 15, y: 200, flipped: 0}
        case 3:
            return {x: -15, y: 350, flipped: 1}
        case 4:
            return {x: canvas.width + 15 , y: 350, flipped: 0}
    }
}

let p1Cord = spawnPlayer();
let person1 = new Person(p1Cord.x, p1Cord.y, p1Cord.flipped, "WALK");
let person2 = new Person(200,200,1,"STAND");
//So we can loop through & apply the same code to both of our player objects
let people = [person1, person2];

class Balloon {
    constructor(x, y, dir, dx, image) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.dx = dx;
        this.image = image;
        this.width = 22;
        this.height = 30;
    }

    restartCycle() {
        switch(this.dir){
            case "left":
                if((this.x + this.width) < 0){
                    this.x = (canvas.width);
                }
                break;
            case "right":
                if(this.x > canvas.width){
                    this.x = -(this.width);
                }
                break;
        }
    }

    draw() {
        this.x += this.dx;
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
}

//Balloon Store
let balloonStore = [];

//Load Balloons Into Array
function loadBalloons() {
    //Starting ball position
    let ballPos = 5;
    /*We render out the balloons into the Array like this because we 
    want the balloons to be stacked on top of one another like different layers in the game*/
    for(let i = 0; i < 48; i++){
        if(ballPos > 590){
            ballPos = 5;
        }
        if(i < 16){
            balloonStore.push(new Balloon(ballPos, 5 , "left", -1, blueBalloon));
        }else if(i > 15 && i < 32){
            balloonStore.push(new Balloon(ballPos, 45, "right", 1.2, greenBalloon));
        }else if(i > 31){
            balloonStore.push(new Balloon(ballPos, 85, "left", -1, yellowBalloon));
        }
        
        ballPos += 39;
    }
}