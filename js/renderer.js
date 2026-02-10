/**
 * renderer.js - מנוע הציור
 * מצייר את כל האלמנטים הגרפיים על הקנבס
 */

var Renderer = (function () {
    var canvas = document.getElementById('cv');
    var ctx = canvas.getContext('2d');

    /** ציור רקע עם גרדיאנט לפי שלב */
    function drawBackground(W, H, level) {
        var bg = ctx.createLinearGradient(0, 0, 0, H);
        var colors = Config.LEVEL_COLORS[Math.min(level - 1, 2)];
        bg.addColorStop(0, colors[0]);
        bg.addColorStop(0.5, colors[1]);
        bg.addColorStop(1, colors[2]);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
    }

    /** ציור עננים */
    function drawClouds(clouds) {
        for (var i = 0; i < clouds.length; i++) {
            var c = clouds[i];
            ctx.globalAlpha = c.opacity;
            ctx.font = c.size + 'px Arial';
            ctx.fillText('☁️', c.x, c.y);
        }
        ctx.globalAlpha = 1;
    }

    /** ציור דשא בתחתית */
    function drawGround(W, H) {
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, H - 25, W, 25);
        ctx.fillStyle = '#7CCD7C';
        for (var x = 0; x < W; x += 35) {
            ctx.beginPath();
            ctx.moveTo(x, H - 25);
            ctx.lineTo(x + 17, H - 42);
            ctx.lineTo(x + 35, H - 25);
            ctx.fill();
        }
    }

    /** ציור קשת בענן (משלב 2) */
    function drawRainbow(W, H, level) {
        if (level < 2) return;
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 6;
        for (var r = 0; r < Config.RAINBOW.length; r++) {
            ctx.strokeStyle = Config.RAINBOW[r];
            ctx.beginPath();
            ctx.arc(W * 0.7, H * 0.5, 120 + r * 9, Math.PI, 0);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    /** ציור שובל השחקן */
    function drawTrail(player) {
        for (var i = 0; i < player.trail.length; i++) {
            var t = player.trail[i];
            ctx.globalAlpha = t.life * 0.3;
            ctx.fillStyle = '#FF69B4';
            ctx.beginPath();
            ctx.arc(t.x, t.y, player.size / 3 * t.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    /** ציור פריטים לאיסוף */
    function drawItems(items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var bobY = Math.sin(item.bobOffset) * 7;
            var scale = item.collected ? item.collectAnim : 1;

            ctx.save();
            ctx.translate(item.x, item.y + bobY);
            ctx.scale(scale, scale);
            ctx.globalAlpha = scale;

            // זוהר
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 12;
            ctx.font = item.size + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.type.emoji, 0, 0);
            ctx.shadowBlur = 0;

            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }

    /** ציור ניצוצות */
    function drawSparks(sparks) {
        for (var i = 0; i < sparks.length; i++) {
            var s = sparks[i];
            ctx.globalAlpha = s.life;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    /** ציור דמות השחקן */
    function drawPlayer(player) {
        var bobY = Math.sin(player.bobOffset) * 3;

        ctx.save();
        ctx.translate(player.x, player.y + bobY);

        // צל
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.beginPath();
        ctx.ellipse(0, player.size / 2 + 4, player.size / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // תמונה או אימוג'י
        if (player.imageLoaded && player.image) {
            // ציור התמונה בצורת עיגול עם מסגרת
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, player.size / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(player.image, -player.size / 2, -player.size / 2, player.size, player.size);
            ctx.restore();
            // מסגרת ורודה
            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, player.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            // זוהר
            ctx.shadowColor = '#FF69B4';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = 'rgba(255,105,180,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, player.size / 2 + 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else {
            ctx.font = player.size + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#FF69B4';
            ctx.shadowBlur = 8;
            ctx.fillText(player.emoji, 0, 0);
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }

    /** ציור פריים שלם */
    function render(W, H) {
        ctx.clearRect(0, 0, W, H);

        drawBackground(W, H, Game.state.level);
        drawClouds(Game.getClouds());
        drawGround(W, H);
        drawRainbow(W, H, Game.state.level);
        drawTrail(Game.player);
        drawItems(Game.getItems());
        drawSparks(Game.getSparks());
        drawPlayer(Game.player);
    }

    return { render: render };
})();
