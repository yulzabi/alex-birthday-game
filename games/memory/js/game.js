    (function() {
        "use strict";

        var EMOJIS = ['🎂', '🦋', '👑', '🌈', '💖', '⭐', '🎁', '🍭', '🧁', '🎈', '🦄', '🌸'];
        var LEVELS = [
            { pairs: 4, cols: 4 },  // שלב 1: 8 קלפים (4x2)
            { pairs: 6, cols: 4 },  // שלב 2: 12 קלפים (4x3) 
            { pairs: 8, cols: 4 },  // שלב 3: 16 קלפים (4x4)
        ];
        var ENCOURAGEMENTS = ['!כל הכבוד 🌟', '!מדהים 🎉', '!כוכבת ✨', '!יופי 💖', '!סחטיין 🏆', '!מלכה 👑'];
        var COLORS = ['#FF6FB7', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FFD700'];

        var audioCtx = null;
        var currentLevel = 0;
        var pairsFound = 0;
        var flippedCards = [];
        var lockBoard = false;
        var lastEncTime = 0;

        var introScreen = document.getElementById('intro-screen');
        var winScreen = document.getElementById('win-screen');
        var gameArea = document.getElementById('game-area');
        var board = document.getElementById('board');
        var pairsFoundEl = document.getElementById('pairs-found');
        var pairsTotalEl = document.getElementById('pairs-total');
        var levelEl = document.getElementById('level');

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playSound(type) {
            if (!audioCtx) return;
            var now = audioCtx.currentTime;
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'flip') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'match') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(784, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'wrong') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.setValueAtTime(250, now + 0.1);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else if (type === 'levelup') {
                var notes = [523, 659, 784, 1047];
                notes.forEach(function(freq, i) {
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
                var notes2 = [523, 587, 659, 698, 784, 880, 988, 1047];
                notes2.forEach(function(freq, i) {
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

        function shuffle(arr) {
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            return arr;
        }

        function showEncouragement() {
            var now = Date.now();
            if (now - lastEncTime < 2000) return;
            lastEncTime = now;
            var el = document.getElementById('encourage');
            el.textContent = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
            el.classList.remove('show');
            void el.offsetWidth;
            el.classList.add('show');
        }

        function showLevelMessage(text) {
            var el = document.getElementById('level-msg');
            el.textContent = text;
            el.classList.remove('show');
            void el.offsetWidth;
            el.classList.add('show');
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

        function createBoard() {
            board.innerHTML = '';
            var lvl = LEVELS[currentLevel];
            pairsFound = 0;
            flippedCards = [];
            lockBoard = false;

            // בחר אמוג'ים אקראיים
            var shuffledEmojis = shuffle(EMOJIS.slice());
            var selected = shuffledEmojis.slice(0, lvl.pairs);
            var cards = shuffle(selected.concat(selected));

            board.className = 'board level-' + (currentLevel + 1);

            pairsTotalEl.textContent = lvl.pairs;
            pairsFoundEl.textContent = '0';
            levelEl.textContent = (currentLevel + 1);

            cards.forEach(function(emoji) {
                var card = document.createElement('div');
                card.className = 'card';
                card.dataset.emoji = emoji;

                var back = document.createElement('div');
                back.className = 'card-face card-back';
                back.textContent = '❓';

                var front = document.createElement('div');
                front.className = 'card-face card-front';
                front.textContent = emoji;

                card.appendChild(back);
                card.appendChild(front);

                card.addEventListener('click', onCardClick);
                card.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    onCardClick({ currentTarget: card });
                }, { passive: false });

                board.appendChild(card);
            });
        }

        function onCardClick(e) {
            if (lockBoard) return;
            var card = e.currentTarget;
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

            playSound('flip');
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                lockBoard = true;
                var c1 = flippedCards[0];
                var c2 = flippedCards[1];

                if (c1.dataset.emoji === c2.dataset.emoji) {
                    // מצאנו זוג!
                    setTimeout(function() {
                        c1.classList.add('matched');
                        c2.classList.add('matched');
                        pairsFound++;
                        pairsFoundEl.textContent = pairsFound;
                        playSound('match');
                        showEncouragement();

                        flippedCards = [];
                        lockBoard = false;

                        // בדיקת סיום שלב
                        if (pairsFound >= LEVELS[currentLevel].pairs) {
                            if (currentLevel < LEVELS.length - 1) {
                                // מעבר שלב
                                currentLevel++;
                                playSound('levelup');
                                showLevelMessage('🌟 שלב ' + (currentLevel + 1) + '! 🌟');
                                setTimeout(createBoard, 1500);
                            } else {
                                // ניצחון!
                                playSound('win');
                                setTimeout(function() {
                                    gameArea.style.display = 'none';
                                    winScreen.style.display = 'flex';
                                    addWinConfetti();
                                }, 800);
                            }
                        }
                    }, 400);
                } else {
                    // לא מתאים - הפוך בחזרה
                    setTimeout(function() {
                        playSound('wrong');
                        c1.classList.remove('flipped');
                        c2.classList.remove('flipped');
                        flippedCards = [];
                        lockBoard = false;
                    }, 800);
                }
            }
        }

        function startGame() {
            initAudio();
            introScreen.style.display = 'none';
            winScreen.style.display = 'none';
            gameArea.style.display = 'block';
            currentLevel = 0;
            createBoard();
        }

        introScreen.onclick = startGame;
        winScreen.onclick = startGame;
    })();
