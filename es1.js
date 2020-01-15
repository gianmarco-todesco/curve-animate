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


function draw() {

    let t = performance.now()*0.001;
    let x = Math.cos(t) * 100;
    let y = Math.sin(t) * 100;
    
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x,y);
    ctx.stroke();

}

