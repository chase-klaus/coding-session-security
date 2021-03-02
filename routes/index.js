const { Router } = require('express');
const validator = require('validator');

const router = Router();

router.get('/', (_, res) => res.status(200).json({ message: 'Hello, World!' }));
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Bad Request', status: 400 });
  // Trim name and replace any whitespaces characters with single space
  const trimmedName = name.trim().replace(/\s+/g, ' ');
  if (trimmedName.length < 2) return res.status(400).json({ error: 'Bad Request. Name is too short', status: 400 });
  if (trimmedName.length > 53) return res.status(400).json({ error: 'Bad Request. Name is too long', status: 400 });
  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Bad Request. Email is incorrect', status: 400 });
  // Specify exact range of characters instead of "."
  if (!/^(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*\d)(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*[a-z])(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*[A-Z])(?=[!@#$%^&*_\-+=~:;?.a-zA-Z0-9]*[!@#$%^&*_\-+=~:;?.]).{8,}$/.test(password)) return res.status(400).json({ error: 'Bad Request. Password is too weak', status: 400 });
  const serializedName = validator.escape(trimmedName.replace(/'/g, '’'));
  res.status(200).json({ message: `User with name ${serializedName} is saved to DB.` });
});

module.exports = router;
