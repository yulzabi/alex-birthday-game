/**
 * main.js - קובץ ראשי
 * מחבר את כל המודולים ומריץ את לולאת המשחק
 */

(function () {
    "use strict";

    var canvas = document.getElementById('cv');
    var introEl = document.getElementById('intro');
    var winEl = document.getElementById('win');
    var hudEl = document.getElementById('hud');
    var mcEl = document.getElementById('mc');
    var backBtn = document.querySelector('.back-btn');

    var W, H;

    /** התאמת גודל הקנבס למסך */
    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        Game.setSize(W, H);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // אתחול בקרים
    Controls.initKeyboard();
    Controls.initMobileButtons();

    /** התחלת המשחק (נקרא מלחיצה על מסך הפתיחה) */
    function startGame() {
        AudioManager.init();

        introEl.style.display = 'none';
        winEl.style.display = 'none';
        hudEl.style.display = 'flex';
        if (backBtn) backBtn.style.display = 'block';

        // הצגת כפתורי מגע במכשירי מגע
        if ('ontouchstart' in window) {
            mcEl.style.display = 'block';
        }

        Game.init();
    }

    /** הצגת מסך ניצחון */
    function showWinScreen() {
        winEl.style.display = 'flex';
        hudEl.style.display = 'none';
        mcEl.style.display = 'none';
        Intro.addWinConfetti(winEl);
    }

    // לחיצה על מסך פתיחה / ניצחון
    introEl.onclick = startGame;
    winEl.onclick = startGame;

    /** לולאת המשחק הראשית */
    function gameLoop() {
        // קבלת כיוון מהבקרים
        var dir = Controls.getDirection();

        // עדכון לוגיקה
        Game.update(dir.x, dir.y);

        // בדיקה אם ניצחנו
        if (Game.state.won) {
            setTimeout(showWinScreen, 400);
            Game.state.won = false; // מניעת קריאה כפולה
            Game.state.started = false;
        }

        // ציור
        Renderer.render(W, H);

        requestAnimationFrame(gameLoop);
    }

    // הפעלת לולאת המשחק
    gameLoop();
})();
