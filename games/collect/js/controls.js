/**
 * controls.js - ניהול קלט
 * מקלדת, מגע ישיר על הקנבס וכפתורי מובייל
 */

var Controls = (function () {
    var keys = {};
    var touchDir = { x: 0, y: 0 };
    var touchActive = false;
    var touchTarget = { x: 0, y: 0 };
    var isTouchDevice = false;

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

    /** אתחול כפתורי מגע למובייל (fallback) */
    function initMobileButtons() {
        // הסתר כפתורי חצים במסך מגע
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            isTouchDevice = true;
            var mc = document.getElementById('mc');
            if (mc) mc.style.display = 'none';
            initTouchDrag();
        } else {
            // שמור כפתורים למחשב ללא מגע
            setupButton('bu', 0, -1);
            setupButton('bd', 0, 1);
            setupButton('bl', -1, 0);
            setupButton('br', 1, 0);
        }
    }

    /** אתחול גרירת מגע ישירה על הקנבס */
    function initTouchDrag() {
        var canvas = document.getElementById('cv');

        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchActive = true;
            var touch = e.touches[0];
            var rect = canvas.getBoundingClientRect();
            touchTarget.x = touch.clientX - rect.left;
            touchTarget.y = touch.clientY - rect.top;
        }, { passive: false });

        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
            if (!touchActive) return;
            var touch = e.touches[0];
            var rect = canvas.getBoundingClientRect();
            touchTarget.x = touch.clientX - rect.left;
            touchTarget.y = touch.clientY - rect.top;
        }, { passive: false });

        canvas.addEventListener('touchend', function(e) {
            e.preventDefault();
            touchActive = false;
            touchDir.x = 0;
            touchDir.y = 0;
        }, { passive: false });

        canvas.addEventListener('touchcancel', function(e) {
            touchActive = false;
            touchDir.x = 0;
            touchDir.y = 0;
        }, { passive: false });
    }

    /** חיבור כפתור למגע ועכבר */
    function setupButton(id, dx, dy) {
        var el = document.getElementById(id);
        if (!el) return;

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

        // מגע ישיר - אלכס זזה לכיוון האצבע
        if (touchActive && isTouchDevice) {
            var player = Game.player;
            var ddx = touchTarget.x - player.x;
            var ddy = touchTarget.y - player.y;
            var dist = Math.sqrt(ddx * ddx + ddy * ddy);

            // רק אם האצבע רחוקה מספיק מאלכס (מניעת רעידה)
            if (dist > 10) {
                dx += ddx / dist;
                dy += ddy / dist;
            }
        } else {
            // כפתורי מגע ישנים
            dx += touchDir.x;
            dy += touchDir.y;
        }

        return { x: dx, y: dy };
    }

    return {
        initKeyboard: initKeyboard,
        initMobileButtons: initMobileButtons,
        getDirection: getDirection,
    };
})();
