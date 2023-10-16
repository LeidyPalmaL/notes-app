const express = require('express');
const cors = require('cors');

const app = express();

const port = 3001;

require('./database');

app.use(cors());
app.use(express.json());

const notesAll = require('./routes/notesAll');
const notesUpdate = require('./routes/notesUpdate');
const notesDelete = require('./routes/notesDelete');
const notesInsert = require('./routes/notesInsert');

app.use('/', notesAll);
app.use('/notes', notesAll);
app.use('/notes/update', notesUpdate);
app.use('/notes/delete', notesDelete);
app.use('/notes/insert', notesInsert);

app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});
