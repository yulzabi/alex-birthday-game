/**
 * intro.js - קישוטי מסך הפתיחה
 * יוצר קונפטי ובלונים אנימטיביים
 */

var Intro = (function () {
    var introEl = document.getElementById('intro');

    /** יצירת חלקיקי קונפטי */
    function createConfetti() {
        for (var i = 0; i < 30; i++) {
            var div = document.createElement('div');
            div.className = 'cf';
            div.style.cssText =
                'left:' + Math.random() * 100 + '%;' +
                'background:' + Config.COLORS[i % Config.COLORS.length] + ';' +
                'width:' + (Math.random() * 10 + 5) + 'px;' +
                'height:' + (Math.random() * 10 + 5) + 'px;' +
                'animation-duration:' + (Math.random() * 3 + 2) + 's;' +
                'animation-delay:' + (Math.random() * 3) + 's';
            introEl.appendChild(div);
        }
    }

    /** יצירת בלונים עפים */
    function createBalloons() {
        var emojis = ['🎈', '💖', '⭐', '🎁'];
        for (var i = 0; i < 8; i++) {
            var div = document.createElement('div');
            div.className = 'bl';
            div.textContent = emojis[i % emojis.length];
            div.style.cssText =
                'left:' + Math.random() * 90 + '%;' +
                'font-size:' + (Math.random() * 20 + 30) + 'px;' +
                'animation-duration:' + (Math.random() * 5 + 4) + 's;' +
                'animation-delay:' + (Math.random() * 5) + 's';
            introEl.appendChild(div);
        }
    }

    /** הוספת קונפטי למסך הניצחון */
    function addWinConfetti(winEl) {
        for (var i = 0; i < 40; i++) {
            var div = document.createElement('div');
            div.className = 'cf';
            div.style.cssText =
                'left:' + Math.random() * 100 + '%;' +
                'background:' + Config.COLORS[i % Config.COLORS.length] + ';' +
                'width:' + (Math.random() * 10 + 5) + 'px;' +
                'height:' + (Math.random() * 10 + 5) + 'px;' +
                'animation-duration:' + (Math.random() * 3 + 2) + 's;' +
                'animation-delay:' + (Math.random() * 2) + 's';
            winEl.appendChild(div);
        }
    }

    // יצירת הקישוטים מיד בטעינה
    createConfetti();
    createBalloons();

    return { addWinConfetti: addWinConfetti };
})();
