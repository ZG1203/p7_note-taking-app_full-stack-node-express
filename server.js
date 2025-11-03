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

// when add a row to the note table, get the last note ID and use next sequential number as note ID
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

// DELETE request to delete data by ID
app.delete("/data/:id",(req,res) => {
  const data = readData();
  const index = data.findIndex((item) =>item.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({message:"Data not found"});
  }
  const deletedItem = data.splice(index, 1)[0];
  writeData(data);
  res.json({message:"data deleted successfully", data: data[0]});
});

// PUT request to update data by ID
app.put("/data/:id",(req,res) => {
  const data = readData();
  const index = data.findIndex((item) =>item.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({message:"Data not found"});
  }
  data[index] = { id:req.params.id, ...req.body };
  writeData(data);
  res.json({message:"data updated successfully", data: data[index]});
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

