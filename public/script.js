const log = document.getElementById("log");

let stopped=false;
let sent=0;
let failed=0;

function beep(){
const b=document.getElementById("beep");
if(b){
b.currentTime=0;
b.play().catch(()=>{});
}
}

logoutBtn.onclick=()=>{
localStorage.clear();
location.href="login.html";
};

stopBtn.onclick=()=>{
beep();
stopped=true;
line("⛔ STOPPED");
};

clearBtn.onclick=()=>{
beep();
log.textContent="";
sent=0;
failed=0;
updateStats();
};

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

const r = await fetch(`/api/hit?number=${encodeURIComponent(number)}`);
const d = await r.json();

if(!d.ok){

line("⚠️ "+d.msg);
break;

}

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

function updateStats(){

document.getElementById("sent").textContent=sent;

document.getElementById("failed").textContent=failed;

document.getElementById("total").textContent=sent+failed;

}

function line(t){

const d=document.createElement("div");

d.textContent=t;

log.appendChild(d);

log.scrollTop=log.scrollHeight;

}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));