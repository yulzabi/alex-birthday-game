/**
 * game.js - לוגיקת המשחק
 * ניהול שחקן, פריטים, התנגשויות ושלבים
 */

var Game = (function () {
    // מצב המשחק
    var state = {
        started: false,
        won: false,
        score: 0,
        level: 1,
        itemsCollected: 0,
        totalCollected: 0,
    };

    // השחקן
    var player = {
        x: 0,
        y: 0,
        size: 50,
        speed: 5,
        emoji: '👧',
        bobOffset: 0,
        imageLoaded: false,
        image: null,
        trail: [],
    };

    // ניסיון לטעון תמונת שחקן
    var playerImg = new Image();
    playerImg.onload = function () {
        player.imageLoaded = true;
        player.image = playerImg;
    };
    playerImg.onerror = function () {
        player.imageLoaded = false;
    };
    playerImg.src = 'images/alex.jpg';

    // רשימות אובייקטים
    var items = [];
    var clouds = [];
    var sparks = [];

    // זמן עידוד אחרון
    var lastEncouragement = 0;

    // ממדי מסך
    var W = window.innerWidth;
    var H = window.innerHeight;

    /** עדכון ממדי מסך */
    function setSize(w, h) {
        W = w;
        H = h;
    }

    /** אתחול משחק חדש */
    function init() {
        state.score = 0;
        state.level = 1;
        state.itemsCollected = 0;
        state.totalCollected = 0;
        state.started = true;
        state.won = false;

        player.x = W / 2;
        player.y = H / 2;
        player.trail = [];
        player.bobOffset = 0;

        // גודל שחקן מותאם למסך
        player.size = Math.max(45, Math.min(75, Math.min(W, H) * 0.09));
        player.speed = Math.max(3, player.size * 0.12);

        items = [];
        clouds = [];
        sparks = [];

        // יצירת עננים
        for (var i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * W,
                y: Math.random() * H * 0.3 + 60,
                size: Math.random() * 30 + 25,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.3 + 0.2,
            });
        }

        spawnItems();
        updateHUD();
    }

    /** פיזור פריטים חדשים על המסך */
    function spawnItems() {
        items = [];
        var margin = 60;
        var hudHeight = 80;

        for (var i = 0; i < Config.ITEMS_PER_LEVEL; i++) {
            var type = Config.ITEM_TYPES[Math.floor(Math.random() * Config.ITEM_TYPES.length)];
            var x, y, overlap, attempts = 0;

            do {
                x = Math.random() * (W - margin * 2) + margin;
                y = Math.random() * (H - margin * 2 - hudHeight) + margin + hudHeight;
                overlap = false;

                for (var j = 0; j < items.length; j++) {
                    var dx = items[j].x - x;
                    var dy = items[j].y - y;
                    if (Math.sqrt(dx * dx + dy * dy) < 50) {
                        overlap = true;
                        break;
                    }
                }
                attempts++;
            } while (overlap && attempts < 50);

            items.push({
                x: x,
                y: y,
                type: type,
                size: Math.random() * 10 + 28,
                bobOffset: Math.random() * Math.PI * 2,
                bobSpeed: Math.random() * 0.02 + 0.02,
                collected: false,
                collectAnim: 0,
            });
        }
    }

    /** עדכון HUD */
    function updateHUD() {
        document.getElementById('sc').textContent = state.score;
        document.getElementById('pb').style.width =
            (state.totalCollected / Config.TOTAL_ITEMS * 100) + '%';
        document.getElementById('lv').textContent = '🎁 שלב ' + state.level;
    }

    /** הצגת הודעת עידוד */
    function showEncouragement() {
        var now = Date.now();
        if (now - lastEncouragement < 2500) return;
        lastEncouragement = now;

        var el = document.getElementById('enc');
        var msgs = Config.ENCOURAGEMENTS;
        el.textContent = msgs[Math.floor(Math.random() * msgs.length)];
        el.classList.remove('show');
        void el.offsetWidth; // reflow
        el.classList.add('show');
    }

    /** הצגת ניקוד צף */
    function showFloatScore(x, y, points) {
        var el = document.createElement('div');
        el.className = 'fs';
        el.textContent = '+' + points;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 1000);
    }

    /** עדכון לוגיקת המשחק (נקרא כל פריים) */
    function update(inputDx, inputDy) {
        if (!state.started || state.won) return;

        // תנועת שחקן
        var dx = inputDx;
        var dy = inputDy;
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }

        player.x += dx * player.speed;
        player.y += dy * player.speed;

        // גבולות מסך
        player.x = Math.max(player.size / 2, Math.min(W - player.size / 2, player.x));
        player.y = Math.max(player.size / 2 + 55, Math.min(H - player.size / 2, player.y));

        // אנימציית קפיצה
        player.bobOffset += 0.05;

        // שובל תנועה
        if (dx !== 0 || dy !== 0) {
            player.trail.push({ x: player.x, y: player.y, life: 1 });
            if (player.trail.length > 12) player.trail.shift();
        }
        for (var t = player.trail.length - 1; t >= 0; t--) {
            player.trail[t].life -= 0.04;
            if (player.trail[t].life <= 0) player.trail.splice(t, 1);
        }

        // בדיקת התנגשויות עם פריטים
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.collected) continue;

            var ddx = player.x - item.x;
            var ddy = player.y - item.y;
            var dist = Math.sqrt(ddx * ddx + ddy * ddy);

            if (dist < player.size / 2 + item.size / 2 + 5) {
                // איסוף!
                item.collected = true;
                item.collectAnim = 1;
                state.score += item.type.points;
                state.itemsCollected++;
                state.totalCollected++;

                updateHUD();
                AudioManager.play('collect');
                showFloatScore(item.x, item.y - 25, item.type.points);

                // ניצוצות
                for (var s = 0; s < 6; s++) {
                    sparks.push({
                        x: item.x,
                        y: item.y,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 0.5) * 5,
                        life: 1,
                        color: Config.COLORS[s % Config.COLORS.length],
                        size: Math.random() * 4 + 2,
                    });
                }

                // הודעת עידוד כל 3 פריטים
                if (state.itemsCollected % 3 === 0) {
                    showEncouragement();
                }

                // בדיקת סיום שלב
                if (state.itemsCollected >= Config.ITEMS_PER_LEVEL) {
                    if (state.level < Config.TOTAL_LEVELS) {
                        state.level++;
                        state.itemsCollected = 0;
                        updateHUD();
                        AudioManager.play('levelup');
                        showEncouragement();
                        setTimeout(spawnItems, 400);
                    } else {
                        // ניצחון!
                        state.won = true;
                        AudioManager.play('win');
                    }
                }
            }
        }

        // עדכון אנימציות פריטים
        for (var j = items.length - 1; j >= 0; j--) {
            items[j].bobOffset += items[j].bobSpeed;
            if (items[j].collected) {
                items[j].collectAnim -= 0.05;
                if (items[j].collectAnim <= 0) items.splice(j, 1);
            }
        }

        // עדכון ניצוצות
        for (var k = sparks.length - 1; k >= 0; k--) {
            sparks[k].x += sparks[k].vx;
            sparks[k].y += sparks[k].vy;
            sparks[k].life -= 0.03;
            if (sparks[k].life <= 0) sparks.splice(k, 1);
        }

        // עדכון עננים
        for (var c = 0; c < clouds.length; c++) {
            clouds[c].x += clouds[c].speed;
            if (clouds[c].x > W + 50) clouds[c].x = -50;
        }
    }

    // חשיפת API
    return {
        state: state,
        player: player,
        items: items,
        clouds: clouds,
        sparks: sparks,
        init: init,
        update: update,
        setSize: setSize,
        getItems: function () { return items; },
        getClouds: function () { return clouds; },
        getSparks: function () { return sparks; },
    };
})();
