const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let width, height;

function mainLoop() {
    width = canvas.width;
    height = canvas.height;
    ctx.clearRect(0,0,width,height);
    draw();
    requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);


function draw() {
    var x0 = width*0.25;
    var x1 = width-x0;
    var y = height/2;

    var time = performance.now() * 0.0001;
    time = 2.0*(time - Math.floor(time));
    if(time>1) time = 2-time;
    let w = time * 15;
    let L = Math.floor(w);
    let t = w - L;
    drago(x0,y,x1,y,L, t);
}


function drago(x0,y0,x1,y1,level, t) {
    if(level==0) {
        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.lineTo(x1,y1);
        ctx.stroke();
    }
    else
    {
        let s = level>1 ? 1 : t;
        let xm = (x0+x1)/2;
        let ym = (y0+y1)/2;
        let dx = xm-x0;
        let dy = ym-y0;
        let x2 = xm-dy*s, y2 = ym+dx*s;
        drago(x0,y0,x2,y2,level-1,t);
        drago(x1,y1,x2,y2,level-1,t);
    }
}

