import fs from "fs";

export default function handler(req,res){

const {username,password}=req.body;

const data=JSON.parse(fs.readFileSync("data/users.json"));

const user=data.users.find(u=>u.username===username && u.password===password);

if(!user){
res.status(401).json({status:"invalid"});
return;
}

if(user.status!=="online"){
res.status(403).json({status:"offline"});
return;
}

let today=new Date().toISOString().split("T")[0];

if(today>user.expiry){
res.status(403).json({status:"expired"});
return;
}

res.status(200).json({status:"ok",user:user.username,expiry:user.expiry});

}