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

    /** ציור תמונה עגולה */
    function drawCircularImage(img, x, y, size, borderColor, glowAmount) {
        var radius = size / 2;

        ctx.save();
        ctx.translate(x, y);

        // זוהר
        if (glowAmount) {
            ctx.shadowColor = borderColor || '#FFD700';
            ctx.shadowBlur = glowAmount;
        }

        // ציור התמונה בצורת עיגול
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, -radius, -radius, size, size);

        ctx.restore();

        // מסגרת צבעונית
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = borderColor || '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // מסגרת זוהרת חיצונית
        ctx.strokeStyle = (borderColor || '#FFD700') + '66';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
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

            if (item.type.isPhoto) {
                // ציור תמונת משפחה עגולה
                var familyImg = Game.getFamilyImage(item.type.image);
                if (familyImg) {
                    var borderColorIndex = 0;
                    for (var ci = 0; ci < Config.ITEM_TYPES.length; ci++) {
                        if (Config.ITEM_TYPES[ci] === item.type) {
                            borderColorIndex = ci;
                            break;
                        }
                    }
                    var borderColor = Config.PHOTO_BORDER_COLORS[borderColorIndex % Config.PHOTO_BORDER_COLORS.length];
                    drawCircularImage(familyImg, 0, 0, item.size, borderColor, 15);

                    // שם מתחת לתמונה
                    ctx.fillStyle = '#fff';
                    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                    ctx.lineWidth = 2;
                    ctx.font = 'bold 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.strokeText(item.type.name, 0, item.size / 2 + 4);
                    ctx.fillText(item.type.name, 0, item.size / 2 + 4);
                } else {
                    // תמונה לא נטענה - fallback לאימוג'י
                    ctx.font = item.size + 'px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('👤', 0, 0);
                }
            } else {
                // ציור אימוג'י רגיל
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 12;
                ctx.font = item.size + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(item.type.emoji, 0, 0);
                ctx.shadowBlur = 0;
            }

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
