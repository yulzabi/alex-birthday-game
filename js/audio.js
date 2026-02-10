/**
 * audio.js - מנוע סאונד למשחק
 * מייצר צלילים שמחים באמצעות Web Audio API
 */

var AudioManager = (function () {
    var ctx = null;

    /** אתחול AudioContext (חייב להיקרא אחרי אינטראקציה של המשתמש) */
    function init() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    /** נגן צליל לפי סוג */
    function play(type) {
        if (!ctx) return;
        var now = ctx.currentTime;

        if (type === 'collect') {
            // צליל איסוף - שלוש תווים עולים C5 → E5 → G5
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523, now);       // C5
            osc.frequency.setValueAtTime(659, now + 0.08); // E5
            osc.frequency.setValueAtTime(784, now + 0.16); // G5
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);

        } else if (type === 'levelup') {
            // צליל מעבר שלב - מנגינה עולה
            var osc2 = ctx.createOscillator();
            var gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'square';
            osc2.frequency.setValueAtTime(440, now);
            osc2.frequency.setValueAtTime(659, now + 0.15);
            osc2.frequency.setValueAtTime(880, now + 0.3);
            gain2.gain.setValueAtTime(0.1, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc2.start(now);
            osc2.stop(now + 0.5);

        } else if (type === 'win') {
            // צליל ניצחון - סולם שלם עולה!
            var notes = [523, 587, 659, 698, 784, 880, 988, 1047];
            notes.forEach(function (freq, i) {
                var osc3 = ctx.createOscillator();
                var gain3 = ctx.createGain();
                osc3.connect(gain3);
                gain3.connect(ctx.destination);
                osc3.type = 'sine';
                osc3.frequency.setValueAtTime(freq, now + i * 0.12);
                gain3.gain.setValueAtTime(0.12, now + i * 0.12);
                gain3.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.15);
                osc3.start(now + i * 0.12);
                osc3.stop(now + i * 0.12 + 0.15);
            });
        }
    }

    return { init: init, play: play };
})();
