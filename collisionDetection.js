//See if the player has hit the see saw or has missed
function playerHitSeeSaw(person) {
    let xPos = sortMouseXPos(mousePos.x);
    if(p1Cord.flipped === 1) { //Needs to hit left side of seeSaw
        return(person.x > (xPos - 120) && 
        person.x + person.width < xPos + 50);
    }else{
        return(person.x + person.width < (xPos + 120) &&
            person.x > xPos - 50);
    }
}

//See if player has hit the edge of the canvas
function playerHitCanvasEdge(person) {
    if(person.x + person.width > canvas.width){ //right side collision
        person.x = canvas.width - person.width;
        person.velocityX *= -1;
        person.shouldSpin = true;
        skipToNextSprite(person);
    }else if(person.x < 0){ //left side collision
        person.x = 0;
        person.velocityX *= -1;
        person.shouldSpin = true;
        skipToNextSprite(person);
    }else if(person.y < 0){ //top collision
        person.y = 0;
        person.velocityY *= -1;
        skipToNextSprite(person);
    }
}

//Skip to next sprite so collision looks good.
function skipToNextSprite(person) {
    person.spriteFrame++;
    person.frameWait = 0;
}

//Player hits top of the platforms
function playerHitTopOfPlatform(person) {
    if(person.velocityY < -5){ //Check to see that player is falling

    if(person.y + person.height > 250 &&
        person.y + person.height < 300 &&
        person.x < 56){ //Top Left Platform Collision
            console.log("Top Left Platform Collision");
            person.velocityY += 5; //Slow down the velocity on the Y
            resetPlatform();
    }else if(person.y + person.height > 250 &&
        person.y + person.height < 300 &&
        person.x + person.width > canvas.width - 56){ //Top Right Platform Collision
            person.velocityY += 5; //Slow down the velocity on the Y
            console.log("Top Right Platform Collision");
            resetPlatform();
    }else if(person.y + person.height > 400 &&
        person.y + person.height < 450 &&
        person.x < 56){//Bottom left platform collision
            person.velocityY += 5; //Slow down the velocity on the Y
            console.log("Bottom Left Platform Collision");
            resetPlatform();
    }else if(person.y + person.height > 400 &&
        person.y + person.height < 450 &&
        person.x + person.width > canvas.width - 56){
            person.velocityY += 5; //Slow down the velocity on the Y
            console.log("Bottom Right Platform Collision");
            resetPlatform();
    }
}
}


//So that collision with balloons looks good
function generatePlayerHitBox(person){
    let centerXPoint = person.x + (person.width / 2);
    let leftSide = centerXPoint - 6.5; //We are checking to see if body has collided not the arms
    let rightSide = centerXPoint + 6.5;
    return {
        leftSide,
        y: person.y,
        rightSide,
        height: person.height
    }
}

//Check to see if player has collided with balloon on any side
function hasPlayerHitBalloon(person, balloon){
    let personHitBox = generatePlayerHitBox(person);
    /*5.5 is used because we want to get a small portion of the players midsection. 16.5 is used because we want to incorporate half of the space between the balloons
    (39) into the balloons collision box. This means that the player will not be able to pass through a complete line of balloons without a collision*/
    return !(
        personHitBox.leftSide>balloon.x+balloon.width || //Person is to the right of balloon
        personHitBox.rightSide<balloon.x || //Person is to the left of balloon
        personHitBox.y>balloon.y+balloon.height || //Person is below the balloon
        person.y+person.height<balloon.y || //Person is above the balloon
        personHitBox.leftSide + 5.5 < balloon.x - 16.5 && personHitBox.rightSide - 5.5 > balloon.x + balloon.width + 16.5 //Means the top of player cannot pass through a complete line of balloons without collision
    );
}



//Do something when collision between player & ball has occured
function playerHasHitBalloon(person, balloon){
    let index = balloonStore.indexOf(balloon);
    let personHitBox = generatePlayerHitBox(person);
    if(personHitBox.y < balloon.y + balloon.height && personHitBox.y > balloon.y + 25 && //Top of player has collided with bottom of balloon
            personHitBox.leftSide + 5.5 > balloon.x - 16.5 && personHitBox.rightSide - 5.5 < balloon.x + balloon.width + 16.5){
        person.velocityY *= -1;
        person.velocityX *= -1;
        removeBalloon(index);
    }else if(personHitBox.y < balloon.y - 40 && personHitBox.y + personHitBox.height > balloon.y &&
            personHitBox.leftSide + 5.5 > balloon.x - 16.5 && personHitBox.rightSide - 5.5 < balloon.x + balloon.width + 16.5){ //Bottom of player has collided with bottom of balloon
        person.velocityY *= -1;
        person.velocityX *= -1;
        removeBalloon(index);
    }else if(personHitBox.leftSide < balloon.x + balloon.width ){ //Collision between left of player & right of balloon
        person.velocityX *= -1;
        person.shouldSpin = true;
        removeBalloon(index);
    }else if(personHitBox.rightSide > balloon.x){ //Collision between right of player & left of balloon
        person.velocityX *= -1;
        person.shouldSpin = true;
        removeBalloon(index);
    }
}

//Remove Balloon on collision & increase the score according to what colour balloon they popped
function removeBalloon(index) {
    let balloon = balloonStore[index];
    switch(balloon.image){
        case yellowBalloon:
            increaseScore(20);
            break;
        case greenBalloon:
            increaseScore(50);
            break;
        case blueBalloon:
            increaseScore(100);
            break;
    }
    //Play the audio
    hitBalloonSound.play();
    setTimeout(() => {
        balloonStore.splice(index, 1);
        //Check to see if all the balloons have been cleared
        checkToSeeIfAllBallsAreCleared();
    }, 0)
}

