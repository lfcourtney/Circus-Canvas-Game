//The user has missed the see Saw. Depending on how many lives are left, the game either ends of the player respawns
function playerRespawns() {
    lives--;
    if(lives < 0){
        endGame();
        return;
    }
    numOfCollisions = 0;
    livesText.textContent = lives;
    //Handle player respawn
    p1Cord = spawnPlayer();
    person1 = new Person(p1Cord.x, p1Cord.y, p1Cord.flipped, "WALK");
    person2 = new Person(200,200,1,"STAND");
    people = [person1, person2];
}

//The game is over because all lives have been depleted
function endGame() {
    document.querySelector("#menu-card h1").textContent = "Game Over!";
    menuBtn.textContent = "Restart?";
    gameMenu.style.display = "flex";
}

//Function that restarts the game
function restartGame(){
    balloonStore = [];
    loadBalloons();
    numOfCollisions = 0;
    score = 0;
    lives = 3;
    livesText.textContent = lives;
    scoreText.textContent = score;
    p1Cord = spawnPlayer();
    person1 = new Person(p1Cord.x, p1Cord.y, p1Cord.flipped, "WALK");
    person2 = new Person(200,200,1,"STAND");
    people = [person1, person2];
}

//Function that loads the next level
function newLevel() {
    balloonStore = [];
    loadBalloons();
    numOfCollisions = 0;
    p1Cord = spawnPlayer();
    person1 = new Person(p1Cord.x, p1Cord.y, p1Cord.flipped, "WALK");
    person2 = new Person(200,200,1,"STAND");
    people = [person1, person2];
}

//Check to see if the player has cleared all of the balls & a new level can be loaded
function checkToSeeIfAllBallsAreCleared() {
    setTimeout(() => {
        if(balloonStore.length <= 0){
            gameSound.play();
            cancelAnimationFrame(animationId);
            setTimeout(() => {
                newLevel();
                animationId = requestAnimationFrame(animate);
            }, 2000);
        }
    }, 10);
}

//Increase score
function increaseScore(amount) {
    score += amount;
    scoreText.textContent = score;
}