// ===== LOGIN TOKEN CHECK =====
const token = localStorage.getItem("token");
const exp = localStorage.getItem("exp");

if(!token || !exp){
  window.location.href="login.html";
}

// ===== VARIABLES =====
const log = document.getElementById("log");
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

let stopped=false, sent=0, failed=0;

// ===== SOUND =====
function beep(){
  const b=document.getElementById("beep");
  if(b){
    b.currentTime=0;
    b.play().catch(()=>{});
  }
}

// ===== CANVAS SIZE =====
function resize(){
  canvas.width=innerWidth;
  canvas.height=innerHeight;
}
resize();
addEventListener("resize", resize);

// ===== MATRIX EFFECT =====
const colW=14;
let drops=[];

function resetDrops(){
  drops=Array(Math.floor(canvas.width/colW)).fill(0);
}
resetDrops();

setInterval(()=>{
  ctx.fillStyle="rgba(2,4,18,0.25)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="#2cff9a";
  ctx.font="14px JetBrains Mono";

  for(let i=0;i<drops.length;i++){
    const ch=String.fromCharCode(0x30A0+Math.random()*96);

    ctx.fillText(ch, i*colW, drops[i]*colW);

    if(drops[i]*colW>canvas.height && Math.random()>0.975){
      drops[i]=0;
    }

    drops[i]++;
  }

},50);

// ===== DATE SYSTEM =====
function fmt(d){
  return d.toISOString().split("T")[0];
}

const todayEl=document.getElementById("today");
const expiryEl=document.getElementById("expiry");
const remainEl=document.getElementById("remain");

function updateDates(){

  const today=new Date();
  const exp=new Date(localStorage.getItem("exp"));

  if(!exp){
    return;
  }

  const rem=Math.max(0, Math.ceil((exp-today)/86400000));

  todayEl.textContent="Today: "+fmt(today);
  expiryEl.textContent="Expiry: "+fmt(exp);
  remainEl.textContent="Remaining: "+rem+" days";

}

updateDates();
setInterval(updateDates,60000);

// ===== LOGOUT =====
const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){
  logoutBtn.onclick=()=>{
    localStorage.clear();
    location.href="login.html";
  };
}

// ===== BUTTONS =====
const stopBtn=document.getElementById("stopBtn");
const clearBtn=document.getElementById("clearBtn");
const startBtn=document.getElementById("startBtn");

if(stopBtn){
  stopBtn.onclick=()=>{
    beep();
    stopped=true;
    line("⛔ STOPPED");

    setTimeout(()=>{
      location.reload();
    },300);
  };
}

if(clearBtn){
  clearBtn.onclick=()=>{
    beep();
    log.textContent="";
    sent=0;
    failed=0;
    updateStats();
  };
}

if(startBtn){
  startBtn.onclick=async()=>{

    beep();

    stopped=false;

    const number=document.getElementById("number").value.trim();
    const hits=parseInt(document.getElementById("hits").value,10);
    const intervalSec=Math.max(0.5, parseFloat(document.getElementById("interval").value||"1"));

    if(!number || !hits){
      line("⚠️ Enter number & hits");
      return;
    }

    for(let i=1;i<=hits;i++){

      if(stopped) break;

      line(`[#${i}] dispatch`);

      try{

        await fetch(`/api/hit?number=${encodeURIComponent(number)}`);

        sent++;
        line("✓ sent");

      }catch{

        failed++;
        line("✗ failed");

      }

      updateStats();

      await sleep(intervalSec*1000);

    }

  };
}

// ===== STATS =====
function updateStats(){

  document.getElementById("sent").textContent=sent;
  document.getElementById("failed").textContent=failed;
  document.getElementById("total").textContent=sent+failed;

}

// ===== LOG =====
function line(t){

  const d=document.createElement("div");

  d.textContent=t;

  log.appendChild(d);

  log.scrollTop=log.scrollHeight;

}

// ===== SLEEP =====
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
