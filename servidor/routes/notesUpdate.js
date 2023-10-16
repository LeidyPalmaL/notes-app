const express = require('express');
const router = express.Router();
const Note = require('../database');

router.put('/:title', async (req, res) => {
  console.log('\nreq.params')
  console.log(req.params)
  console.log('\nreq.params.title')
  console.log(req.params.title)

  try {
    const title = req.params.title;
    const newContent = req.body.content;

    const note = await Note.findOneAndUpdate(
      { title: title }, // condiciones de búsqueda
      { content: newContent }, // campos a actualizar
      { new: true } // opción para devolver el documento actualizado
    );

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
