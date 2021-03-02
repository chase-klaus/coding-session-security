const { Router } = require('express');
const validator = require('validator');

const router = Router();

router.get('/', (_, res) => res.status(200).json({ message: 'Hello, World!' }));
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Bad Request', status: 400 });
  if (name.length > 53) return res.status(400).json({ error: 'Bad Request. Name is too long', status: 400 });
  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Bad Request. Email is incorrect', status: 400 });
  // Do not use in production
  if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password)) return res.status(400).json({ error: 'Bad Request. Password is too weak', status: 400 });
  const serializedName = validator.escape(name.replace(/'/g, '’'));
  res.status(200).json({ message: `User with name ${serializedName} is ' saved to DB.` });
});

module.exports = router;
