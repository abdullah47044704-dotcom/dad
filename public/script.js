let running=false;
let sent=0;
let failed=0;

/* LOGIN */

async function login(){

let username=document.getElementById("username").value;
let password=document.getElementById("password").value;

let r=await fetch("/api/login",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({username,password})
});

let data=await r.json();

if(data.status==="ok"){

localStorage.setItem("user",data.user);
localStorage.setItem("expiry",data.expiry);

window.location="/dashboard";

}else{

document.getElementById("msg").innerText=data.status;

}

}

/* LOGOUT */

function logout(){

localStorage.clear();
window.location="/";

}

/* LOG SYSTEM */

function log(msg){

let c=document.getElementById("console");

let line=document.createElement("span");

line.innerText="> "+msg;

c.appendChild(line);

c.scrollTop=c.scrollHeight;

}

/* CLEAR LOG */

function clearLog(){

document.getElementById("console").innerHTML="";

}

/* STOP */

function stop(){

running=false;

}

/* START */

async function start(){

running=true;

let interval=document.getElementById("interval").value*1000;

if(!interval) interval=2000;

while(running){

try{

let r=await fetch("/api/monitor");

let data=await r.json();

data.forEach(d=>{

if(d.status==="success"){
sent++;
log("SUCCESS "+d.api);
}else{
failed++;
log("FAILED "+d.api);
}

});

document.getElementById("sent").innerText=sent;
document.getElementById("failed").innerText=failed;
document.getElementById("total").innerText=sent+failed;

}catch(e){

failed++;

}

await new Promise(r=>setTimeout(r,interval));

}

}

/* DATE SYSTEM */

function loadDates(){

let expiry = localStorage.getItem("expiry");

let today = new Date();

let todayStr = today.toISOString().split("T")[0];

if(document.getElementById("today"))
document.getElementById("today").innerText=todayStr;

if(document.getElementById("expiry"))
document.getElementById("expiry").innerText=expiry;

let exp = new Date(expiry);

let diff = Math.ceil((exp - today) / (1000*60*60*24));

if(document.getElementById("remain"))
document.getElementById("remain").innerText=diff;

}

loadDates();

/* MATRIX ANIMATION */

const canvas=document.getElementById("matrix");

if(canvas){

const ctx=canvas.getContext("2d");

canvas.height=window.innerHeight;
canvas.width=window.innerWidth;

const letters="01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@";
const fontSize=14;
const columns=canvas.width/fontSize;

const drops=[];

for(let x=0;x<columns;x++)
drops[x]=1;

function draw(){

ctx.fillStyle="rgba(0,0,0,0.05)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="#00ff9c";
ctx.font=fontSize+"px monospace";

for(let i=0;i<drops.length;i++){

const text=letters[Math.floor(Math.random()*letters.length)];

ctx.fillText(text,i*fontSize,drops[i]*fontSize);

if(drops[i]*fontSize>canvas.height && Math.random()>0.975)
drops[i]=0;

drops[i]++;

}

}

setInterval(draw,35);

}