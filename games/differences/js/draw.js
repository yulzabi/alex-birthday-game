// Drawing module for Find the Differences game
var DiffDraw = (function() {
    var CW = 380, CH = 300;

    function sky(x, p) {
        var g = x.createLinearGradient(0, 0, 0, CH * 0.65);
        g.addColorStop(0, p[0]);
        g.addColorStop(1, p[1]);
        x.fillStyle = g;
        x.fillRect(0, 0, CW, CH * 0.65);
    }

    function ground(x, c, gy) {
        x.fillStyle = c;
        x.fillRect(0, gy, CW, CH - gy);
    }

    function sun(x, sx, sy, sr, c) {
        x.save();
        x.strokeStyle = c;
        x.lineWidth = 2;
        for (var i = 0; i < 8; i++) {
            var a = (i / 8) * Math.PI * 2;
            x.beginPath();
            x.moveTo(sx + Math.cos(a) * (sr + 3), sy + Math.sin(a) * (sr + 3));
            x.lineTo(sx + Math.cos(a) * (sr + 14), sy + Math.sin(a) * (sr + 14));
            x.stroke();
        }
        x.beginPath();
        x.arc(sx, sy, sr, 0, Math.PI * 2);
        x.fillStyle = c;
        x.fill();
        // face
        x.fillStyle = '#FFA500';
        x.beginPath(); x.arc(sx - sr * 0.25, sy - sr * 0.15, sr * 0.1, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.arc(sx + sr * 0.25, sy - sr * 0.15, sr * 0.1, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.arc(sx, sy + sr * 0.15, sr * 0.25, 0, Math.PI); x.lineWidth = 1.5; x.stroke();
        x.restore();
    }

    function cloud(x, cx, cy, s, c) {
        x.fillStyle = c;
        x.beginPath();
        x.arc(cx, cy, 18 * s, 0, Math.PI * 2);
        x.arc(cx + 20 * s, cy - 5 * s, 15 * s, 0, Math.PI * 2);
        x.arc(cx - 18 * s, cy + 2 * s, 13 * s, 0, Math.PI * 2);
        x.arc(cx + 10 * s, cy + 5 * s, 14 * s, 0, Math.PI * 2);
        x.fill();
    }

    function hill(x, hx, hy, rx, ry, c) {
        x.fillStyle = c;
        x.beginPath();
        x.ellipse(hx, hy, rx, ry, 0, Math.PI, 0);
        x.fill();
    }

    function tree(x, tx, gy, tw, th, cr, tc, cc) {
        x.fillStyle = tc;
        x.fillRect(tx - tw / 2, gy - th, tw, th);
        x.fillStyle = cc;
        x.beginPath(); x.arc(tx, gy - th - cr * 0.4, cr, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.arc(tx - cr * 0.5, gy - th + 2, cr * 0.7, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.arc(tx + cr * 0.5, gy - th + 2, cr * 0.7, 0, Math.PI * 2); x.fill();
    }

    function flower(x, fx, fy, fr, pc, cc) {
        x.strokeStyle = '#228B22';
        x.lineWidth = 2;
        x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx, fy - fr * 2.5); x.stroke();
        x.fillStyle = pc;
        for (var p = 0; p < 5; p++) {
            var a = (p / 5) * Math.PI * 2;
            x.beginPath();
            x.arc(fx + Math.cos(a) * fr * 0.6, fy - fr * 2.5 + Math.sin(a) * fr * 0.6, fr * 0.45, 0, Math.PI * 2);
            x.fill();
        }
        x.fillStyle = cc;
        x.beginPath(); x.arc(fx, fy - fr * 2.5, fr * 0.3, 0, Math.PI * 2); x.fill();
    }

    function house(x, hx, hy, hw, hh, c, rc) {
        x.fillStyle = c;
        x.fillRect(hx, hy, hw, hh);
        x.fillStyle = rc;
        x.beginPath(); x.moveTo(hx - 8, hy); x.lineTo(hx + hw / 2, hy - hh * 0.5); x.lineTo(hx + hw + 8, hy); x.closePath(); x.fill();
        x.fillStyle = '#654321';
        x.fillRect(hx + hw * 0.4, hy + hh * 0.55, hw * 0.2, hh * 0.45);
        x.fillStyle = '#87CEEB';
        var ws = hw * 0.17;
        x.fillRect(hx + hw * 0.12, hy + hh * 0.2, ws, ws);
        x.fillRect(hx + hw * 0.68, hy + hh * 0.2, ws, ws);
        x.strokeStyle = '#333'; x.lineWidth = 1;
        x.strokeRect(hx + hw * 0.12, hy + hh * 0.2, ws, ws);
        x.strokeRect(hx + hw * 0.68, hy + hh * 0.2, ws, ws);
    }

    function bird(x, bx, by, bs, c) {
        x.strokeStyle = c; x.lineWidth = 2;
        x.beginPath();
        x.moveTo(bx - bs, by);
        x.quadraticCurveTo(bx - bs * 0.4, by - bs * 0.7, bx, by);
        x.quadraticCurveTo(bx + bs * 0.4, by - bs * 0.7, bx + bs, by);
        x.stroke();
    }

    function butterfly(x, bx, by, bs, c) {
        x.fillStyle = c;
        x.beginPath(); x.ellipse(bx - bs * 0.5, by - bs * 0.2, bs * 0.6, bs * 0.4, -0.3, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.ellipse(bx + bs * 0.5, by - bs * 0.2, bs * 0.6, bs * 0.4, 0.3, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#333';
        x.fillRect(bx - 1, by - bs * 0.6, 2, bs * 0.8);
    }

    function fence(x, fx, gy, sg, c) {
        x.fillStyle = c; x.strokeStyle = '#8B6914'; x.lineWidth = 1;
        var sw = 10, sh = 22, gp = 12;
        x.fillRect(fx, gy - sh * 0.7, (sw + gp) * sg - gp, 3);
        x.fillRect(fx, gy - sh * 0.3, (sw + gp) * sg - gp, 3);
        for (var i = 0; i < sg; i++) {
            x.fillRect(fx + i * (sw + gp), gy - sh, sw, sh);
            x.strokeRect(fx + i * (sw + gp), gy - sh, sw, sh);
        }
    }

    function pond(x, px, py, rx, ry, c) {
        x.fillStyle = c;
        x.beginPath(); x.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2); x.fill();
        x.strokeStyle = 'rgba(255,255,255,0.4)'; x.lineWidth = 1;
        x.beginPath(); x.ellipse(px - rx * 0.2, py - ry * 0.2, rx * 0.3, ry * 0.2, 0, 0, Math.PI * 2); x.stroke();
    }

    function balloon(x, bx, by, br, c) {
        x.strokeStyle = '#999'; x.lineWidth = 1;
        x.beginPath(); x.moveTo(bx, by + br); x.lineTo(bx, by + br + 30); x.stroke();
        x.fillStyle = c;
        x.beginPath(); x.ellipse(bx, by, br, br * 1.2, 0, 0, Math.PI * 2); x.fill();
        x.fillStyle = 'rgba(255,255,255,0.3)';
        x.beginPath(); x.ellipse(bx - br * 0.3, by - br * 0.3, br * 0.2, br * 0.35, -0.5, 0, Math.PI * 2); x.fill();
    }

    function star(x, sx, sy, sr, c) {
        x.fillStyle = c; x.beginPath();
        for (var i = 0; i < 5; i++) {
            var a1 = (i * 72 - 90) * Math.PI / 180;
            var a2 = ((i * 72) + 36 - 90) * Math.PI / 180;
            if (i === 0) x.moveTo(sx + Math.cos(a1) * sr, sy + Math.sin(a1) * sr);
            else x.lineTo(sx + Math.cos(a1) * sr, sy + Math.sin(a1) * sr);
            x.lineTo(sx + Math.cos(a2) * sr * 0.4, sy + Math.sin(a2) * sr * 0.4);
        }
        x.closePath(); x.fill();
    }

    function mushroom(x, mx, my, size, capColor) {
        // stem
        x.fillStyle = '#F5F5DC';
        x.fillRect(mx - size * 0.2, my - size * 0.6, size * 0.4, size * 0.6);
        // cap
        x.fillStyle = capColor;
        x.beginPath(); x.ellipse(mx, my - size * 0.6, size * 0.5, size * 0.35, 0, Math.PI, 0); x.fill();
        // dots
        x.fillStyle = '#fff';
        x.beginPath(); x.arc(mx - size * 0.15, my - size * 0.75, size * 0.07, 0, Math.PI * 2); x.fill();
        x.beginPath(); x.arc(mx + size * 0.2, my - size * 0.7, size * 0.06, 0, Math.PI * 2); x.fill();
    }

    function rainbow(x, rx, ry, rr) {
        var colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF'];
        for (var i = 0; i < colors.length; i++) {
            x.strokeStyle = colors[i];
            x.lineWidth = 4;
            x.beginPath();
            x.arc(rx, ry, rr - i * 4, Math.PI, 0);
            x.stroke();
        }
    }

    function boat(x, bx, by, size, hullColor, sailColor) {
        // hull
        x.fillStyle = hullColor;
        x.beginPath();
        x.moveTo(bx - size * 0.6, by);
        x.lineTo(bx - size * 0.4, by + size * 0.3);
        x.lineTo(bx + size * 0.4, by + size * 0.3);
        x.lineTo(bx + size * 0.6, by);
        x.closePath(); x.fill();
        // mast
        x.strokeStyle = '#654321'; x.lineWidth = 2;
        x.beginPath(); x.moveTo(bx, by); x.lineTo(bx, by - size * 0.7); x.stroke();
        // sail
        x.fillStyle = sailColor;
        x.beginPath();
        x.moveTo(bx, by - size * 0.65);
        x.lineTo(bx + size * 0.35, by - size * 0.15);
        x.lineTo(bx, by - size * 0.1);
        x.closePath(); x.fill();
    }

    function windmill(x, wx, gy, size, bodyColor) {
        // body
        x.fillStyle = bodyColor;
        x.beginPath();
        x.moveTo(wx - size * 0.25, gy);
        x.lineTo(wx - size * 0.12, gy - size);
        x.lineTo(wx + size * 0.12, gy - size);
        x.lineTo(wx + size * 0.25, gy);
        x.closePath(); x.fill();
        // blades
        x.strokeStyle = '#654321'; x.lineWidth = 3;
        var cy = gy - size * 0.85;
        for (var i = 0; i < 4; i++) {
            var a = (i / 4) * Math.PI * 2 + 0.3;
            x.beginPath();
            x.moveTo(wx, cy);
            x.lineTo(wx + Math.cos(a) * size * 0.4, cy + Math.sin(a) * size * 0.4);
            x.stroke();
        }
        // center
        x.fillStyle = '#654321';
        x.beginPath(); x.arc(wx, cy, 3, 0, Math.PI * 2); x.fill();
    }

    function kite(x, kx, ky, size, c) {
        x.fillStyle = c;
        x.beginPath();
        x.moveTo(kx, ky - size * 0.6);
        x.lineTo(kx + size * 0.3, ky);
        x.lineTo(kx, ky + size * 0.4);
        x.lineTo(kx - size * 0.3, ky);
        x.closePath(); x.fill();
        // string
        x.strokeStyle = '#999'; x.lineWidth = 1;
        x.beginPath(); x.moveTo(kx, ky + size * 0.4); x.lineTo(kx + 10, ky + size * 1.5); x.stroke();
        // tail bows
        x.fillStyle = '#FF69B4';
        x.beginPath(); x.arc(kx + 3, ky + size * 0.8, 3, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#FFD700';
        x.beginPath(); x.arc(kx + 7, ky + size * 1.1, 3, 0, Math.PI * 2); x.fill();
    }

    function path(x, startX, gy, length, c) {
        x.fillStyle = c;
        x.beginPath();
        x.moveTo(startX, gy + 5);
        x.quadraticCurveTo(startX + length * 0.3, gy + 2, startX + length * 0.5, gy + 8);
        x.quadraticCurveTo(startX + length * 0.7, gy + 14, startX + length, gy + 10);
        x.lineTo(startX + length, gy + 18);
        x.quadraticCurveTo(startX + length * 0.7, gy + 22, startX + length * 0.5, gy + 16);
        x.quadraticCurveTo(startX + length * 0.3, gy + 10, startX, gy + 13);
        x.closePath(); x.fill();
    }

    function bench(x, bx, gy, size, c) {
        x.fillStyle = c;
        // seat
        x.fillRect(bx, gy - size * 0.35, size, size * 0.08);
        // back
        x.fillRect(bx, gy - size * 0.6, size, size * 0.06);
        // legs
        x.fillRect(bx + size * 0.1, gy - size * 0.35, size * 0.06, size * 0.35);
        x.fillRect(bx + size * 0.84, gy - size * 0.35, size * 0.06, size * 0.35);
        // back supports
        x.fillRect(bx + size * 0.1, gy - size * 0.6, size * 0.06, size * 0.25);
        x.fillRect(bx + size * 0.84, gy - size * 0.6, size * 0.06, size * 0.25);
    }

    // Draw a command object
    function drawCmd(x, c) {
        if (c.t === 'sky') sky(x, c.p);
        else if (c.t === 'gnd') ground(x, c.c, c.gy);
        else if (c.t === 'sun') sun(x, c.x, c.y, c.r, c.c);
        else if (c.t === 'cld') cloud(x, c.x, c.y, c.s, c.c);
        else if (c.t === 'hill') hill(x, c.x, c.y, c.rx, c.ry, c.c);
        else if (c.t === 'tree') tree(x, c.x, c.gy, c.tw, c.th, c.cr, c.tc, c.cc);
        else if (c.t === 'flwr') flower(x, c.x, c.y, c.r, c.pc, c.cc);
        else if (c.t === 'house') house(x, c.x, c.y, c.w, c.h, c.c, c.rc);
        else if (c.t === 'bird') bird(x, c.x, c.y, c.s, c.c);
        else if (c.t === 'bfly') butterfly(x, c.x, c.y, c.s, c.c);
        else if (c.t === 'fence') fence(x, c.x, c.gy, c.sg, c.c);
        else if (c.t === 'pond') pond(x, c.x, c.y, c.rx, c.ry, c.c);
        else if (c.t === 'bln') balloon(x, c.x, c.y, c.r, c.c);
        else if (c.t === 'star') star(x, c.x, c.y, c.r, c.c);
        else if (c.t === 'mush') mushroom(x, c.x, c.y, c.s, c.c);
        else if (c.t === 'rainbow') rainbow(x, c.x, c.y, c.r);
        else if (c.t === 'boat') boat(x, c.x, c.y, c.s, c.c, c.sc);
        else if (c.t === 'windmill') windmill(x, c.x, c.gy, c.s, c.c);
        else if (c.t === 'kite') kite(x, c.x, c.y, c.s, c.c);
        else if (c.t === 'path') path(x, c.x, c.gy, c.len, c.c);
        else if (c.t === 'bench') bench(x, c.x, c.gy, c.s, c.c);
    }

    // Get the center and radius of a command for hit detection
    function getCenter(c) {
        if (c.t === 'sun') return { x: c.x, y: c.y, r: c.r + 12 };
        if (c.t === 'cld') return { x: c.x, y: c.y, r: 22 * c.s };
        if (c.t === 'tree') return { x: c.x, y: c.gy - c.th - c.cr * 0.3, r: c.cr + 5 };
        if (c.t === 'flwr') return { x: c.x, y: c.y - c.r * 1.5, r: c.r * 2 + 6 };
        if (c.t === 'house') return { x: c.x + c.w / 2, y: c.y + c.h / 2, r: Math.max(c.w, c.h) / 2 + 5 };
        if (c.t === 'bird') return { x: c.x, y: c.y, r: c.s + 10 };
        if (c.t === 'bfly') return { x: c.x, y: c.y, r: c.s + 10 };
        if (c.t === 'fence') return { x: c.x + 40, y: c.gy - 12, r: 30 };
        if (c.t === 'pond') return { x: c.x, y: c.y, r: Math.max(c.rx, c.ry) + 6 };
        if (c.t === 'bln') return { x: c.x, y: c.y, r: c.r + 10 };
        if (c.t === 'star') return { x: c.x, y: c.y, r: c.r + 8 };
        if (c.t === 'hill') return { x: c.x, y: c.y - c.ry / 2, r: c.rx / 2 };
        if (c.t === 'mush') return { x: c.x, y: c.y - c.s * 0.4, r: c.s * 0.6 };
        if (c.t === 'rainbow') return { x: c.x, y: c.y - c.r * 0.5, r: c.r * 0.5 };
        if (c.t === 'boat') return { x: c.x, y: c.y, r: c.s * 0.6 };
        if (c.t === 'windmill') return { x: c.x, y: c.gy - c.s * 0.5, r: c.s * 0.5 };
        if (c.t === 'kite') return { x: c.x, y: c.y, r: c.s * 0.5 };
        if (c.t === 'path') return { x: c.x + c.len / 2, y: c.gy + 10, r: c.len / 3 };
        if (c.t === 'bench') return { x: c.x + c.s / 2, y: c.gy - c.s * 0.3, r: c.s * 0.4 };
        return { x: CW / 2, y: CH / 2, r: 30 };
    }

    return {
        CW: CW,
        CH: CH,
        drawCmd: drawCmd,
        getCenter: getCenter
    };
})();
