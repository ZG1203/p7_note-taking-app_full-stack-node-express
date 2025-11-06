document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.getElementById("note-list");
  // Function to fetch data from the backend
    const fetchData = async () => {
    try {
        const response = await fetch("/data");
        const data = await response.json();
        noteList.innerHTML = ""; 
        data.forEach((item) => {
        const record = document.createElement("tr");
        record.innerHTML = `
            <th scope="row" class="note-ID">${item.id}</th>
            <td>${item.date}</td>
            <td class="note-detail">${item.detail}</td>
            <td>
                <div class="button-container">
                    <button class="btn btn-delete btn-sm btn-primary w-100 deleteButton" onclick="deleteRecord(this)">Delete</button>
                </div>
            </td>
            <td>
                <div class="button-container">
                    <button class="btn btn-edit btn-sm btn-primary w-100 editButton" onclick="editRecord(this)">Edit</button>
                </div>
            </td>
        `;
        noteList.appendChild(record);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    };

     // add new note
    dataForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!checkfillDate() || !checkNoteDetail()) {
            return false;
        }

        const fillDate = document.getElementById("fillDate");
        const noteDetails = document.getElementById("inputNoteDetail");
        const newNote = {
            date: new Date(fillDate.value).toLocaleDateString('en-UK'),
            detail: noteDetails.value.trim()
        };

        try {
        const response = await fetch("/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote),
        });

        if (response.ok) {
            fillDate.value = '';
            noteDetails.value = '';
            fetchData(); 
        }
        } catch (error) {
        console.error("Error adding data:", error);
        }
    });

    // Fetch data on page load
    fetchData();
});


// function to check date input, if it is before today, give a warning message
function checkfillDate() {
    const fillDate = document.getElementById("fillDate");
    const fillDateValue = new Date (fillDate.value);
    const todayDate = new Date();
    if (fillDateValue < todayDate) {
        alert ('Warning:Fill date is before today, please check');
        return false;
    }
    return true;
}

//function to check note input, if task detail is empty or already exist in task list, give a warning message
function checkNoteDetail () {
    const noteDetails = document.getElementById("inputNoteDetail");
    const noteDetailsValue = noteDetails.value.trim();
    if (noteDetailsValue.length <= 0) {
        alert ('Warning: Note must not be empty, please check');
        return false;
    } else {
        const noteDetailsList = document.querySelectorAll(".note-detail");
        for (let i=0; i < noteDetailsList.length; i++) {
            if(noteDetailsValue.toLowerCase() == noteDetailsList[i].textContent.toLowerCase()) {
            alert ('Warning: Note already exists');
            return false;
            }
        }    
        return true;
    }
}

// delete button - when click delete button, delete the record from json
async function deleteRecord(button) {
    const recordRow = button.closest('tr');
    const idElement = recordRow.querySelector('.note-ID');
    const noteId = idElement.textContent;
    try {
        const response = await fetch(`/data/${noteId}`, {
            method: "DELETE",
        });
        if (response.ok) {
            recordRow.remove()
            console.log("Note deleted");
        }
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

// 4. edit button - when click edit button, allow user to update note details 
async function editRecord(button) {
    const recordRow = button.closest('tr');
    const idElement = recordRow.querySelector('.note-ID');
    const noteId = idElement.textContent;
    const noteDetail = recordRow.cells[2].textContent;
    const newNoteDetail = prompt('Enter new note detail:');
    const newNote = {
        detail: newNoteDetail.trim()
    };

    if (!editNoteDetail(newNoteDetail,noteDetail)) {
       return false;
    }
    try {
        const response = await fetch(`/data/${noteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote),
        });
        if (response.ok) {
            recordRow.cells[2].textContent = newNoteDetail.trim();
            console.log("Note updated");
        }
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

// edit task detail, check if new task detail is same as original value. 
function editNoteDetail(newNoteDetail,noteDetail) {
    if (newNoteDetail !== null && newNoteDetail.trim() !=='' ) {
        if (newNoteDetail == noteDetail) {
            alert('Note content is not changed');
            return false
        } else {
            return true
        }
    } else {
        alert ('No new note content is filled; task detail is not changed');
        return false
    }
}

