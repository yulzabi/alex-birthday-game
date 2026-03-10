(function(){
"use strict";
var LEVELS=[{diffs:3,maxMistakes:6,time:50},{diffs:4,maxMistakes:6,time:55},{diffs:5,maxMistakes:7,time:60},{diffs:5,maxMistakes:7,time:65},{diffs:7,maxMistakes:8,time:75}];
var ENC=['!כל הכבוד 🌟','!מדהים 🎉','!עיניים חדות 👀','!יופי 💖','!מצוין 🏆','!חכמה 🧠'];
var CCOLS=['#FF6FB7','#FFD166','#06D6A0','#118AB2','#EF476F','#FFD700','#9B59B6'];

var curLvl=0,diffsFound=0,mistakes=0,hintsLeft=3,timedMode=false,timeLeft=0,timerInt=null,hintNudge=null,hintBlink=null,lockBoard=false,lastEnc=0;
var diffAreas=[],CW=DiffDraw.CW,CH=DiffDraw.CH;

var intro=document.getElementById('intro-screen'),winScr=document.getElementById('win-screen'),toScr=document.getElementById('timeout-screen'),misScr=document.getElementById('mistakes-screen'),gameArea=document.getElementById('game-area');
var cO=document.getElementById('canvas-original'),cD=document.getElementById('canvas-different'),cV=document.getElementById('canvas-overlay');
var xO,xD,xV;
var elDF=document.getElementById('diffs-found'),elDT=document.getElementById('diffs-total'),elLv=document.getElementById('level'),elTD=document.getElementById('timer-display'),elTm=document.getElementById('timer'),elHB=document.getElementById('hint-btn'),elHL=document.getElementById('hints-left'),elMC=document.getElementById('mistakes-count'),elMM=document.getElementById('max-mistakes');

function initC(){cO.width=cD.width=cV.width=CW;cO.height=cD.height=cV.height=CH;xO=cO.getContext('2d');xD=cD.getContext('2d');xV=cV.getContext('2d');}

function P(a){return a[Math.floor(Math.random()*a.length)];}
function R(a,b){return Math.random()*(b-a)+a;}

function showEnc(){var now=Date.now();if(now-lastEnc<1500)return;lastEnc=now;var e=document.getElementById('encourage');e.textContent=P(ENC);e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function showLvl(t){var e=document.getElementById('level-msg');e.textContent=t;e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function addCf(ct){for(var i=0;i<40;i++){var d=document.createElement('div');d.className='cf';d.style.left=Math.random()*100+'%';d.style.background=CCOLS[i%CCOLS.length];d.style.width=R(5,15)+'px';d.style.height=R(5,15)+'px';d.style.animationDuration=R(2,5)+'s';d.style.animationDelay=R(0,2)+'s';ct.appendChild(d);}}

// ===== BUILD LEVEL =====
function buildLevel(){
    lockBoard=false;diffsFound=0;mistakes=0;hintsLeft=3;diffAreas=[];
    if(hintBlink){clearInterval(hintBlink);hintBlink=null;}
    elHL.textContent='3';elHB.disabled=false;elHB.classList.remove('pulse-hint');
    var lv=LEVELS[curLvl];
    elDF.textContent='0';elDT.textContent=lv.diffs;elLv.textContent=curLvl+1;
    elMC.textContent='0';elMM.textContent=lv.maxMistakes;
    initC();

    // Use scene templates from DiffScenes
    var cmds=DiffScenes.getScene(curLvl);

    // pick which commands to modify (skip sky, ground)
    var modifiable=[];
    for(var i=2;i<cmds.length;i++)modifiable.push(i);
    for(var i=modifiable.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=modifiable[i];modifiable[i]=modifiable[j];modifiable[j]=t;}
    var diffIdxs=modifiable.slice(0,Math.min(lv.diffs,modifiable.length));

    var modCmds=[];
    for(var i=0;i<cmds.length;i++)modCmds.push(cmds[i]);
    diffAreas=[];
    for(var d=0;d<diffIdxs.length;d++){
        var idx=diffIdxs[d];
        modCmds[idx]=DiffScenes.modCmd(cmds[idx]);
        var ctr=DiffDraw.getCenter(cmds[idx]);
        diffAreas.push({cx:ctr.x,cy:ctr.y,radius:Math.max(ctr.r,20),found:false});
    }

    // draw original
    xO.clearRect(0,0,CW,CH);
    for(var i=0;i<cmds.length;i++)DiffDraw.drawCmd(xO,cmds[i]);
    // draw different
    xD.clearRect(0,0,CW,CH);
    for(var i=0;i<modCmds.length;i++)DiffDraw.drawCmd(xD,modCmds[i]);
    // clear overlay
    xV.clearRect(0,0,CW,CH);

    // timer
    if(timedMode){timeLeft=lv.time;elTm.textContent=timeLeft;elTD.style.display='inline';elTD.classList.remove('timer-warning');clearTI();timerInt=setInterval(function(){timeLeft--;elTm.textContent=timeLeft;if(timeLeft<=10)elTD.classList.add('timer-warning');if(timeLeft<=0){clearTI();onTimeout();}},1000);}
    else{elTD.style.display='none';clearTI();}
    resetNudge();
}

// ===== OVERLAY HELPERS =====
function redrawFoundOverlay(){
    xV.clearRect(0,0,CW,CH);
    for(var i=0;i<diffAreas.length;i++){
        var da=diffAreas[i];
        if(da.found){
            xV.strokeStyle='#00FF00';xV.lineWidth=3;
            xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.stroke();
            xV.fillStyle='rgba(0,255,0,0.15)';
            xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.fill();
        }
    }
}

function showMissed(){
    for(var i=0;i<diffAreas.length;i++){
        var da=diffAreas[i];
        if(!da.found){
            xV.strokeStyle='#FF0000';xV.lineWidth=3;xV.setLineDash([5,5]);
            xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.stroke();
            xV.setLineDash([]);
        }
    }
}

// ===== CLICK HANDLER =====
function getClickPos(e){
    var rect=cV.getBoundingClientRect();
    var scaleX=CW/rect.width,scaleY=CH/rect.height;
    var cx,cy;
    if(e.touches){cx=(e.touches[0].clientX-rect.left)*scaleX;cy=(e.touches[0].clientY-rect.top)*scaleY;}
    else{cx=(e.clientX-rect.left)*scaleX;cy=(e.clientY-rect.top)*scaleY;}
    return{x:cx,y:cy};
}

function onClick(e){
    e.preventDefault();
    if(lockBoard)return;
    var pos=getClickPos(e);
    var hitDiff=false;
    for(var i=0;i<diffAreas.length;i++){
        var da=diffAreas[i];
        if(da.found)continue;
        var dx=pos.x-da.cx,dy=pos.y-da.cy;
        if(Math.sqrt(dx*dx+dy*dy)<=da.radius+10){
            da.found=true;diffsFound++;elDF.textContent=diffsFound;
            DiffAudio.play('find');showEnc();resetNudge();
            // mark on overlay + original
            xV.strokeStyle='#00FF00';xV.lineWidth=3;
            xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.stroke();
            xV.fillStyle='rgba(0,255,0,0.15)';xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.fill();
            xO.strokeStyle='#00FF00';xO.lineWidth=3;
            xO.beginPath();xO.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xO.stroke();
            // check win
            if(diffsFound>=LEVELS[curLvl].diffs){
                lockBoard=true;clearTI();
                if(curLvl<LEVELS.length-1){curLvl++;DiffAudio.play('levelup');showLvl('🌟 שלב '+(curLvl+1)+'! 🌟');setTimeout(buildLevel,1800);}
                else{DiffAudio.play('win');setTimeout(function(){gameArea.style.display='none';winScr.style.display='flex';addCf(winScr);},800);}
            }
            hitDiff=true;break;
        }
    }
    if(!hitDiff){
        mistakes++;elMC.textContent=mistakes;DiffAudio.play('wrong');
        xV.fillStyle='rgba(255,0,0,0.3)';xV.beginPath();xV.arc(pos.x,pos.y,15,0,Math.PI*2);xV.fill();
        setTimeout(redrawFoundOverlay,400);
        if(mistakes>=LEVELS[curLvl].maxMistakes){lockBoard=true;clearTI();DiffAudio.play('fail');showMissed();setTimeout(function(){gameArea.style.display='none';misScr.style.display='flex';},1500);}
    }
}

function onTimeout(){lockBoard=true;DiffAudio.play('fail');showMissed();setTimeout(function(){gameArea.style.display='none';toScr.style.display='flex';},1500);}
function clearTI(){if(timerInt){clearInterval(timerInt);timerInt=null;}}
function resetNudge(){if(hintNudge)clearTimeout(hintNudge);if(hintBlink){clearInterval(hintBlink);hintBlink=null;}elHB.classList.remove('pulse-hint');if(hintsLeft>0)hintNudge=setTimeout(function(){elHB.classList.add('pulse-hint');},15000);}

function useHint(){
    if(hintsLeft<=0||lockBoard)return;
    hintsLeft--;elHL.textContent=hintsLeft;
    if(hintsLeft<=0)elHB.disabled=true;
    DiffAudio.play('hint');resetNudge();
    var unfound=[];for(var i=0;i<diffAreas.length;i++)if(!diffAreas[i].found)unfound.push(diffAreas[i]);
    if(unfound.length===0)return;
    var da=unfound[Math.floor(Math.random()*unfound.length)];
    var count=0;if(hintBlink)clearInterval(hintBlink);
    hintBlink=setInterval(function(){
        count++;xV.strokeStyle=count%2===0?'rgba(255,215,0,0.8)':'rgba(255,215,0,0)';xV.lineWidth=4;
        xV.beginPath();xV.arc(da.cx,da.cy,da.radius+5,0,Math.PI*2);xV.stroke();
        if(count>=8){clearInterval(hintBlink);hintBlink=null;redrawFoundOverlay();}
    },250);
}

function startGame(timed){DiffAudio.init();timedMode=timed;curLvl=0;intro.style.display='none';gameArea.style.display='block';buildLevel();}
function restart(){winScr.style.display='none';toScr.style.display='none';misScr.style.display='none';document.querySelectorAll('.cf').forEach(function(e){e.remove();});intro.style.display='flex';}

// Events
document.getElementById('mode-relax').addEventListener('click',function(){startGame(false);});
document.getElementById('mode-timed').addEventListener('click',function(){startGame(true);});
elHB.addEventListener('click',useHint);
cV.addEventListener('click',onClick);
cV.addEventListener('touchstart',onClick,{passive:false});
winScr.addEventListener('click',restart);
toScr.addEventListener('click',restart);
misScr.addEventListener('click',restart);
})();
