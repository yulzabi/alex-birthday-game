// Scene templates for Find the Differences game
// Each template generates a unique themed landscape
var DiffScenes = (function() {
    var CW = 380, CH = 300;
    var FC = ['#FF69B4','#FF1493','#FF6347','#FFD700','#FF4500','#DA70D6','#EE82EE','#FFC0CB'];
    var TG = ['#228B22','#2E8B57','#006400','#32CD32','#3CB371'];
    var HC = ['#FFD700','#FF6347','#87CEEB','#DDA0DD','#FFA07A','#98FB98'];
    var RC = ['#DC143C','#8B0000','#B22222','#CD5C5C','#A0522D'];
    var BC = ['#FF69B4','#FFD700','#FF6347','#9370DB','#00CED1'];
    var TC = ['#8B4513','#A0522D','#6B3A2A'];
    var GC = ['#7CCD7C','#8FBC8F','#90EE90','#66CDAA','#9ACD32'];
    var HLC = ['#5f9ea0','#6B8E6B','#7CCD7C','#6B8E23'];
    var FNC = ['#DEB887','#D2B48C','#F5DEB3'];

    function R(a, b) { return Math.random() * (b - a) + a; }
    function RI(a, b) { return Math.floor(R(a, b + 1)); }
    function P(a) { return a[Math.floor(Math.random() * a.length)]; }

    var gy = CH * 0.65;

    // Helper to add base (sky + ground)
    function base(cmds, skyP, gndC) {
        cmds.push({ t: 'sky', p: skyP });
        cmds.push({ t: 'gnd', c: gndC, gy: gy });
    }

    // ===== SCENE 1: Sunny Village =====
    function sunnyVillage() {
        var cmds = [];
        base(cmds, ['#87CEEB', '#B0E0E6'], P(GC));
        cmds.push({ t: 'sun', x: R(CW * 0.6, CW * 0.85), y: R(20, 50), r: R(22, 30), c: '#FFD700' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'hill', x: R(0, CW), y: gy, rx: R(60, 120), ry: R(30, 55), c: P(HLC) });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'cld', x: R(30, CW - 50), y: R(20, 70), s: R(0.6, 1.0), c: '#fff' });
        var hw = R(55, 75), hh = R(40, 55);
        cmds.push({ t: 'house', x: R(CW * 0.25, CW * 0.45), y: gy - hh, w: hw, h: hh, c: P(HC), rc: P(RC) });
        cmds.push({ t: 'fence', x: R(5, 50), gy: gy, sg: RI(3, 5), c: P(FNC) });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(6, 10), th: R(25, 45), cr: R(16, 28), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(4, 7); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 8, CH - 12), r: R(4, 8), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'bird', x: R(20, CW - 20), y: R(15, 60), s: R(6, 10), c: '#333' });
        return cmds;
    }

    // ===== SCENE 2: Sunset Beach =====
    function sunsetBeach() {
        var cmds = [];
        base(cmds, ['#FFB347', '#FF6B6B'], '#F4D03F');
        cmds.push({ t: 'sun', x: R(CW * 0.4, CW * 0.6), y: R(CH * 0.15, CH * 0.25), r: R(25, 35), c: '#FF6347' });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(15, 60), s: R(0.5, 0.9), c: '#FFE4C4' });
        cmds.push({ t: 'pond', x: CW * 0.5, y: gy + 20, rx: CW * 0.48, ry: 25, c: '#4169E1' });
        cmds.push({ t: 'boat', x: R(CW * 0.3, CW * 0.7), y: gy + 5, s: R(25, 40), c: P(['#8B4513', '#A0522D', '#654321']), sc: '#fff' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'bln', x: R(20, CW - 20), y: R(30, gy * 0.6), r: R(10, 14), c: P(FC) });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'bird', x: R(20, CW - 20), y: R(20, 70), s: R(6, 10), c: '#333' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'star', x: R(10, CW - 10), y: R(5, 50), r: R(3, 6), c: '#FFD700' });
        return cmds;
    }

    // ===== SCENE 3: Enchanted Forest =====
    function enchantedForest() {
        var cmds = [];
        base(cmds, ['#DDA0DD', '#87CEEB'], '#2E8B57');
        cmds.push({ t: 'sun', x: R(CW * 0.1, CW * 0.3), y: R(20, 45), r: R(18, 25), c: '#FFD700' });
        for (var i = 0; i < RI(5, 8); i++) cmds.push({ t: 'tree', x: R(10, CW - 10), gy: gy, tw: R(6, 12), th: R(30, 55), cr: R(18, 35), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'mush', x: R(15, CW - 15), y: R(gy + 5, CH - 10), s: R(12, 22), c: P(['#FF0000', '#FF4500', '#8B0000']) });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'bfly', x: R(20, CW - 20), y: R(gy * 0.4, gy - 10), s: R(7, 12), c: P(BC) });
        for (var i = 0; i < RI(3, 6); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(4, 8), pc: P(FC), cc: '#FFD700' });
        cmds.push({ t: 'pond', x: R(CW * 0.5, CW * 0.8), y: R(gy + 15, CH - 20), rx: R(25, 40), ry: R(12, 20), c: '#00BFFF' });
        return cmds;
    }

    // ===== SCENE 4: Rainbow Valley =====
    function rainbowValley() {
        var cmds = [];
        base(cmds, ['#98FB98', '#87CEEB'], P(GC));
        cmds.push({ t: 'sun', x: R(CW * 0.7, CW * 0.9), y: R(15, 40), r: R(20, 28), c: '#FFD700' });
        cmds.push({ t: 'rainbow', x: CW * 0.5, y: gy * 0.7, r: R(60, 90) });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'hill', x: R(0, CW), y: gy, rx: R(60, 110), ry: R(25, 45), c: P(HLC) });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(15, 55), s: R(0.5, 1.0), c: '#fff' });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(5, 10), th: R(22, 40), cr: R(15, 28), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(5, 9); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(4, 9), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'bfly', x: R(20, CW - 20), y: R(gy * 0.3, gy - 10), s: R(6, 10), c: P(BC) });
        return cmds;
    }

    // ===== SCENE 5: Farm Landscape =====
    function farmLandscape() {
        var cmds = [];
        base(cmds, ['#87CEEB', '#B0E0E6'], '#9ACD32');
        cmds.push({ t: 'sun', x: R(CW * 0.65, CW * 0.9), y: R(15, 40), r: R(20, 28), c: '#FFD700' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'cld', x: R(30, CW - 50), y: R(15, 55), s: R(0.6, 1.0), c: '#fff' });
        var hw = R(55, 70), hh = R(42, 55);
        cmds.push({ t: 'house', x: R(CW * 0.05, CW * 0.2), y: gy - hh, w: hw, h: hh, c: '#CD5C5C', rc: '#8B0000' });
        cmds.push({ t: 'windmill', x: R(CW * 0.6, CW * 0.85), gy: gy, s: R(55, 75), c: '#F5F5DC' });
        cmds.push({ t: 'fence', x: R(CW * 0.25, CW * 0.45), gy: gy, sg: RI(4, 7), c: P(FNC) });
        cmds.push({ t: 'path', x: R(CW * 0.2, CW * 0.35), gy: gy, len: R(80, 140), c: '#D2B48C' });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(6, 10), th: R(25, 40), cr: R(16, 26), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 8, CH - 12), r: R(4, 7), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(1, 3); i++) cmds.push({ t: 'bird', x: R(20, CW - 20), y: R(15, 55), s: R(5, 9), c: '#333' });
        return cmds;
    }

    // ===== SCENE 6: Balloon Festival =====
    function balloonFestival() {
        var cmds = [];
        base(cmds, ['#87CEEB', '#E0F7FA'], P(GC));
        cmds.push({ t: 'sun', x: R(CW * 0.1, CW * 0.25), y: R(20, 45), r: R(20, 28), c: '#FFD700' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(10, 50), s: R(0.5, 0.9), c: '#fff' });
        for (var i = 0; i < RI(5, 8); i++) cmds.push({ t: 'bln', x: R(15, CW - 15), y: R(20, gy * 0.7), r: R(10, 18), c: P(FC) });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'hill', x: R(0, CW), y: gy, rx: R(60, 120), ry: R(25, 45), c: P(HLC) });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(5, 9), th: R(22, 38), cr: R(14, 24), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 8, CH - 12), r: R(4, 7), pc: P(FC), cc: '#FFD700' });
        cmds.push({ t: 'bench', x: R(CW * 0.3, CW * 0.6), gy: gy, s: R(35, 50), c: '#8B4513' });
        return cmds;
    }

    // ===== SCENE 7: Starry Garden =====
    function starryGarden() {
        var cmds = [];
        base(cmds, ['#191970', '#4B0082'], '#2E8B57');
        cmds.push({ t: 'sun', x: R(CW * 0.75, CW * 0.9), y: R(20, 45), r: R(15, 22), c: '#F0E68C' });
        for (var i = 0; i < RI(6, 10); i++) cmds.push({ t: 'star', x: R(5, CW - 5), y: R(5, gy * 0.5), r: R(3, 7), c: P(['#FFD700', '#FFF8DC', '#FFFACD']) });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(6, 10), th: R(28, 48), cr: R(16, 30), tc: '#3B2A1A', cc: P(['#006400', '#004225', '#2E4E1E']) });
        for (var i = 0; i < RI(4, 7); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(5, 9), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'mush', x: R(20, CW - 20), y: R(gy + 5, CH - 10), s: R(14, 20), c: P(['#9370DB', '#BA55D3']) });
        cmds.push({ t: 'pond', x: R(CW * 0.2, CW * 0.5), y: R(gy + 15, CH - 20), rx: R(25, 40), ry: R(12, 18), c: '#4169E1' });
        return cmds;
    }

    // ===== SCENE 8: Kite Flying Day =====
    function kiteFlyingDay() {
        var cmds = [];
        base(cmds, ['#87CEEB', '#B0E0E6'], P(GC));
        cmds.push({ t: 'sun', x: R(CW * 0.1, CW * 0.3), y: R(15, 40), r: R(20, 28), c: '#FFD700' });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(10, 60), s: R(0.4, 0.9), c: '#fff' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'kite', x: R(40, CW - 40), y: R(30, gy * 0.5), s: R(18, 30), c: P(FC) });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'hill', x: R(0, CW), y: gy, rx: R(60, 110), ry: R(25, 45), c: P(HLC) });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(5, 9), th: R(22, 40), cr: R(14, 25), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(4, 7); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(4, 8), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'bird', x: R(20, CW - 20), y: R(15, 55), s: R(5, 9), c: '#333' });
        cmds.push({ t: 'bench', x: R(CW * 0.5, CW * 0.75), gy: gy, s: R(35, 50), c: '#8B4513' });
        return cmds;
    }

    // ===== SCENE 9: Lakeside Park =====
    function lakesidePark() {
        var cmds = [];
        base(cmds, ['#87CEEB', '#E0F7FA'], '#8FBC8F');
        cmds.push({ t: 'sun', x: R(CW * 0.65, CW * 0.85), y: R(15, 40), r: R(20, 28), c: '#FFD700' });
        for (var i = 0; i < RI(1, 3); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(15, 55), s: R(0.5, 1.0), c: '#fff' });
        cmds.push({ t: 'hill', x: R(CW * 0.7, CW * 0.9), y: gy, rx: R(80, 130), ry: R(30, 50), c: P(HLC) });
        cmds.push({ t: 'pond', x: CW * 0.35, y: gy + 20, rx: R(50, 70), ry: R(18, 28), c: '#4169E1' });
        cmds.push({ t: 'boat', x: CW * 0.35, y: gy + 10, s: R(20, 32), c: P(['#8B4513', '#654321']), sc: '#fff' });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(6, 10), th: R(25, 42), cr: R(16, 28), tc: P(TC), cc: P(TG) });
        cmds.push({ t: 'bench', x: R(CW * 0.6, CW * 0.8), gy: gy, s: R(35, 48), c: '#8B4513' });
        cmds.push({ t: 'path', x: R(CW * 0.5, CW * 0.6), gy: gy, len: R(60, 100), c: '#D2B48C' });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 8, CH - 12), r: R(4, 8), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'bfly', x: R(20, CW - 20), y: R(gy * 0.4, gy - 10), s: R(6, 10), c: P(BC) });
        return cmds;
    }

    // ===== SCENE 10: Mountain Meadow =====
    function mountainMeadow() {
        var cmds = [];
        base(cmds, ['#87CEEB', '#B0C4DE'], '#7CCD7C');
        cmds.push({ t: 'sun', x: R(CW * 0.5, CW * 0.8), y: R(15, 35), r: R(20, 28), c: '#FFD700' });
        // big mountains
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'hill', x: R(0, CW), y: gy, rx: R(80, 150), ry: R(40, 70), c: P(['#708090', '#778899', '#696969', '#5f9ea0']) });
        for (var i = 0; i < RI(2, 3); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(10, 50), s: R(0.5, 1.0), c: '#fff' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(5, 9), th: R(20, 35), cr: R(14, 24), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(6, 10); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(3, 7), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'bird', x: R(20, CW - 20), y: R(15, 60), s: R(5, 10), c: '#333' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'bfly', x: R(20, CW - 20), y: R(gy * 0.4, gy - 10), s: R(7, 11), c: P(BC) });
        return cmds;
    }

    // ===== SCENE 11: Mushroom Glade =====
    function mushroomGlade() {
        var cmds = [];
        base(cmds, ['#DDA0DD', '#E6E6FA'], '#3CB371');
        cmds.push({ t: 'sun', x: R(CW * 0.7, CW * 0.9), y: R(20, 45), r: R(18, 25), c: '#FFD700' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'cld', x: R(20, CW - 40), y: R(15, 50), s: R(0.5, 0.9), c: '#F5F5F5' });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(7, 12), th: R(30, 50), cr: R(18, 32), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(4, 7); i++) cmds.push({ t: 'mush', x: R(15, CW - 15), y: R(gy + 3, CH - 8), s: R(12, 24), c: P(['#FF0000', '#FF4500', '#DC143C', '#8B0000', '#FF6347']) });
        for (var i = 0; i < RI(3, 5); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(4, 7), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'bfly', x: R(20, CW - 20), y: R(gy * 0.3, gy - 10), s: R(6, 10), c: P(BC) });
        return cmds;
    }

    // ===== SCENE 12: Windmill Countryside =====
    function windmillCountryside() {
        var cmds = [];
        base(cmds, ['#FFD700', '#FFA07A'], '#9ACD32');
        cmds.push({ t: 'sun', x: R(CW * 0.1, CW * 0.3), y: R(CH * 0.12, CH * 0.25), r: R(25, 35), c: '#FF8C00' });
        for (var i = 0; i < RI(1, 2); i++) cmds.push({ t: 'hill', x: R(0, CW), y: gy, rx: R(60, 110), ry: R(25, 45), c: P(HLC) });
        for (var i = 0; i < RI(1, 3); i++) cmds.push({ t: 'cld', x: R(30, CW - 50), y: R(15, 50), s: R(0.5, 0.9), c: '#FFE4C4' });
        cmds.push({ t: 'windmill', x: R(CW * 0.15, CW * 0.35), gy: gy, s: R(55, 75), c: '#F5F5DC' });
        cmds.push({ t: 'windmill', x: R(CW * 0.65, CW * 0.85), gy: gy, s: R(45, 60), c: '#FAEBD7' });
        cmds.push({ t: 'path', x: R(CW * 0.3, CW * 0.45), gy: gy, len: R(60, 100), c: '#D2B48C' });
        for (var i = 0; i < RI(1, 3); i++) cmds.push({ t: 'tree', x: R(15, CW - 15), gy: gy, tw: R(5, 9), th: R(22, 38), cr: R(14, 24), tc: P(TC), cc: P(TG) });
        for (var i = 0; i < RI(4, 6); i++) cmds.push({ t: 'flwr', x: R(10, CW - 10), y: R(gy + 5, CH - 10), r: R(4, 8), pc: P(FC), cc: '#FFD700' });
        for (var i = 0; i < RI(2, 4); i++) cmds.push({ t: 'star', x: R(10, CW - 10), y: R(5, 45), r: R(3, 6), c: '#FFD700' });
        return cmds;
    }

    // All scene generators
    var ALL_SCENES = [
        sunnyVillage, sunsetBeach, enchantedForest, rainbowValley,
        farmLandscape, balloonFestival, starryGarden, kiteFlyingDay,
        lakesidePark, mountainMeadow, mushroomGlade, windmillCountryside
    ];

    // Modification rules for creating differences
    function modCmd(o) {
        var c = JSON.parse(JSON.stringify(o));
        if (c.t === 'sun') c.c = P(['#FF6347', '#FFA500', '#FF4500']);
        else if (c.t === 'cld') c.s = c.s * R(0.5, 0.75);
        else if (c.t === 'tree') c.cc = P(TG.filter(function(v) { return v !== c.cc; }));
        else if (c.t === 'flwr') c.pc = P(FC.filter(function(v) { return v !== c.pc; }));
        else if (c.t === 'house') c.rc = P(RC.filter(function(v) { return v !== c.rc; }));
        else if (c.t === 'bird') c.x += R(15, 30) * (Math.random() > 0.5 ? 1 : -1);
        else if (c.t === 'bfly') c.c = P(BC.filter(function(v) { return v !== c.c; }));
        else if (c.t === 'fence') c.sg = Math.max(2, c.sg - RI(1, 2));
        else if (c.t === 'pond') c.c = P(['#4169E1', '#1E90FF', '#00BFFF'].filter(function(v) { return v !== c.c; }));
        else if (c.t === 'bln') c.c = P(FC.filter(function(v) { return v !== c.c; }));
        else if (c.t === 'star') c.r = c.r * R(1.5, 2);
        else if (c.t === 'hill') c.c = P(HLC.filter(function(v) { return v !== c.c; }));
        else if (c.t === 'mush') c.c = P(['#FF0000', '#FF4500', '#8B0000', '#DC143C'].filter(function(v) { return v !== c.c; }));
        else if (c.t === 'boat') c.sc = P(['#fff', '#FFD700', '#FF69B4'].filter(function(v) { return v !== c.sc; }));
        else if (c.t === 'windmill') c.c = P(['#F5F5DC', '#FAEBD7', '#FFF8DC'].filter(function(v) { return v !== c.c; }));
        else if (c.t === 'kite') c.c = P(FC.filter(function(v) { return v !== c.c; }));
        else if (c.t === 'rainbow') c.r = c.r * R(0.6, 0.8);
        else if (c.t === 'bench') c.c = P(['#8B4513', '#A0522D', '#654321'].filter(function(v) { return v !== c.c; }));
        else if (c.t === 'path') c.c = P(['#D2B48C', '#C4A882', '#BDB76B'].filter(function(v) { return v !== c.c; }));
        return c;
    }

    // Get a scene for a given level (0-4), picking from the pool
    function getScene(levelIndex) {
        var idx = levelIndex % ALL_SCENES.length;
        // Shuffle for variety each playthrough
        if (levelIndex === 0) {
            for (var i = ALL_SCENES.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var t = ALL_SCENES[i]; ALL_SCENES[i] = ALL_SCENES[j]; ALL_SCENES[j] = t;
            }
        }
        return ALL_SCENES[idx]();
    }

    return {
        getScene: getScene,
        modCmd: modCmd
    };
})();
