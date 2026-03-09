export default function handler(req, res) {

  const { id, pass } = req.query;

  const LICENSES = [
    { id: "blueanzo حكر", pass: "463910", exp: "2027-03-01" },
    { id: "1", pass: "1", exp: "2027-03-26" },
    { id: "fahim", pass: "056810", exp: "2027-03-26" },
    { id: "client1", pass: "client123", exp: "2026-12-31" }
  ];

  const user = LICENSES.find(x => x.id === id && x.pass === pass);

  if (!user) {
    return res.json({
      ok: false,
      msg: "Invalid ID or Password"
    });
  }

  if (new Date() > new Date(user.exp)) {
    return res.json({
      ok: false,
      msg: "License Expired"
    });
  }

  // token create
  const token = Math.random().toString(36).substring(2);

  return res.json({
    ok: true,
    token: token,
    expires: user.exp
  });

}