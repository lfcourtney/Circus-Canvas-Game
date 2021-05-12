//The 4 platforms that the person can spawn on
function drawPlatforms() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0,250);
    ctx.lineTo(55,250);
    ctx.moveTo(canvas.width,250);
    ctx.lineTo(canvas.width - 55,250);
    ctx.moveTo(0,400);
    ctx.lineTo(55,400);
    ctx.moveTo(canvas.width,400);
    ctx.lineTo(canvas.width - 55,400);
    ctx.stroke();
}

function drawSeeSaw() {
    let originPoint = 150;
    if(mousePos) originPoint = sortMouseXPos(mousePos.x);
    //Top Of See Saw
    ctx.beginPath();
    ctx.lineWidth = 2;
    if(p1Cord.flipped === 1){ //The other player is not flipped. There should be a person on the right side of seeSaw
        ctx.moveTo(originPoint - 70,570);
        ctx.lineTo(originPoint + 70,598);
    }else{ //The other player is flipped.
        ctx.moveTo(originPoint - 70,598);
        ctx.lineTo(originPoint + 70,570);
    }
    ctx.stroke();
    //SeeSaw Stand
    ctx.beginPath();
    ctx.moveTo(originPoint,584);
    ctx.lineTo(originPoint - 20,600);
    ctx.lineTo(originPoint + 20,600);
    ctx.closePath();
    ctx.fill();
}



