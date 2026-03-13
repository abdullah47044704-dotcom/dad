import fs from "fs";
import fetch from "node-fetch";

export default async function handler(req,res){

const data=JSON.parse(fs.readFileSync("data/apis.json"));

let logs=[];

for(let api of data.apis){

try{

let r=await fetch(api);

if(r.ok){
logs.push({api,status:"success"});
}else{
logs.push({api,status:"error"});
}

}catch(e){
logs.push({api,status:"failed"});
}

}

res.status(200).json(logs);

}