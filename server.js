const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');  // Import the cors middleware
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());  // Enable CORS for all routes


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper functions
function getNotes() {
  const filePath = path.resolve(__dirname,  'db/db.json');
  console.log('Reading from file:', filePath);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(data); // Log the data to check if it's being read
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return []; // Return an empty array if the file doesn't exist or cannot be read
  }
}

function saveNotes(notes) {
  const filePath = path.resolve(__dirname, 'db/db.json');
  console.log('Writing to file:', filePath);
  fs.writeFileSync(filePath, JSON.stringify(notes));
}

// API routes
app.get('/api/notes', (req, res) => {
  try {
    const notes = getNotes();
    console.log(notes); // Log the notes to check if they are being retrieved
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    console.log('Deleting note with ID:', noteId);
  
    const notes = getNotes();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
  
    res.json({ success: true, notes: updatedNotes });
  });
  
  

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
