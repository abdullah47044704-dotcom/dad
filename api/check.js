export default function handler(req,res){

const {id}=req.query;

const LICENSES=[
 {id:"admin",pass:"123456",exp:"2027-01-01"},
 {id:"client1",pass:"client123",exp:"2026-12-31"}
];

const u=LICENSES.find(x=>x.id===id);

if(!u) return res.json({ok:false});

if(new Date()>new Date(u.exp))
return res.json({ok:false});

res.json({ok:true});
}