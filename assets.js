//SPRITES
let blueBalloon = new Image();
blueBalloon.src = "assets/blue-baloon.png";
let greenBalloon = new Image();
greenBalloon.src = "assets/green-baloon.png";
let yellowBalloon = new Image();
yellowBalloon.src = "assets/yellow-baloon.png";
//Player sprite sheet & sprite locations
let spriteSheet = new Image();
spriteSheet.src = "assets/sprites/spritesheet.png";
//Created from 'Free Sprite Sheet Packer'
const fallSprites = [
    {
        x: 1,
        y: 1,
        w: 83,
        h: 83
    },
    {
        x: 86,
        y: 1,
        w: 83,
        h: 83
    },
    {
        x: 171,
        y: 1,
        w: 83,
        h: 83
    }
]
const flySprites = [
    {
        x: 256,
        y: 1,
        w: 83,
        h: 83
    },
    {
        x: 341,
        y: 1,
        w: 83,
        h: 83
    },
    {
        x: 426,
        y: 1,
        w: 83,
        h: 83
    },
    {
        x: 511,
        y: 1,
        w: 83,
        h: 83
    },
    {
        x: 596,
        y: 1,
        w: 83,
        h: 83
    }
]
const standSprite = {
    x: 681,
    y: 1,
    w: 47,
    h: 83
}
const walkSprites = [
    {
        x: 730,
        y: 1,
        w: 60,
        h: 88
    },
    {
        x: 792,
        y: 1,
        w: 49,
        h: 88
    }
]

//AUDIO
let gameSound = new Audio("assets/sfx/gameSound.mp3");
let hitBalloonSound = new Audio("assets/sfx/hitBalloon.mp3");
let seeSawJumpSound = new Audio("assets/sfx/seeSawJump.mp3");

