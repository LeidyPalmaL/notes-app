import React, { useEffect, useState } from 'react';
import './App.css';

function Note({ note, onContentChange, onSave, notes, setNotes, selectedNote, setSelectedNote }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isSelected = selectedNote === note.title;
  const [newContent, setNewContent] = useState(note.content);

  const handleEditClick = () => {
    setIsEditing(true);
    setSelectedNote(null);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    setSelectedNote(null);
  };

  const handleCardClick = () => {
    setSelectedNote(note.title);
  };

  const handleContentChange = (event) => {
    setNewContent(event.target.value);
  };

  const handleSaveClick = () => {
    if (isEditing) {
      fetch(`http://localhost:3001/notes/update/${note.title}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      })
        .then(response => response.json())
        .then(updatedNote => {
          console.log(`f{note.title} actualizada`)
          onContentChange(note.title, updatedNote.content);
          setIsEditing(false);
          setSelectedNote(null);
        });
    } else if (isDeleting) {
      fetch(`http://localhost:3001/notes/delete/${note.title}`, {
        method: 'DELETE',
      })
        .then(() => {
          console.log(`f{note.title} borrada`);
          setNotes(prevNotes => prevNotes.filter(n => n.title !== note.title));
          setIsDeleting(false);
        });
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedNote(null);
  };

  return (
    <div onClick={handleCardClick}>
      <div id={note.title} className='card'>
        {isEditing ? (
          <div className="data" key={note.title}>
            <h2>{note.title}</h2>
            <textarea value={newContent} onChange={handleContentChange} />
            <button onClick={handleSaveClick}>Confirmar</button>
            <button onClick={handleCancelClick}>Cancelar</button>
          </div>
        ) : isDeleting ? (
          <div className="data" key={note.title}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <p>¿Está seguro de eliminarla?</p>
            <button onClick={handleSaveClick}>Confirmar</button>
          </div>

        ) : (
          <div className="data" key={note.title}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            {
              isSelected && (
                <div>
                  <button onClick={handleEditClick}>Editar</button>
                  <button onClick={handleDeleteClick}>Eliminar</button>
                </div>
              )
            }
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="App-header">
      <h1>Gestión de Notas Online</h1>
    </header>
  );
}

function Footer({ handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const save = () => {
    handleSave(title, content);
    setIsEditing(false);
    setTitle('');
    setContent('');
  };

  if (isEditing) {
    return (
      <footer className="App-footer">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Contenido" />
        <button onClick={save}>Guardar</button> &nbsp;
        <button onClick={() => setIsEditing(false)}>Cancelar</button>
      </footer>
    );
  }

  return (
    <footer className="App-footer">
      <button onClick={() => setIsEditing(true)}>Nueva Nota</button>
    </footer>
  );
}

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/notes')
      .then(response => response.json())
      .then(notes => setNotes(notes));
  }, []); // Asegúrate de pasar un array vacío como segundo argumento para que el efecto solo se ejecute una vez

  const handleContentChange = (title, newContent) => {
    setNotes(notes.map(note => note.title === title ? { ...note, content: newContent } : note));
  };

  const handleSave = async (title, content) => {
    const response = await fetch('http://localhost:3001/notes/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      console.error('Error al guardar la nota');
      return;
    }

    const newNote = await response.json(); // Asegúrate de que tu API devuelva la nueva nota creada
    setNotes(prevNotes => [...prevNotes, newNote]);
};

return (
  <div>
    <Header />
    <div id="grid">
      {notes.map(note => (
        <Note key={note.title} note={note} onContentChange={handleContentChange} notes={notes} setNotes={setNotes} selectedNote={selectedNote} setSelectedNote={setSelectedNote} />
      ))}
    </div>
    <Footer handleSave={handleSave} /> {/* Aquí agregas el Footer a tu App */}
  </div>
);
}

export default App;
