const express = require('express');
const router = express.Router();
const Note = require('../database');

router.post('/', async (req, res) => {
  try {
    const title = req.body.title;
    const newContent = req.body.content;

    let note = new Note({
      title: title,
      content: newContent
    })

    note.save();

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
