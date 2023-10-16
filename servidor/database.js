// Configura e inicializa la conexión a la base de datos

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/notes-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(db => console.log("La base de datos está en línea"))
    .catch(err => console.log("Error: " + err));


const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

// Definir el esquema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Crear el modelo
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
