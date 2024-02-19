const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3002
const db = require('./db/db.json')

//Allows all notes to have a unique ID
const { v4: uuidv4 } = require('uuid');

//Allows public folder to be unblocked
app.use(express.static('public'))
app.use(express.json())

//API Routes
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
  
  app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }
      res.json(JSON.parse(data));
    });
  });

//POST 
///api/notes receives a new note to save on the request body and add it to db.json, then returns new note to the client.
app.post("/api/notes", (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };
  
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }
      const notes = JSON.parse(data);
  
      notes.push(newNote);
  
      fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).send("Server error");
          return;
        }
        res.json(newNote);
      });
    });
  });


//DELETE
// notes when the button is clicked by removing the note from db.json, saving and showing the updated database on the front end.
app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }
      let notes = JSON.parse(data);
      notes = notes.filter((note) => note.id !== noteId);
  
      fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).send("Server error");
          return;
        }
        res.json({ message: "Note deleted" });
      });
    });
  });

//HTML Routes
//Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

//Wildcard Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//App listens with front end on this port
app.listen(PORT, () =>
    console.log(`App listening on ${PORT}`))