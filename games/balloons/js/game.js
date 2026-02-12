    (function() {
        "use strict";

        var BALLOON_EMOJIS = ['🎈', '🟡', '🔴', '🔵', '🟢', '🟣', '🟠'];
        var SPECIAL_EMOJIS = ['⭐', '👑', '💎', '🌟'];
        var ENCOURAGEMENTS = ['!כל הכבוד 🌟', '!מדהים 🎉', '!כוכבת ✨', '!יופי 💖', '!סחטיין 🏆', '!מלכה 👑', '!וואו 🤩'];
        var COLORS = ['#FF6FB7', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FFD700'];

        var LEVELS = [
            { balloonsNeeded: 12, speed: 1.0, spawnRate: 1300, specialChance: 0.1 },
            { balloonsNeeded: 15, speed: 1.3, spawnRate: 1100, specialChance: 0.12 },
            { balloonsNeeded: 18, speed: 1.6, spawnRate: 900, specialChance: 0.15 },
            { balloonsNeeded: 20, speed: 2.0, spawnRate: 750, specialChance: 0.18 },
            { balloonsNeeded: 25, speed: 2.4, spawnRate: 600, specialChance: 0.22 },
        ];
        var TOTAL_BALLOONS = 90; // 12+15+18+20+25

        var audioCtx = null;
        var score = 0;
        var popped = 0;
        var totalPopped = 0;
        var currentLevel = 0;
        var gameRunning = false;
        var spawnInterval = null;
        var balloons = [];
        var animFrame = null;
        var lastEncTime = 0;

        var introScreen = document.getElementById('intro-screen');
        var winScreen = document.getElementById('win-screen');
        var hud = document.getElementById('hud');
        var scoreEl = document.getElementById('score');
        var progressBar = document.getElementById('progress-bar');
        var levelDisplay = document.getElementById('level-display');

        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        function playSound(type) {
            if (!audioCtx) return;
            var now = audioCtx.currentTime;

            if (type === 'pop') {
                var osc = audioCtx.createOscillator();
                var gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'special') {
                var notes = [784, 988, 1175];
                notes.forEach(function(freq, i) {
                    var o = audioCtx.createOscillator();
                    var g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, now + i * 0.08);
                    g.gain.setValueAtTime(0.12, now + i * 0.08);
                    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
                    o.start(now + i * 0.08);
                    o.stop(now + i * 0.08 + 0.15);
                });
            } else if (type === 'levelup') {
                var notes2 = [523, 659, 784, 1047];
                notes2.forEach(function(freq, i) {
                    var o = audioCtx.createOscillator();
                    var g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, now + i * 0.15);
                    g.gain.setValueAtTime(0.12, now + i * 0.15);
                    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.2);
                    o.start(now + i * 0.15);
                    o.stop(now + i * 0.15 + 0.2);
                });
            } else if (type === 'win') {
                var notes3 = [523, 587, 659, 698, 784, 880, 988, 1047];
                notes3.forEach(function(freq, i) {
                    var o = audioCtx.createOscillator();
                    var g = audioCtx.createGain();
                    o.connect(g);
                    g.connect(audioCtx.destination);
                    o.type = 'sine';
                    o.frequency.setValueAtTime(freq, now + i * 0.12);
                    g.gain.setValueAtTime(0.12, now + i * 0.12);
                    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
                    o.start(now + i * 0.12);
                    o.stop(now + i * 0.12 + 0.15);
                });
            }
        }

        function showEncouragement() {
            var now = Date.now();
            if (now - lastEncTime < 2500) return;
            lastEncTime = now;
            var el = document.getElementById('encourage');
            el.textContent = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
            el.classList.remove('show');
            void el.offsetWidth;
            el.classList.add('show');
        }

        function showFloatScore(x, y, points) {
            var el = document.createElement('div');
            el.className = 'float-score';
            el.textContent = '+' + points;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            document.body.appendChild(el);
            setTimeout(function() { el.remove(); }, 1000);
        }

        function showPopEffect(x, y, emoji) {
            var el = document.createElement('div');
            el.className = 'pop-effect';
            el.textContent = '💥';
            el.style.left = (x - 20) + 'px';
            el.style.top = (y - 20) + 'px';
            el.style.fontSize = '2.5rem';
            document.body.appendChild(el);
            setTimeout(function() { el.remove(); }, 600);
        }

        function updateHUD() {
            scoreEl.textContent = score;
            progressBar.style.width = (totalPopped / TOTAL_BALLOONS * 100) + '%';
            levelDisplay.textContent = '🌟 שלב ' + (currentLevel + 1);
        }

        function addWinConfetti() {
            for (var i = 0; i < 40; i++) {
                var div = document.createElement('div');
                div.className = 'cf';
                div.style.left = Math.random() * 100 + '%';
                div.style.background = COLORS[i % COLORS.length];
                div.style.width = (Math.random() * 10 + 5) + 'px';
                div.style.height = (Math.random() * 10 + 5) + 'px';
                div.style.animationDuration = (Math.random() * 3 + 2) + 's';
                div.style.animationDelay = (Math.random() * 2) + 's';
                winScreen.appendChild(div);
            }
        }

        function spawnBalloon() {
            if (!gameRunning) return;
            var lvl = LEVELS[currentLevel];
            var W = window.innerWidth;
            var isSpecial = Math.random() < lvl.specialChance;

            var emoji, points, size;
            if (isSpecial) {
                emoji = SPECIAL_EMOJIS[Math.floor(Math.random() * SPECIAL_EMOJIS.length)];
                points = 20;
                size = Math.random() * 15 + 55;
            } else {
                emoji = BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];
                points = 10;
                size = Math.random() * 15 + 40;
            }

            var el = document.createElement('div');
            el.className = 'game-balloon';
            el.textContent = emoji;
            el.style.fontSize = size + 'px';
            el.style.left = (Math.random() * (W - 80) + 20) + 'px';
            el.style.top = (window.innerHeight + 50) + 'px';

            var balloon = {
                el: el,
                x: parseFloat(el.style.left),
                y: window.innerHeight + 50,
                speed: lvl.speed * (0.7 + Math.random() * 0.6),
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.02 + Math.random() * 0.02,
                wobbleAmount: 1 + Math.random() * 1.5,
                points: points,
                isSpecial: isSpecial,
            };

            function onPop(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!gameRunning) return;

                var rect = el.getBoundingClientRect();
                var cx = rect.left + rect.width / 2;
                var cy = rect.top + rect.height / 2;

                showPopEffect(cx, cy, emoji);
                showFloatScore(cx, cy - 20, balloon.points);

                if (isSpecial) {
                    playSound('special');
                } else {
                    playSound('pop');
                }

                score += balloon.points;
                popped++;
                totalPopped++;
                updateHUD();

                // הודעת עידוד כל 5 בלונים
                if (popped % 5 === 0) {
                    showEncouragement();
                }

                el.remove();
                var idx = balloons.indexOf(balloon);
                if (idx > -1) balloons.splice(idx, 1);

                // בדיקת סיום שלב
                if (popped >= lvl.balloonsNeeded) {
                    if (currentLevel < LEVELS.length - 1) {
                        currentLevel++;
                        popped = 0;
                        updateHUD();
                        playSound('levelup');
                        showEncouragement();
                        clearInterval(spawnInterval);
                        spawnInterval = setInterval(spawnBalloon, LEVELS[currentLevel].spawnRate);
                    } else {
                        // ניצחון!
                        gameRunning = false;
                        clearInterval(spawnInterval);
                        playSound('win');
                        setTimeout(function() {
                            // הסר בלונים שנשארו
                            balloons.forEach(function(b) { b.el.remove(); });
                            balloons = [];
                            hud.style.display = 'none';
                            winScreen.style.display = 'flex';
                            addWinConfetti();
                        }, 600);
                    }
                }
            }

            el.addEventListener('click', onPop);
            el.addEventListener('touchstart', onPop, { passive: false });

            document.body.appendChild(el);
            balloons.push(balloon);
        }

        function updateBalloons() {
            if (!gameRunning) return;

            for (var i = balloons.length - 1; i >= 0; i--) {
                var b = balloons[i];
                b.y -= b.speed;
                b.wobble += b.wobbleSpeed;
                var wobbleX = Math.sin(b.wobble) * b.wobbleAmount;

                b.el.style.top = b.y + 'px';
                b.el.style.transform = 'translateX(' + wobbleX + 'px)';

                // הסר בלונים שיצאו מהמסך למעלה
                if (b.y < -80) {
                    b.el.remove();
                    balloons.splice(i, 1);
                }
            }

            animFrame = requestAnimationFrame(updateBalloons);
        }

        function startGame() {
            initAudio();
            introScreen.style.display = 'none';
            winScreen.style.display = 'none';
            hud.style.display = 'flex';

            // ניקוי בלונים ישנים
            balloons.forEach(function(b) { b.el.remove(); });
            balloons = [];

            score = 0;
            popped = 0;
            totalPopped = 0;
            currentLevel = 0;
            gameRunning = true;
            updateHUD();

            clearInterval(spawnInterval);
            spawnInterval = setInterval(spawnBalloon, LEVELS[currentLevel].spawnRate);

            if (animFrame) cancelAnimationFrame(animFrame);
            updateBalloons();
        }

        introScreen.onclick = startGame;
        winScreen.onclick = startGame;
    })();
