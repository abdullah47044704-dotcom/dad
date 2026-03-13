import fs from "fs";

export default function handler(req,res){

const {username}=req.query;

const data=JSON.parse(fs.readFileSync("data/users.json"));

const user=data.users.find(u=>u.username===username);

if(!user){
res.status(401).json({status:"removed"});
return;
}

if(user.status!=="online"){
res.status(403).json({status:"offline"});
return;
}

res.status(200).json({status:"ok"});

}