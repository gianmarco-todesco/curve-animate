const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let width, height;

function mainLoop() {
    width = canvas.width;
    height = canvas.height;
    ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.translate(width/2, height/2);
    draw();
    ctx.restore();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);



var dft = [];

function analyze(crv) {
    var n = crv.length;
    var d = Math.floor(n/2);
    dft = [];
    for(var i=0;i<n;i++) {
        var phi = 2*Math.PI*(i-d)/n;
        var re = 0, im = 0;
        for(var j=0; j<n; j++) {
            var re1 = crv[j][0], im1 = crv[j][1];
            var re2 = Math.cos(phi*j), im2 = -Math.sin(phi*j);
            var re3 = re1*re2 - im1*im2;
            var im3 = re1*im2 + re2*im1;
            re += re3;
            im += im3;
        }
        dft.push([re,im]);
    }
}


function drawCircle(x,y,r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
}

function drawArrow(x0,y0, x1,y1) {
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
}

var tail = [];
var targetCrv;
var stroking = false;

var mousex, mousey,dx,dy;
function onMouseDown(e) {
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onRelease);
    dx = e.offsetX - e.clientX;
    dy = e.offsetY - e.clientY;    
    mousex = e.offsetX;
    mousey = e.offsetX;
    strokeStart();
}
function onDrag(e) {
    var x = e.clientX + dx - canvas.width/2 ;
    var y = e.clientY + dy - canvas.height/2;
    stroke(x,y);
    
}
function onRelease(e) {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onRelease);  
    strokeEnd();
}

canvas.addEventListener('mousedown', onMouseDown);


function strokeStart() {
    tail = [];
    targetCrv = [];
    stroking = true;
}

function stroke(x,y) {
    var m = targetCrv.length;
    if(m>0)
    {
        let rx = targetCrv[m-1][0] - x;
        let ry = targetCrv[m-1][1] - y;
        if(rx*rx+ry*ry<50) return;        
    }
    targetCrv.push([x,y]);
}

function strokeEnd() {
    analyze(targetCrv);
    stroking = false;

}

function drawCurve(crv) {
    var n = crv.length;
    if(n<2) return;
    ctx.beginPath();
    ctx.moveTo(crv[0][0],crv[0][1]);
    for(var i=1; i<n; i++) 
        ctx.lineTo(crv[i][0],crv[i][1]);
    ctx.stroke();
}

function drawEpicycles() {
    if(!dft || dft.length==0) return;
    ctx.lineWidth = 1;
    const time = performance.now() * 0.001;

    var n = dft.length;
    var d = Math.floor(n/2);
    let x0 = 0, y0 = 0;
    var t = time *0.1;
    var phi = 2*Math.PI*(t - Math.floor(t));
    
    for(var i=0; i<n; i++) {
        var re1 = dft[i][0], im1 = dft[i][1];
        var re2 = Math.cos(phi*(i-d)), im2 = Math.sin(phi*(i-d));
        var dx = (re1*re2 - im1*im2)/n;
        var dy = (re1*im2 + re2*im1)/n;
        var x = x0 + dx;
        var y = y0 + dy;
        var r = Math.sqrt(dx*dx+dy*dy);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";
        drawCircle(x0,y0,r);
        ctx.strokeStyle = "black";
        drawCircle(x0,y0,3);
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        drawArrow(x0,y0,x,y);
        x0 = x;
        y0 = y;
    }
    tail.push([x0,y0]);
    var m = 1000;
    if(tail.length>m) tail.splice(0,tail.length-m);
}

function draw() {
    
    if(targetCrv && targetCrv.length>2) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 5;
        drawCurve(targetCrv);
    }

    if(!stroking) drawEpicycles();

    if(tail && tail.length>2) {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        drawCurve(tail);
    }

}

/*
targetCrv = [];
var m = 20;
for(var i=0;i<m;i++) targetCrv.push([-200+400*i/(m-1), - 200]);
for(var i=0;i<m;i++) targetCrv.push([200,-200+400*i/(m-1)]);
for(var i=0;i<m;i++) targetCrv.push([200-400*i/(m-1), 200]);
for(var i=0;i<m;i++) targetCrv.push([-200,200-400*i/(m-1)]);
analyze(targetCrv);
*/

function invtransf(w) {
    var crv2 = [];
    var n = w.length;
    for(var i =0; i<n; i++) {
        var re = 0, im = 0;
        var phi = 2*Math.PI*i/n;
        for(var j=0; j<n ; j++) {
            var re1 = dft[j][0], im1 = dft[j][1];
            var re2 = Math.cos(phi*j), im2 = Math.sin(phi*j);
            var re3 = re1*re2 - im1*im2;
            var im3 = re1*im2 + re2*im1;
            re += re3;
            im += im3;
        }
        crv2.push([re/n, im/n]);
    }
    return crv2;
}