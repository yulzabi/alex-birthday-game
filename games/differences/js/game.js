(function(){
"use strict";
var LEVELS=[{diffs:3,maxMistakes:6,time:50,cx:1},{diffs:4,maxMistakes:6,time:55,cx:2},{diffs:5,maxMistakes:7,time:60,cx:3},{diffs:5,maxMistakes:7,time:65,cx:4},{diffs:7,maxMistakes:8,time:75,cx:5}];
var ENC=['!כל הכבוד 🌟','!מדהים 🎉','!עיניים חדות 👀','!יופי 💖','!מצוין 🏆','!חכמה 👑'];
var CCOLS=['#FF6FB7','#FFD166','#06D6A0','#118AB2','#EF476F','#FFD700','#9B59B6'];
var FC=['#FF69B4','#FF1493','#FF6347','#FFD700','#FF4500','#DA70D6','#EE82EE','#FFC0CB'];
var TG=['#228B22','#2E8B57','#006400','#32CD32','#3CB371'];
var HC=['#FFD700','#FF6347','#87CEEB','#DDA0DD','#FFA07A','#98FB98'];
var RC=['#DC143C','#8B0000','#B22222','#CD5C5C','#A0522D'];
var BC=['#FF69B4','#FFD700','#FF6347','#9370DB','#00CED1'];
var audioCtx=null,curLvl=0,diffsFound=0,mistakes=0,hintsLeft=3,timedMode=false,timeLeft=0,timerInt=null,hintNudge=null,hintBlink=null,lockBoard=false,lastEnc=0;
var diffAreas=[],CW=380,CH=300;
var intro=document.getElementById('intro-screen'),winScr=document.getElementById('win-screen'),toScr=document.getElementById('timeout-screen'),misScr=document.getElementById('mistakes-screen'),gameArea=document.getElementById('game-area');
var cO=document.getElementById('canvas-original'),cD=document.getElementById('canvas-different'),cV=document.getElementById('canvas-overlay');
var xO,xD,xV;
var elDF=document.getElementById('diffs-found'),elDT=document.getElementById('diffs-total'),elLv=document.getElementById('level'),elTD=document.getElementById('timer-display'),elTm=document.getElementById('timer'),elHB=document.getElementById('hint-btn'),elHL=document.getElementById('hints-left'),elMC=document.getElementById('mistakes-count'),elMM=document.getElementById('max-mistakes');
function initC(){cO.width=cD.width=cV.width=CW;cO.height=cD.height=cV.height=CH;xO=cO.getContext('2d');xD=cD.getContext('2d');xV=cV.getContext('2d');}
function initA(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();}
function snd(t){if(!audioCtx)return;var n=audioCtx.currentTime,o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);
if(t==='find'){o.type='sine';o.frequency.setValueAtTime(523,n);o.frequency.setValueAtTime(659,n+.08);o.frequency.setValueAtTime(784,n+.16);g.gain.setValueAtTime(.15,n);g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}
else if(t==='wrong'){o.type='sine';o.frequency.setValueAtTime(300,n);o.frequency.setValueAtTime(250,n+.1);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
else if(t==='hint'){o.type='sine';o.frequency.setValueAtTime(880,n);g.gain.setValueAtTime(.08,n);g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
else if(t==='levelup'){[523,659,784,1047].forEach(function(f,i){var o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.connect(g2);g2.connect(audioCtx.destination);o2.type='sine';o2.frequency.setValueAtTime(f,n+i*.12);g2.gain.setValueAtTime(.12,n+i*.12);g2.gain.exponentialRampToValueAtTime(.001,n+i*.12+.18);o2.start(n+i*.12);o2.stop(n+i*.12+.18);});}
else if(t==='win'){[523,587,659,698,784,880,988,1047].forEach(function(f,i){var o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.connect(g2);g2.connect(audioCtx.destination);o2.type='sine';o2.frequency.setValueAtTime(f,n+i*.1);g2.gain.setValueAtTime(.12,n+i*.1);g2.gain.exponentialRampToValueAtTime(.001,n+i*.1+.13);o2.start(n+i*.1);o2.stop(n+i*.1+.13);});}
else if(t==='fail'){o.type='sine';o.frequency.setValueAtTime(400,n);o.frequency.setValueAtTime(300,n+.15);o.frequency.setValueAtTime(200,n+.3);g.gain.setValueAtTime(.1,n);g.gain.exponentialRampToValueAtTime(.001,n+.45);o.start(n);o.stop(n+.45);}}
function R(a,b){return Math.random()*(b-a)+a;}
function RI(a,b){return Math.floor(R(a,b+1));}
function P(a){return a[Math.floor(Math.random()*a.length)];}
function showEnc(){var now=Date.now();if(now-lastEnc<1500)return;lastEnc=now;var e=document.getElementById('encourage');e.textContent=P(ENC);e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function showLvl(t){var e=document.getElementById('level-msg');e.textContent=t;e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
function addCf(ct){for(var i=0;i<40;i++){var d=document.createElement('div');d.className='cf';d.style.left=Math.random()*100+'%';d.style.background=CCOLS[i%CCOLS.length];d.style.width=R(5,15)+'px';d.style.height=R(5,15)+'px';d.style.animationDuration=R(2,5)+'s';d.style.animationDelay=R(0,2)+'s';ct.appendChild(d);}}

// ===== DRAWING FUNCTIONS =====
function dSky(x,p){var g=x.createLinearGradient(0,0,0,CH*.65);g.addColorStop(0,p[0]);g.addColorStop(1,p[1]);x.fillStyle=g;x.fillRect(0,0,CW,CH*.65);}
function dGnd(x,c,gy){x.fillStyle=c;x.fillRect(0,gy,CW,CH-gy);}
function dSun(x,sx,sy,sr,c){x.save();x.strokeStyle=c;x.lineWidth=2;for(var i=0;i<8;i++){var a=(i/8)*Math.PI*2;x.beginPath();x.moveTo(sx+Math.cos(a)*(sr+3),sy+Math.sin(a)*(sr+3));x.lineTo(sx+Math.cos(a)*(sr+14),sy+Math.sin(a)*(sr+14));x.stroke();}x.beginPath();x.arc(sx,sy,sr,0,Math.PI*2);x.fillStyle=c;x.fill();x.fillStyle='#FFA500';x.beginPath();x.arc(sx-sr*.25,sy-sr*.15,sr*.1,0,Math.PI*2);x.fill();x.beginPath();x.arc(sx+sr*.25,sy-sr*.15,sr*.1,0,Math.PI*2);x.fill();x.beginPath();x.arc(sx,sy+sr*.15,sr*.25,0,Math.PI);x.lineWidth=1.5;x.stroke();x.restore();}
function dCld(x,cx,cy,s,c){x.fillStyle=c;x.beginPath();x.arc(cx,cy,18*s,0,Math.PI*2);x.arc(cx+20*s,cy-5*s,15*s,0,Math.PI*2);x.arc(cx-18*s,cy+2*s,13*s,0,Math.PI*2);x.arc(cx+10*s,cy+5*s,14*s,0,Math.PI*2);x.fill();}
function dHill(x,hx,hy,rx,ry,c){x.fillStyle=c;x.beginPath();x.ellipse(hx,hy,rx,ry,0,Math.PI,0);x.fill();}
function dTree(x,tx,gy,tw,th,cr,tc,cc){x.fillStyle=tc;x.fillRect(tx-tw/2,gy-th,tw,th);x.fillStyle=cc;x.beginPath();x.arc(tx,gy-th-cr*.4,cr,0,Math.PI*2);x.fill();x.beginPath();x.arc(tx-cr*.5,gy-th+2,cr*.7,0,Math.PI*2);x.fill();x.beginPath();x.arc(tx+cr*.5,gy-th+2,cr*.7,0,Math.PI*2);x.fill();}
function dFlwr(x,fx,fy,fr,pc,cc){x.strokeStyle='#228B22';x.lineWidth=2;x.beginPath();x.moveTo(fx,fy);x.lineTo(fx,fy-fr*2.5);x.stroke();x.fillStyle=pc;for(var p=0;p<5;p++){var a=(p/5)*Math.PI*2;x.beginPath();x.arc(fx+Math.cos(a)*fr*.6,fy-fr*2.5+Math.sin(a)*fr*.6,fr*.45,0,Math.PI*2);x.fill();}x.fillStyle=cc;x.beginPath();x.arc(fx,fy-fr*2.5,fr*.3,0,Math.PI*2);x.fill();}
function dHouse(x,hx,hy,hw,hh,c,rc){x.fillStyle=c;x.fillRect(hx,hy,hw,hh);x.fillStyle=rc;x.beginPath();x.moveTo(hx-8,hy);x.lineTo(hx+hw/2,hy-hh*.5);x.lineTo(hx+hw+8,hy);x.closePath();x.fill();x.fillStyle='#654321';x.fillRect(hx+hw*.4,hy+hh*.55,hw*.2,hh*.45);x.fillStyle='#87CEEB';var ws=hw*.17;x.fillRect(hx+hw*.12,hy+hh*.2,ws,ws);x.fillRect(hx+hw*.68,hy+hh*.2,ws,ws);x.strokeStyle='#333';x.lineWidth=1;x.strokeRect(hx+hw*.12,hy+hh*.2,ws,ws);x.strokeRect(hx+hw*.68,hy+hh*.2,ws,ws);}
function dBird(x,bx,by,bs,c){x.strokeStyle=c;x.lineWidth=2;x.beginPath();x.moveTo(bx-bs,by);x.quadraticCurveTo(bx-bs*.4,by-bs*.7,bx,by);x.quadraticCurveTo(bx+bs*.4,by-bs*.7,bx+bs,by);x.stroke();}
function dBfly(x,bx,by,bs,c){x.fillStyle=c;x.beginPath();x.ellipse(bx-bs*.5,by-bs*.2,bs*.6,bs*.4,-.3,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(bx+bs*.5,by-bs*.2,bs*.6,bs*.4,.3,0,Math.PI*2);x.fill();x.fillStyle='#333';x.fillRect(bx-1,by-bs*.6,2,bs*.8);}
function dFence(x,fx,gy,sg,c){x.fillStyle=c;x.strokeStyle='#8B6914';x.lineWidth=1;var sw=10,sh=22,gp=12;x.fillRect(fx,gy-sh*.7,(sw+gp)*sg-gp,3);x.fillRect(fx,gy-sh*.3,(sw+gp)*sg-gp,3);for(var i=0;i<sg;i++){x.fillRect(fx+i*(sw+gp),gy-sh,sw,sh);x.strokeRect(fx+i*(sw+gp),gy-sh,sw,sh);}}
function dPond(x,px,py,rx,ry,c){x.fillStyle=c;x.beginPath();x.ellipse(px,py,rx,ry,0,0,Math.PI*2);x.fill();x.strokeStyle='rgba(255,255,255,0.4)';x.lineWidth=1;x.beginPath();x.ellipse(px-rx*.2,py-ry*.2,rx*.3,ry*.2,0,0,Math.PI*2);x.stroke();}
function dBln(x,bx,by,br,c){x.strokeStyle='#999';x.lineWidth=1;x.beginPath();x.moveTo(bx,by+br);x.lineTo(bx,by+br+30);x.stroke();x.fillStyle=c;x.beginPath();x.ellipse(bx,by,br,br*1.2,0,0,Math.PI*2);x.fill();x.fillStyle='rgba(255,255,255,0.3)';x.beginPath();x.ellipse(bx-br*.3,by-br*.3,br*.2,br*.35,-.5,0,Math.PI*2);x.fill();}
function dStar(x,sx,sy,sr,c){x.fillStyle=c;x.beginPath();for(var i=0;i<5;i++){var a1=(i*72-90)*Math.PI/180,a2=((i*72)+36-90)*Math.PI/180;if(i===0)x.moveTo(sx+Math.cos(a1)*sr,sy+Math.sin(a1)*sr);else x.lineTo(sx+Math.cos(a1)*sr,sy+Math.sin(a1)*sr);x.lineTo(sx+Math.cos(a2)*sr*.4,sy+Math.sin(a2)*sr*.4);}x.closePath();x.fill();}

// ===== DRAW COMMAND =====
function drawC(x,c){
if(c.t==='sky')dSky(x,c.p);else if(c.t==='gnd')dGnd(x,c.c,c.gy);else if(c.t==='sun')dSun(x,c.x,c.y,c.r,c.c);else if(c.t==='cld')dCld(x,c.x,c.y,c.s,c.c);else if(c.t==='hill')dHill(x,c.x,c.y,c.rx,c.ry,c.c);else if(c.t==='tree')dTree(x,c.x,c.gy,c.tw,c.th,c.cr,c.tc,c.cc);else if(c.t==='flwr')dFlwr(x,c.x,c.y,c.r,c.pc,c.cc);else if(c.t==='house')dHouse(x,c.x,c.y,c.w,c.h,c.c,c.rc);else if(c.t==='bird')dBird(x,c.x,c.y,c.s,c.c);else if(c.t==='bfly')dBfly(x,c.x,c.y,c.s,c.c);else if(c.t==='fence')dFence(x,c.x,c.gy,c.sg,c.c);else if(c.t==='pond')dPond(x,c.x,c.y,c.rx,c.ry,c.c);else if(c.t==='bln')dBln(x,c.x,c.y,c.r,c.c);else if(c.t==='star')dStar(x,c.x,c.y,c.r,c.c);
}

function getCenter(c){
if(c.t==='sun')return{x:c.x,y:c.y,r:c.r+12};
if(c.t==='cld')return{x:c.x,y:c.y,r:22*c.s};
if(c.t==='tree')return{x:c.x,y:c.gy-c.th-c.cr*.3,r:c.cr+5};
if(c.t==='flwr')return{x:c.x,y:c.y-c.r*1.5,r:c.r*2+6};
if(c.t==='house')return{x:c.x+c.w/2,y:c.y+c.h/2,r:Math.max(c.w,c.h)/2+5};
if(c.t==='bird')return{x:c.x,y:c.y,r:c.s+10};
if(c.t==='bfly')return{x:c.x,y:c.y,r:c.s+10};
if(c.t==='fence')return{x:c.x+40,y:c.gy-12,r:30};
if(c.t==='pond')return{x:c.x,y:c.y,r:Math.max(c.rx,c.ry)+6};
if(c.t==='bln')return{x:c.x,y:c.y,r:c.r+10};
if(c.t==='star')return{x:c.x,y:c.y,r:c.r+8};
if(c.t==='hill')return{x:c.x,y:c.y-c.ry/2,r:c.rx/2};
return{x:CW/2,y:CH/2,r:30};
}

function modCmd(o){
var c=JSON.parse(JSON.stringify(o));
if(c.t==='sun'){c.c=P(['#FF6347','#FFA500','#FF4500']);}
else if(c.t==='cld'){c.s=c.s*R(.5,.75);}
else if(c.t==='tree'){c.cc=P(TG.filter(function(v){return v!==c.cc;}));}
else if(c.t==='flwr'){c.pc=P(FC.filter(function(v){return v!==c.pc;}));}
else if(c.t==='house'){c.rc=P(RC.filter(function(v){return v!==c.rc;}));}
else if(c.t==='bird'){c.x+=R(15,30)*(Math.random()>.5?1:-1);}
else if(c.t==='bfly'){c.c=P(BC.filter(function(v){return v!==c.c;}));}
else if(c.t==='fence'){c.sg=Math.max(2,c.sg-RI(1,2));}
else if(c.t==='pond'){c.c=P(['#4169E1','#1E90FF','#00BFFF'].filter(function(v){return v!==c.c;}));}
else if(c.t==='bln'){c.c=P(FC.filter(function(v){return v!==c.c;}));}
else if(c.t==='star'){c.r=c.r*R(1.5,2);}
else if(c.t==='hill'){c.c=P(['#5f9ea0','#6B8E6B','#7CCD7C','#6B8E23'].filter(function(v){return v!==c.c;}));}
return c;
}

// ===== GENERATE SCENE =====
function genScene(cx){
var cmds=[],gy=CH*.65;
var sp=P([['#87CEEB','#B0E0E6'],['#FFB347','#FF6B6B'],['#DDA0DD','#87CEEB'],['#98FB98','#87CEEB'],['#FFD700','#FFA07A']]);
cmds.push({t:'sky',p:sp});
cmds.push({t:'gnd',c:P(['#7CCD7C','#8FBC8F','#90EE90','#66CDAA','#9ACD32']),gy:gy});
cmds.push({t:'sun',x:R(CW*.15,CW*.85),y:R(CH*.08,CH*.22),r:R(18,30),c:'#FFD700'});
for(var i=0;i<RI(1,3);i++)cmds.push({t:'hill',x:R(0,CW),y:gy,rx:R(50,120),ry:R(25,55),c:P(['#5f9ea0','#6B8E6B','#7CCD7C','#6B8E23'])});
for(var i=0;i<RI(2,4);i++)cmds.push({t:'cld',x:R(30,CW-50),y:R(CH*.04,CH*.28),s:R(.5,1.1),c:P(['#fff','#F0F8FF','#F5F5F5'])});
if(cx>=1){var hw=R(50,75),hh=R(40,55);cmds.push({t:'house',x:R(CW*.15,CW*.55),y:gy-hh,w:hw,h:hh,c:P(HC),rc:P(RC)});}
for(var i=0;i<RI(2,2+cx);i++)cmds.push({t:'tree',x:R(15,CW-15),gy:gy,tw:R(5,10),th:R(22,45),cr:R(15,30),tc:P(['#8B4513','#A0522D','#6B3A2A']),cc:P(TG)});
for(var i=0;i<RI(3,3+cx*2);i++)cmds.push({t:'flwr',x:R(10,CW-10),y:R(gy+8,CH-12),r:R(4,9),pc:P(FC),cc:'#FFD700'});
if(cx>=2)cmds.push({t:'fence',x:R(5,CW*.25),gy:gy,sg:RI(3,5),c:P(['#DEB887','#D2B48C','#F5DEB3'])});
if(cx>=2)for(var i=0;i<RI(1,1+Math.floor(cx/2));i++)cmds.push({t:'bird',x:R(20,CW-20),y:R(CH*.08,CH*.35),s:R(5,10),c:P(['#333','#4A4A4A','#555'])});
if(cx>=3)for(var i=0;i<RI(1,2);i++)cmds.push({t:'bfly',x:R(20,CW-20),y:R(CH*.3,gy-10),s:R(6,10),c:P(BC)});
if(cx>=3)cmds.push({t:'pond',x:R(CW*.3,CW*.7),y:R(gy+15,CH-25),rx:R(22,40),ry:R(10,20),c:P(['#4169E1','#1E90FF','#00BFFF'])});
if(cx>=4)for(var i=0;i<RI(1,3);i++)cmds.push({t:'bln',x:R(20,CW-20),y:R(CH*.08,CH*.4),r:R(9,14),c:P(FC)});
if(cx>=4)for(var i=0;i<RI(2,4);i++)cmds.push({t:'star',x:R(10,CW-10),y:R(5,CH*.22),r:R(4,7),c:'#FFD700'});
return cmds;
}

// ===== BUILD LEVEL =====
function buildLevel(){
lockBoard=false;diffsFound=0;mistakes=0;hintsLeft=3;diffAreas=[];
if(hintBlink){clearInterval(hintBlink);hintBlink=null;}
elHL.textContent='3';elHB.disabled=false;elHB.classList.remove('pulse-hint');
var lv=LEVELS[curLvl];
elDF.textContent='0';elDT.textContent=lv.diffs;elLv.textContent=curLvl+1;
elMC.textContent='0';elMM.textContent=lv.maxMistakes;
initC();
var cmds=genScene(lv.cx);
// pick which commands to modify (skip sky, ground)
var modifiable=[];
for(var i=2;i<cmds.length;i++)modifiable.push(i);
// shuffle and pick diffs
for(var i=modifiable.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=modifiable[i];modifiable[i]=modifiable[j];modifiable[j]=t;}
var diffIdxs=modifiable.slice(0,Math.min(lv.diffs,modifiable.length));
// create modified commands
var modCmds=[];
for(var i=0;i<cmds.length;i++)modCmds.push(cmds[i]);
diffAreas=[];
for(var d=0;d<diffIdxs.length;d++){
var idx=diffIdxs[d];
modCmds[idx]=modCmd(cmds[idx]);
var ctr=getCenter(cmds[idx]);
diffAreas.push({cx:ctr.x,cy:ctr.y,radius:Math.max(ctr.r,20),found:false});
}
// draw original
xO.clearRect(0,0,CW,CH);
for(var i=0;i<cmds.length;i++)drawC(xO,cmds[i]);
// draw different
xD.clearRect(0,0,CW,CH);
for(var i=0;i<modCmds.length;i++)drawC(xD,modCmds[i]);
// clear overlay
xV.clearRect(0,0,CW,CH);
// timer
if(timedMode){timeLeft=lv.time;elTm.textContent=timeLeft;elTD.style.display='inline';elTD.classList.remove('timer-warning');clearTI();timerInt=setInterval(function(){timeLeft--;elTm.textContent=timeLeft;if(timeLeft<=10)elTD.classList.add('timer-warning');if(timeLeft<=0){clearTI();onTimeout();}},1000);}
else{elTD.style.display='none';clearTI();}
resetNudge();
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
// check if click is on an unfound diff
var hitDiff=false;
for(var i=0;i<diffAreas.length;i++){
var da=diffAreas[i];
if(da.found)continue;
var dx=pos.x-da.cx,dy=pos.y-da.cy;
if(Math.sqrt(dx*dx+dy*dy)<=da.radius+10){
// found!
da.found=true;diffsFound++;elDF.textContent=diffsFound;
snd('find');showEnc();resetNudge();
// draw green circle
xV.strokeStyle='#00FF00';xV.lineWidth=3;
xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.stroke();
xV.fillStyle='rgba(0,255,0,0.15)';xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.fill();
// also mark on original canvas
xO.strokeStyle='#00FF00';xO.lineWidth=3;
xO.beginPath();xO.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xO.stroke();
// check win
if(diffsFound>=LEVELS[curLvl].diffs){
lockBoard=true;clearTI();
if(curLvl<LEVELS.length-1){curLvl++;snd('levelup');showLvl('🌟 שלב '+(curLvl+1)+'! 🌟');setTimeout(buildLevel,1800);}
else{snd('win');setTimeout(function(){gameArea.style.display='none';winScr.style.display='flex';addCf(winScr);},800);}
}
hitDiff=true;break;
}
}
if(!hitDiff){
mistakes++;elMC.textContent=mistakes;snd('wrong');
xV.fillStyle='rgba(255,0,0,0.3)';xV.beginPath();xV.arc(pos.x,pos.y,15,0,Math.PI*2);xV.fill();
setTimeout(function(){xV.clearRect(0,0,CW,CH);for(var i=0;i<diffAreas.length;i++){var da=diffAreas[i];if(da.found){xV.strokeStyle='#00FF00';xV.lineWidth=3;xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.stroke();xV.fillStyle='rgba(0,255,0,0.15)';xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.fill();}}},400);
if(mistakes>=LEVELS[curLvl].maxMistakes){lockBoard=true;clearTI();snd('fail');showMissed();setTimeout(function(){gameArea.style.display='none';misScr.style.display='flex';},1500);}
}
}

function showMissed(){for(var i=0;i<diffAreas.length;i++){var da=diffAreas[i];if(!da.found){xV.strokeStyle='#FF0000';xV.lineWidth=3;xV.setLineDash([5,5]);xV.beginPath();xV.arc(da.cx,da.cy,da.radius,0,Math.PI*2);xV.stroke();xV.setLineDash([]);}}}

function onTimeout(){lockBoard=true;snd('fail');showMissed();setTimeout(function(){gameArea.style.display='none';toScr.style.display='flex';},1500);}

function clearTI(){if(timerInt){clearInterval(timerInt);timerInt=null;}}

function resetNudge(){if(hintNudge)clearTimeout(hintNudge);if(hintBlink){clearInterval(hintBlink);hintBlink=null;}elHB.classList.remove('pulse-hint');if(hintsLeft>0)hintNudge=setTimeout(function(){elHB.classList.add('pulse-hint');},15000);}

function useHint(){if(hintsLeft<=0||lockBoard)return;hintsLeft--;elHL.textContent=hintsLeft;if(hintsLeft<=0)elHB.disabled=true;snd('hint');resetNudge();
var unfound=[];for(var i=0;i<diffAreas.length;i++)if(!diffAreas[i].found)unfound.push(diffAreas[i]);
if(unfound.length===0)return;var da=unfound[Math.floor(Math.random()*unfound.length)];
var count=0;if(hintBlink)clearInterval(hintBlink);
hintBlink=setInterval(function(){count++;xV.strokeStyle=count%2===0?'rgba(255,215,0,0.8)':'rgba(255,215,0,0)';xV.lineWidth=4;xV.beginPath();xV.arc(da.cx,da.cy,da.radius+5,0,Math.PI*2);xV.stroke();if(count>=8){clearInterval(hintBlink);hintBlink=null;xV.clearRect(0,0,CW,CH);for(var i=0;i<diffAreas.length;i++){var d=diffAreas[i];if(d.found){xV.strokeStyle='#00FF00';xV.lineWidth=3;xV.beginPath();xV.arc(d.cx,d.cy,d.radius,0,Math.PI*2);xV.stroke();xV.fillStyle='rgba(0,255,0,0.15)';xV.beginPath();xV.arc(d.cx,d.cy,d.radius,0,Math.PI*2);xV.fill();}}}},250);
}

function startGame(timed){initA();timedMode=timed;curLvl=0;intro.style.display='none';gameArea.style.display='block';buildLevel();}

function restart(){winScr.style.display='none';toScr.style.display='none';misScr.style.display='none';
document.querySelectorAll('.cf').forEach(function(e){e.remove();});
intro.style.display='flex';}

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
