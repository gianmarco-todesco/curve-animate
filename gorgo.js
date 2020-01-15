const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let width, height;
let mousex, mousey,mousein=false;

canvas.addEventListener('mousemove', e=>{
    mousex=e.offsetX - width/2;
    mousey=e.offsetY - width/2;
    mousein = true;
});
canvas.addEventListener('mouseleave',e=> { mousein = false;});

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


function drawDeformedLine(x0,y0, x1,y1) {
    const n = 100;
    ctx.beginPath();
    var p = deform(x0,y0);
    ctx.moveTo(p[0],p[1]);
    for(var i=1;i<=n;i++) {
        const t = i/n;
        p = deform(x0*(1-t)+x1*t,y0*(1-t)+y1*t);
        ctx.lineTo(p[0],p[1]);
    }
    ctx.stroke();

    if(mousein) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(mousex,mousey,5,0,Math.PI*2);
        ctx.fill();    
    }
}

function draw() {
    const r = height * 0.9 * 0.5;
    var m = 10;
    for(var i=0; i<m; i++) {
        var c = -r + 2*r*i/(m-1);
        drawDeformedLine(-r,c,r,c);
        drawDeformedLine(c,-r,c,r);        
    }
}

function deform(x,y) {
    let x1 = x-mousex;
    let y1 = y-mousey;
    let r = Math.sqrt(x1*x1+y1*y1);

    const phi = 0.5*Math.PI*Math.exp(-r*r*0.0001);
    
    const cs = Math.cos(phi), sn = Math.sin(phi);
    let x2 = x1*cs - y1*sn;
    let y2 = x1*sn + y1*cs;


    return [ mousex + x2, mousey + y2]
    
    /*
    if(!mousein) return [x,y];
    
    
    return [mousex+x1*cs-y1*sn, mousey+x1*sn+y1*cs];
    */
}

