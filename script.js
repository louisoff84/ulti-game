const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentLang = 'fr';
let isAdmin = false;
let gameActive = false;

const i18n = {
    fr: {
        title: "PLATFORMER 2D ULTIMATE",
        login: "Connexion",
        noAcc: "Créer un compte",
        reg: "S'inscrire",
        haveAcc: "Déjà inscrit ?",
        score: "SCORE",
        lead: "CLASSEMENT",
        admin: "PANNEAU ADMIN"
    },
    en: {
        title: "PLATFORMER 2D ULTIMATE",
        login: "Login",
        noAcc: "Create Account",
        reg: "Register",
        haveAcc: "Already have an account?",
        score: "SCORE",
        lead: "LEADERBOARD",
        admin: "ADMIN PANEL"
    }
};

function setLang(lang) {
    currentLang = lang;
    document.getElementById('t-title').innerText = i18n[lang].title;
    document.getElementById('t-login-btn').innerText = i18n[lang].login;
    document.getElementById('t-no-account').innerText = i18n[lang].noAcc;
    document.getElementById('t-reg-btn').innerText = i18n[lang].reg;
    document.getElementById('t-have-account').innerText = i18n[lang].haveAcc;
    document.getElementById('t-score-label').innerText = i18n[lang].score;
    document.getElementById('t-lead-title').innerText = i18n[lang].lead;
    document.getElementById('t-admin-title').innerText = i18n[lang].admin;
}

function toggleAuth() {
    const lp = document.getElementById('login-panel');
    const rp = document.getElementById('register-panel');
    lp.style.display = lp.style.display === 'none' ? 'block' : 'none';
    rp.style.display = rp.style.display === 'none' ? 'block' : 'none';
}

function login() {
    const user = document.getElementById('user-input').value;
    if (user.toLowerCase() === 'admin') {
        isAdmin = true;
        document.getElementById('admin-btn').style.display = 'block';
    }
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    gameActive = true;
    update();
}

const player = { x: 100, y: 0, w: 32, h: 32, vx: 0, vy: 0, speed: 6, jump: -15, grounded: false };
const keys = {};

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Enter' && gameActive) {
        handleChat();
    }
});
window.addEventListener('keyup', e => keys[e.code] = false);

function handleChat() {
    const input = document.getElementById('chat-input');
    if (input.value.trim() !== "") {
        const msg = document.createElement('div');
        msg.innerHTML = `<b>${isAdmin ? '[ADMIN]' : 'User'}:</b> ${input.value}`;
        document.getElementById('messages').appendChild(msg);
        input.value = "";
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    }
}

function openAdmin() { document.getElementById('admin-panel').style.display = 'flex'; }
function closeAdmin() { document.getElementById('admin-panel').style.display = 'none'; }

function update() {
    if (!gameActive) return;

    if (keys['ArrowLeft'] || keys['KeyA']) player.vx = -player.speed;
    else if (keys['ArrowRight'] || keys['KeyD']) player.vx = player.speed;
    else player.vx *= 0.8;

    if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.grounded) {
        player.vy = player.jump;
        player.grounded = false;
    }

    player.vy += 0.8;
    player.x += player.vx;
    player.y += player.vy;

    const groundLevel = canvas.height - 40;
    if (player.y + player.h > groundLevel) {
        player.y = groundLevel - player.h;
        player.vy = 0;
        player.grounded = true;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

setLang('fr');