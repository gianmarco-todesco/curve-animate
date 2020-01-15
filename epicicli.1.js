const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let width, height;

function mainLoop() {
    width = canvas.width;
    height = canvas.height;
    ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.translate(width/2,height/2);
    draw();
    ctx.restore();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

function fillCircle(x,y,r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

curve = [];
let r1 = 120, r2 = 50, r3 = 20;
    
function draw() {
    const time = performance.now() * 0.001;

    let phi1 = Math.PI*2*time * 0.1;
    let phi2 = phi1 + phi1 * r1/r2;
    let phi3 = phi2 + phi2 * r2/r3;

    let x1 = Math.cos(phi1)*(r1+r2);
    let y1 = Math.sin(phi1)*(r1+r2);
    
    let x2 = x1 + Math.cos(phi2)*(r2+r3);
    let y2 = y1 + Math.sin(phi2)*(r2+r3);
    
    let x3 = x2 + Math.cos(phi3)*r3;
    let y3 = y2 + Math.sin(phi3)*r3;
    
    ctx.fillStyle = "rgb(200,200,200,0.5)";
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    fillCircle(0,0,r1);
    fillCircle(x1,y1,r2);
    fillCircle(x2,y2,r3);

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.stroke();

    ctx.fillStyle = "blue";
    fillCircle(x3,y3,3);

    
    curve.push([x3,y3]);
    var m = 1000;
    if(curve.length>m) curve.splice(0,curve.length-m);
    if(curve.length>2) {
        ctx.beginPath();
        ctx.moveTo(curve[0][0], curve[0][1]);
        for(let i=1; i<curve.length; i++) 
            ctx.lineTo(curve[i][0], curve[i][1]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
}