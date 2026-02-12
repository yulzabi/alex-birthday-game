    (function() {
        "use strict";

        // תווים - C4 עד C5
        var NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        var NOTE_NAMES = ['דו', 'רה', 'מי', 'פה', 'סול', 'לה', 'סי', 'דו'];
        var KEYBOARD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8'];
        var ENCOURAGEMENTS = ['!יפה מאוד 🌟', '!מוזיקלית 🎉', '!כוכבת 🎵', '!מדהים 💖', '!נהדר 🏆', '!מלכת המוזיקה 👑'];

        // שירים - מערך של אינדקסי תווים
        var SONGS = {
            birthday: {
                name: '🎂 יום הולדת שמח',
                notes: [0,0,1,0,3,2, 0,0,1,0,4,3, 0,0,7,5,3,2,1, 6,6,5,3,4,3],
                durations: [0.3,0.3,0.6,0.6,0.6,1, 0.3,0.3,0.6,0.6,0.6,1, 0.3,0.3,0.6,0.6,0.6,0.6,1, 0.3,0.3,0.6,0.6,0.6,1]
            },
            twinkle: {
                name: '⭐ כוכב קטן',
                notes: [0,0,4,4,5,5,4, 3,3,2,2,1,1,0, 4,4,3,3,2,2,1, 4,4,3,3,2,2,1, 0,0,4,4,5,5,4, 3,3,2,2,1,1,0],
                durations: [0.4,0.4,0.4,0.4,0.4,0.4,0.8, 0.4,0.4,0.4,0.4,0.4,0.4,0.8, 0.4,0.4,0.4,0.4,0.4,0.4,0.8, 0.4,0.4,0.4,0.4,0.4,0.4,0.8, 0.4,0.4,0.4,0.4,0.4,0.4,0.8, 0.4,0.4,0.4,0.4,0.4,0.4,0.8]
            },
            mary: {
                name: '🐑 מרי והכבשה',
                notes: [2,1,0,1,2,2,2, 1,1,1, 2,4,4, 2,1,0,1,2,2,2, 2,1,1,2,1,0],
                durations: [0.4,0.4,0.4,0.4,0.4,0.4,0.8, 0.4,0.4,0.8, 0.4,0.4,0.8, 0.4,0.4,0.4,0.4,0.4,0.4,0.4, 0.4,0.4,0.4,0.4,0.4,0.8]
            }
        };

        var audioCtx = null;
        var currentMode = 'free';
        var followSequence = [];
        var followIndex = 0;
        var followPhase = 'listen'; // listen | play
        var isPlaying = false;
        var notesPlayed = 0;
        var lastEncTime = 0;

        // משתנים למצב שירים אינטראקטיבי
        var currentSong = null;
        var songNoteIndex = 0;
        var songActive = false;

        var introScreen = document.getElementById('intro-screen');
        var gameArea = document.getElementById('game-area');
        var piano = document.getElementById('piano');
        var keys = piano.querySelectorAll('.key');
        var messageEl = document.getElementById('message');
        var songsContainer = document.getElementById('songs-container');
        var songProgressEl = document.getElementById('song-progress');
        var songProgressFill = document.getElementById('song-progress-fill');
        var songProgressText = document.getElementById('song-progress-text');

        function initAudio() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        function playNote(noteIndex, duration) {
            if (!audioCtx) return;
            var now = audioCtx.currentTime;
            var dur = duration || 0.4;

            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(NOTES[noteIndex], now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.setValueAtTime(0.2, now + dur * 0.7);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
            osc.start(now);
            osc.stop(now + dur);

            // הוסף הרמוניה עדינה
            var osc2 = audioCtx.createOscillator();
            var gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(NOTES[noteIndex] * 2, now);
            gain2.gain.setValueAtTime(0.05, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.8);
            osc2.start(now);
            osc2.stop(now + dur);
        }

        function showSparkles(element) {
            var rect = element.getBoundingClientRect();
            var sparkles = ['✨', '🌟', '⭐', '💫', '🎵', '🎶'];
            for (var i = 0; i < 3; i++) {
                var s = document.createElement('div');
                s.className = 'sparkle';
                s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                s.style.fontSize = (Math.random() * 15 + 15) + 'px';
                s.style.left = (rect.left + Math.random() * rect.width) + 'px';
                s.style.top = (rect.top - 10 - Math.random() * 30) + 'px';
                document.body.appendChild(s);
                setTimeout(function(el) { el.remove(); }.bind(null, s), 800);
            }
        }

        function showEncouragement() {
            var now = Date.now();
            if (now - lastEncTime < 3000) return;
            lastEncTime = now;
            var el = document.getElementById('encourage');
            el.textContent = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
            el.classList.remove('show');
            void el.offsetWidth;
            el.classList.add('show');
        }

        function highlightKey(index, duration) {
            var key = keys[index];
            key.classList.add('highlight');
            key.classList.add('active');
            setTimeout(function() {
                key.classList.remove('highlight');
                key.classList.remove('active');
            }, (duration || 0.4) * 1000);
        }

        // === הסרת סימון מקש הבא ===
        function clearNextNote() {
            keys.forEach(function(k) { k.classList.remove('next-note'); });
        }

        // === סימון מקש הבא ===
        function markNextNote(noteIndex) {
            clearNextNote();
            keys[noteIndex].classList.add('next-note');
        }

        // === עדכון פס התקדמות שיר ===
        function updateSongProgress() {
            if (!currentSong) return;
            var total = currentSong.notes.length;
            var done = songNoteIndex;
            songProgressFill.style.width = (done / total * 100) + '%';
            songProgressText.textContent = done + '/' + total;
        }

        // === מצב חופשי ===
        function onKeyPress(noteIndex, keyEl) {
            playNote(noteIndex);
            highlightKey(noteIndex, 0.3);
            showSparkles(keyEl);
            notesPlayed++;

            if (notesPlayed % 8 === 0) {
                showEncouragement();
            }

            if (currentMode === 'follow' && followPhase === 'play') {
                checkFollowInput(noteIndex);
            }

            if (currentMode === 'songs' && songActive) {
                checkSongInput(noteIndex, keyEl);
            }
        }

        // === מצב חקי אותי ===
        function startFollowRound() {
            var len = Math.min(3 + Math.floor(followSequence.length / 3), 6);
            followSequence = [];
            for (var i = 0; i < len; i++) {
                followSequence.push(Math.floor(Math.random() * 8));
            }
            followIndex = 0;
            followPhase = 'listen';
            isPlaying = true;
            messageEl.textContent = '👀 הקשיבי ושימי לב...';

            // נגן את הרצף
            var delay = 0.5;
            followSequence.forEach(function(noteIdx, i) {
                setTimeout(function() {
                    playNote(noteIdx, 0.4);
                    highlightKey(noteIdx, 0.35);
                }, delay * 1000 + i * 600);
            });

            // אחרי שהרצף נגמר - תורך
            setTimeout(function() {
                followPhase = 'play';
                followIndex = 0;
                isPlaying = false;
                messageEl.textContent = '🎹 עכשיו את! חזרי על הרצף';
            }, delay * 1000 + followSequence.length * 600 + 300);
        }

        function checkFollowInput(noteIndex) {
            if (noteIndex === followSequence[followIndex]) {
                followIndex++;
                if (followIndex >= followSequence.length) {
                    // הצלחה!
                    messageEl.textContent = '🌟 מושלם! כל הכבוד! 🌟';
                    showEncouragement();
                    followPhase = 'listen';
                    setTimeout(startFollowRound, 2000);
                }
            } else {
                // טעות - נסי שוב
                messageEl.textContent = '🔄 לא נורא! ננסה שוב...';
                followPhase = 'listen';
                setTimeout(function() {
                    startFollowRound();
                }, 1500);
            }
        }

        // === מצב שירים - אינטראקטיבי ===
        function startSong(songKey) {
            var song = SONGS[songKey];
            if (!song) return;
            currentSong = song;
            songNoteIndex = 0;
            songActive = true;
            isPlaying = false;

            messageEl.textContent = '🎶 נגני: ' + song.name + ' - לחצי על המקש המואר!';
            songProgressEl.classList.add('visible');
            updateSongProgress();

            // סמני את התו הראשון
            markNextNote(song.notes[0]);
        }

        function checkSongInput(noteIndex, keyEl) {
            if (!currentSong || !songActive) return;

            var expectedNote = currentSong.notes[songNoteIndex];

            if (noteIndex === expectedNote) {
                // נכון! 🎉
                songNoteIndex++;
                updateSongProgress();

                // עידוד כל כמה תווים
                if (songNoteIndex % 6 === 0) {
                    showEncouragement();
                }

                if (songNoteIndex >= currentSong.notes.length) {
                    // סיימה את השיר!
                    songActive = false;
                    clearNextNote();
                    messageEl.textContent = '🌟 כל הכבוד! ניגנת את ' + currentSong.name + '! 🌟';
                    showEncouragement();
                    songProgressFill.style.width = '100%';

                    // נגן צליל ניצחון
                    if (audioCtx) {
                        var now = audioCtx.currentTime;
                        var winNotes = [523, 659, 784, 1047];
                        winNotes.forEach(function(freq, i) {
                            var o = audioCtx.createOscillator();
                            var g = audioCtx.createGain();
                            o.connect(g);
                            g.connect(audioCtx.destination);
                            o.type = 'sine';
                            o.frequency.setValueAtTime(freq, now + 0.3 + i * 0.15);
                            g.gain.setValueAtTime(0.12, now + 0.3 + i * 0.15);
                            g.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.15 + 0.25);
                            o.start(now + 0.3 + i * 0.15);
                            o.stop(now + 0.3 + i * 0.15 + 0.25);
                        });
                    }
                } else {
                    // סמני את התו הבא
                    markNextNote(currentSong.notes[songNoteIndex]);
                }
            } else {
                // לא נכון - רמז עדין: המקש הנכון מהבהב חזק יותר
                clearNextNote();
                keys[expectedNote].classList.add('next-note');
                // רטט עדין של המקש הלא-נכון
                keyEl.style.transition = 'transform 0.05s';
                keyEl.style.transform = 'translateX(-3px)';
                setTimeout(function() { keyEl.style.transform = 'translateX(3px)'; }, 50);
                setTimeout(function() { keyEl.style.transform = ''; keyEl.style.transition = ''; }, 100);
            }
        }

        function stopSong() {
            songActive = false;
            currentSong = null;
            songNoteIndex = 0;
            clearNextNote();
            songProgressEl.classList.remove('visible');
        }

        // === אירועים ===
        // לחיצה על קלידים
        keys.forEach(function(key) {
            function handlePress(e) {
                e.preventDefault();
                if (isPlaying) return;
                var noteIndex = parseInt(key.dataset.note);
                onKeyPress(noteIndex, key);
            }
            key.addEventListener('mousedown', handlePress);
            key.addEventListener('touchstart', handlePress, { passive: false });
        });

        // מקלדת
        document.addEventListener('keydown', function(e) {
            if (isPlaying) return;
            var idx = KEYBOARD_KEYS.indexOf(e.key);
            if (idx >= 0) {
                onKeyPress(idx, keys[idx]);
            }
        });

        // כפתורי מצב
        document.querySelectorAll('.mode-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentMode = btn.dataset.mode;
                isPlaying = false;

                stopSong();

                if (currentMode === 'free') {
                    messageEl.textContent = '🎹 לחצי על הקלידים!';
                    songsContainer.classList.remove('visible');
                } else if (currentMode === 'follow') {
                    songsContainer.classList.remove('visible');
                    startFollowRound();
                } else if (currentMode === 'songs') {
                    messageEl.textContent = '🎵 בחרי שיר לנגן!';
                    songsContainer.classList.add('visible');
                }
            });
        });

        // כפתורי שירים
        document.querySelectorAll('.song-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                stopSong();
                // סמן כפתור פעיל
                document.querySelectorAll('.song-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                startSong(btn.dataset.song);
            });
        });

        // התחלה
        function startGame() {
            initAudio();
            introScreen.style.display = 'none';
            gameArea.style.display = 'flex';
            currentMode = 'free';
            messageEl.textContent = '🎹 לחצי על הקלידים!';
        }

        introScreen.onclick = startGame;
    })();
