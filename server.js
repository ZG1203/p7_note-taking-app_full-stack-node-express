// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3001;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new note
app.post("/data", (req, res) => {
  const currentData = readData();
  const newNoteId = currentData.length > 0 ? Math.max(...currentData.map(n => n.id)) + 1 : 1;
  const newData = { id: newNoteId, ...req.body };
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

// add a row to the note table, get the last note ID and use next sequential number as note ID
function nextNoteId () {
    const noteIdList = document.querySelectorAll(".note-ID");
    const noteIdValues = []
    for (let i=0; i < noteIdList.length; i++) {
        noteIdValues.push(parseInt(noteIdList[i].textContent))
    };
    let newNoteID = 0
    if (noteIdList.length === 0) {
        newNoteID = 1
    } else { 
        const maxNoteID = Math.max(...noteIdValues);
        newNoteID = maxNoteID+1;
    }
    return newNoteID
}



// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

