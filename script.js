const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

canvas.width = 800;
canvas.height = 450;

let score = 0;
let cameraX = 0;

const player = {
    x: 50, y: 300, w: 30, h: 30,
    vx: 0, vy: 0,
    speed: 4.5, jump: -13,
    grounded: false
};

const platforms = [
    { x: 0, y: 400, w: 2500, h: 50, type: 'ground' },
    { x: 300, y: 300, w: 120, h: 25, type: 'block' },
    { x: 500, y: 220, w: 120, h: 25, type: 'block' },
    { x: 750, y: 300, w: 150, h: 25, type: 'block' },
    { x: 1000, y: 200, w: 100, h: 25, type: 'block' },
    { x: 1250, y: 300, w: 200, h: 25, type: 'block' },
    { x: 1550, y: 200, w: 100, h: 25, type: 'block' }
];

const coins = [
    { x: 350, y: 260, w: 15, h: 15, active: true },
    { x: 550, y: 180, w: 15, h: 15, active: true },
    { x: 800, y: 260, w: 15, h: 15, active: true },
    { x: 1350, y: 260, w: 15, h: 15, active: true }
];

const enemies = [
    { x: 600, y: 368, w: 32, h: 32, speed: 2.5, range: 120, startX: 600 },
    { x: 1100, y: 368, w: 32, h: 32, speed: -2.5, range: 180, startX: 1100 },
    { x: 1600, y: 368, w: 32, h: 32, speed: 3, range: 100, startX: 1600 }
];

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function update() {
    if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -player.speed;
    else if (keys['ArrowRight'] || keys['KeyD']) player.vx = player.speed;
    else player.vx = 0;

    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.grounded) {
        player.vy = player.jump;
        player.grounded = false;
    }

    player.vy += 0.7;
    player.x += player.vx;
    player.y += player.vy;
    player.grounded = false;

    platforms.forEach(p => {
        if (player.x < p.x + p.w && player.x + player.w > p.x &&
            player.y < p.y + p.h && player.y + player.h > p.y) {
            if (player.vy > 0 && player.y + player.h - player.vy <= p.y) {
                player.y = p.y - player.h;
                player.vy = 0;
                player.grounded = true;
            }
        }
    });

    coins.forEach(c => {
        if (c.active && player.x < c.x + c.w && player.x + player.w > c.x &&
            player.y < c.y + c.h && player.y + player.h > c.y) {
            c.active = false;
            score += 10;
            scoreEl.innerText = score;
        }
    });

    enemies.forEach(e => {
        e.x += e.speed;
        if (Math.abs(e.x - e.startX) > e.range) e.speed *= -1;

        if (player.x < e.x + e.w && player.x + player.w > e.x &&
            player.y < e.y + e.h && player.y + player.h > e.y) {
            if (player.vy > 0 && player.y + player.h < e.y + 15) {
                e.x = -2000;
                player.vy = -10;
                score += 50;
                scoreEl.innerText = score;
            } else {
                player.x = 50;
                player.y = 300;
                score = Math.max(0, score - 20);
                scoreEl.innerText = score;
            }
        }
    });

    if (player.x > 350) cameraX = player.x - 350;
    
    if (player.y > canvas.height) {
        player.x = 50;
        player.y = 300;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-cameraX, 0);

    platforms.forEach(p => {
        ctx.fillStyle = p.type === 'ground' ? '#795548' : '#e67e22';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        if(p.type === 'ground') {
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(p.x, p.y, p.w, 12);
        }
    });

    ctx.fillStyle = '#f1c40f';
    coins.forEach(c => {
        if (c.active) {
            ctx.beginPath();
            ctx.arc(c.x + c.w/2, c.y + c.h/2, c.w/2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    ctx.fillStyle = '#c0392b';
    enemies.forEach(e => {
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(e.x + 5, e.y + 5, 8, 8);
        ctx.fillRect(e.x + 20, e.y + 5, 8, 8);
        ctx.fillStyle = '#c0392b';
    });

    ctx.fillStyle = '#ecf0f1';
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 3;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.strokeRect(player.x, player.y, player.w, player.h);

    ctx.restore();
}

update();
