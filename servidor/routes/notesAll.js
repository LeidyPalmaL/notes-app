const express = require('express');
const router = express.Router();
const Note = require('../database');

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({})
    res.json(notes);
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
