// Audio module for Find the Differences game
var DiffAudio = (function() {
    var audioCtx = null;

    function init() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function play(type) {
        if (!audioCtx) return;
        var n = audioCtx.currentTime;
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);

        if (type === 'find') {
            o.type = 'sine';
            o.frequency.setValueAtTime(523, n);
            o.frequency.setValueAtTime(659, n + 0.08);
            o.frequency.setValueAtTime(784, n + 0.16);
            g.gain.setValueAtTime(0.15, n);
            g.gain.exponentialRampToValueAtTime(0.001, n + 0.3);
            o.start(n);
            o.stop(n + 0.3);
        } else if (type === 'wrong') {
            o.type = 'sine';
            o.frequency.setValueAtTime(300, n);
            o.frequency.setValueAtTime(250, n + 0.1);
            g.gain.setValueAtTime(0.06, n);
            g.gain.exponentialRampToValueAtTime(0.001, n + 0.2);
            o.start(n);
            o.stop(n + 0.2);
        } else if (type === 'hint') {
            o.type = 'sine';
            o.frequency.setValueAtTime(880, n);
            g.gain.setValueAtTime(0.08, n);
            g.gain.exponentialRampToValueAtTime(0.001, n + 0.2);
            o.start(n);
            o.stop(n + 0.2);
        } else if (type === 'levelup') {
            [523, 659, 784, 1047].forEach(function(f, i) {
                var o2 = audioCtx.createOscillator();
                var g2 = audioCtx.createGain();
                o2.connect(g2);
                g2.connect(audioCtx.destination);
                o2.type = 'sine';
                o2.frequency.setValueAtTime(f, n + i * 0.12);
                g2.gain.setValueAtTime(0.12, n + i * 0.12);
                g2.gain.exponentialRampToValueAtTime(0.001, n + i * 0.12 + 0.18);
                o2.start(n + i * 0.12);
                o2.stop(n + i * 0.12 + 0.18);
            });
        } else if (type === 'win') {
            [523, 587, 659, 698, 784, 880, 988, 1047].forEach(function(f, i) {
                var o2 = audioCtx.createOscillator();
                var g2 = audioCtx.createGain();
                o2.connect(g2);
                g2.connect(audioCtx.destination);
                o2.type = 'sine';
                o2.frequency.setValueAtTime(f, n + i * 0.1);
                g2.gain.setValueAtTime(0.12, n + i * 0.1);
                g2.gain.exponentialRampToValueAtTime(0.001, n + i * 0.1 + 0.13);
                o2.start(n + i * 0.1);
                o2.stop(n + i * 0.1 + 0.13);
            });
        } else if (type === 'fail') {
            o.type = 'sine';
            o.frequency.setValueAtTime(400, n);
            o.frequency.setValueAtTime(300, n + 0.15);
            o.frequency.setValueAtTime(200, n + 0.3);
            g.gain.setValueAtTime(0.1, n);
            g.gain.exponentialRampToValueAtTime(0.001, n + 0.45);
            o.start(n);
            o.stop(n + 0.45);
        }
    }

    return { init: init, play: play };
})();
