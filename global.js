const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//HTML elements
let gameMenu = document.getElementById("game-menu");
let menuBtn = document.querySelector("#menu-card button");
let scoreText = document.getElementById("score-text");
let livesText = document.getElementById("lives-text");

//Global Vars
let canStartGame = false;
let mousePos = null;
let gravity = 0.4;
let friction = 0.008;
//The next 3 Booleans relate to changing the paddles X velocity based on the mouse positioning
let frameCount = 0;
let prevMouseXPos = 0;
let velocityXDiff = 0;
let canSlowDownFromPlatform = true; //Player & Platform collision cooldown period Boolean
let numOfCollisions = 0;
//Gameplay
let score = 0;
let lives = 3;
//Will eventually be assigned to the getAnimationFrame function
let animationId = null;

canvas.addEventListener("mousemove", e => {
    mousePos = {
        x: e.clientX - canvas.offsetLeft,
    }
    
});

//Make it so user cannot move seeSaw outside of canvas
function sortMouseXPos(mouseXPos) {
    let newXPos = mouseXPos;
    if(mouseXPos - 70 < 0){
        newXPos = 70;
    }else if(mouseXPos + 70 > canvas.width){
        newXPos = canvas.width - 70;
    }
    return newXPos;
}