//We either start the game or restart the game when the user clicks on the button
menuBtn.addEventListener("click", e => {
    gameMenu.style.display = "none";
    if(canStartGame && lives > 0){
        loadBalloons();
        animate();
        //Initialise mousePos. User may have clicked the button without moving the mouse
        mousePos = {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop
        }
    }
    if(lives < 0){
        restartGame();
    }
});

//so the 'animate' function will only be called when all images have been successfully loaded.
(function loadSprites() {
    blueBalloon.onload = loadAssets;
    greenBalloon.onload = loadAssets;
    yellowBalloon.onload = loadAssets;
    //Player Sprites
    spriteSheet.onload = loadAssets;
})();


//Temporarily alter the velocity on the first few jumps depending on what platform the player spawned on. This is to make the game feel better
function sortVelocityStore(velocityYStore){
    if(p1Cord.y === 350 && numOfCollisions < 3){
        velocityYStore -= 1;
    }else if(p1Cord.y === 200 && numOfCollisions < 2){
        velocityYStore += 1;
    }
    return -velocityYStore;
}

//Limit change in X velocity. This is to prevent the player from going way to fast.
//We also add some default velocity to the player. This is to prevent a straight jump.
function limitChangeXVelocity(changeXVelocity, personJump){
    if(changeXVelocity < -35){
        changeXVelocity = -35;
    }else if(changeXVelocity > 35){
        changeXVelocity = 35;
    }else if(changeXVelocity === 0 && people.indexOf(personJump) === 0){
        changeXVelocity = 1.5;
    }else if(changeXVelocity === 0 && people.indexOf(personJump) === 1){
        changeXVelocity = -1.5;
    }
    return changeXVelocity;
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //See how much mouse has moved over the past 15 frames
    if(frameCount >= 15 && mousePos){
        frameCount = 0;
        velocityXDiff = (mousePos.x - prevMouseXPos) / 4;
    }

    if(frameCount <= 0 && mousePos){
        prevMouseXPos = mousePos.x;
    }

    //Draw platforms
    drawPlatforms();
    //seeSaw
    drawSeeSaw();

    //Draw People
    people.forEach((person, index) => {

        //Handle collision detection for the player that is currently jumping
        if(person.state === "JUMP"){
            playerHitCanvasEdge(person);
            if(canSlowDownFromPlatform && !person.startJump && person.flipped !== 0){
                playerHitTopOfPlatform(person);
            } 
        }

        //See if person has hit seeSaw when they are far down enough
        if(mousePos && (person.y + person.height) > 597 && person.velocityY < 0){
            let hasPlayerHit = playerHitSeeSaw(person);
            if(!hasPlayerHit){
                person.state = "FAIL";
                person.y = canvas.height - person.height;
                person.newState(0, 50);
                //Play audio
                gameSound.play();
                //Wait 2 seconds before respawning the player
                setTimeout(() => {
                    playerRespawns();
                }, 2000)
            }else{
                //Play audio
                seeSawJumpSound.play();
                increaseScore(10); //Increase score by 10 for landing properly
                p1Cord.flipped === 1 ? p1Cord.flipped = 0 : p1Cord.flipped = 1; //flip the seeSaw to the opposite side
                let velocityYStore = person.velocityY; // Store the velocity before it is reset with 'newState'
                person.newState(0, 30);
                person.state = "STAND";
                let personJump = null;
                if(index === 0){
                    personJump = people[1];
                }else{
                    personJump = people[0];
                }
                    personJump.state = "JUMP";
                    //So they jump in the right direction
                    if(personJump.flipped === 0){
                        personJump.flipped = 1;
                    }
                    personJump.newState(0, 50);
                    personJump.velocityX = limitChangeXVelocity(velocityXDiff, personJump);
                    personJump.velocityY = sortVelocityStore(velocityYStore);
                    personJump.startJump = true;
                    //Increment seeSaw collisions
                    numOfCollisions++;
            }   
        }


        //Call the relevant method based on the state of the player object
        switch(person.state){
            case "WALK":
                person.walk();
                break;
            case "STAND":
                person.stand();
                break;
            case "JUMP":
                person.jump();
                break;
            case "FAIL":
                person.fail();
                break;
        }
    });

    //Draw balloon images to canvas
    balloonStore.forEach(balloon => {
        //Check to see if player has hit balloon
        let jumpPlayer = people.find(person => person.state === "JUMP");
        if(jumpPlayer){ //Only when there is a player that is currently jumping
            if(hasPlayerHitBalloon(jumpPlayer, balloon)){
                playerHasHitBalloon(jumpPlayer, balloon);
            }
        }
        balloon.restartCycle();
        balloon.draw();
    });


    if(mousePos) frameCount++; //Frame has been successfully drawn. Used for the seeSaw velocity change!
}


let numberOfImages = 4;
function loadAssets() {
    //Countdown until all images are loaded
    if(--numberOfImages > 0) return;
    //By this point, all assets should been have loaded
    //Load Balloons into Array
    canStartGame = true;
}

