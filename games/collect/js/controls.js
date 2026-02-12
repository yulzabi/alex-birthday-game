/**
 * controls.js - ניהול קלט
 * מקלדת, מגע וכפתורי מובייל
 */

var Controls = (function () {
    var keys = {};
    var touchDir = { x: 0, y: 0 };

    /** אתחול האזנה למקלדת */
    function initKeyboard() {
        document.onkeydown = function (e) {
            keys[e.key] = true;
            // מניעת גלילה כשמשתמשים בחצים
            if (e.key.startsWith('Arrow')) e.preventDefault();
        };
        document.onkeyup = function (e) {
            keys[e.key] = false;
        };
    }

    /** אתחול כפתורי מגע למובייל */
    function initMobileButtons() {
        setupButton('bu', 0, -1);  // למעלה
        setupButton('bd', 0, 1);   // למטה
        setupButton('bl', -1, 0);  // שמאלה
        setupButton('br', 1, 0);   // ימינה
    }

    /** חיבור כפתור למגע ועכבר */
    function setupButton(id, dx, dy) {
        var el = document.getElementById(id);

        function onStart(e) {
            e.preventDefault();
            touchDir.x = dx;
            touchDir.y = dy;
        }

        function onEnd(e) {
            e.preventDefault();
            if (touchDir.x === dx) touchDir.x = 0;
            if (touchDir.y === dy) touchDir.y = 0;
        }

        el.onmousedown = onStart;
        el.onmouseup = onEnd;
        el.onmouseleave = onEnd;
        el.ontouchstart = onStart;
        el.ontouchend = onEnd;
    }

    /** חישוב כיוון תנועה (מקלדת + מגע) */
    function getDirection() {
        var dx = 0;
        var dy = 0;

        // מקלדת - חצים או WASD
        if (keys.ArrowLeft || keys.a) dx -= 1;
        if (keys.ArrowRight || keys.d) dx += 1;
        if (keys.ArrowUp || keys.w) dy -= 1;
        if (keys.ArrowDown || keys.s) dy += 1;

        // מגע
        dx += touchDir.x;
        dy += touchDir.y;

        return { x: dx, y: dy };
    }

    return {
        initKeyboard: initKeyboard,
        initMobileButtons: initMobileButtons,
        getDirection: getDirection,
    };
})();
