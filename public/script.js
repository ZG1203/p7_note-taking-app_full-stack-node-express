// 1. add note - when click add button, check input value, add note to list.
// check date input, if it is before today, give a warning message
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

// check note input, if task detail is empty or already exist in task list, give a warning message
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

function addRecord () {
    if(!checkfillDate() || !checkNoteDetail ()) {
        return false;
    };
    const noteID = nextNoteId ();
    const newRecord = document.createElement('tr');
    const fillDate = document.getElementById("fillDate");
    const fillDateValue = new Date(fillDate.value);
    const formattedFillDate = fillDateValue.toLocaleDateString('en-UK');
    const noteDetails = document.getElementById("inputNoteDetail");
    const noteDetailsValue = noteDetails.value.trim();
    newRecord.innerHTML +=`
        <th scope="row" class="task-ID">${noteID}</th>
        <td>${formattedFillDate}</td>
        <td class="task-detail">${noteDetailsValue}</td>
        <td>
            <div class="button-container">
                <button class="btn btn-edit btn-sm btn-primary w-100 deleteButton" onclick="deleteRecord(this)">Delete</button>
            </div>
        </td>
        <td>
            <div class="button-container">
                <button class="btn btn-delete btn-sm btn-primary w-100 editButton" onclick="editRecord(this)">Edit</button>
            </div>
        </td>
    `;
    const noteList = document.getElementById("note-list");
    noteList.appendChild(newRecord);
    fillDate.value = '';
    noteDetails.value = '';
}

// add button click trigger, and stop page reload
const addButton = document.getElementById("addButton");
addButton.addEventListener("click", function(e) {
    e.preventDefault();
    addRecord(); 
    }
);


// 3. delete button - when click delete button, delete the record from list
function deleteRecord(button) {
    const buttonElement = button.parentElement; 
    const tableElement = buttonElement.parentElement;
    const recordRow = tableElement.parentElement;
    recordRow.remove();
}
// 4. edit button - when click edit button, allow user to update note details 
function editRecord(button) {
    const buttonElement = button.parentElement; 
    const tableElement = buttonElement.parentElement;
    const recordRow = tableElement.parentElement;
    editNoteDetail(recordRow);
}

// edit task detail, check if new task detail is same as original value. 
function editNoteDetail(recordRow) {
    const noteDetail = recordRow.cells[2];
    const newNoteDetail = prompt ( 'Edit task detail:', noteDetail.textContent);
    if (newNoteDetail !== null && newNoteDetail.trim() !=='' ) {
        if (newNoteDetail == noteDetail.textContent) {
            alert('Note content is not changed')
        } else {
            noteDetail.textContent = newNoteDetail.trim();
            alert('Note content is updated')
        }
    } else {
        alert ('No new note content is filled; task detail is not changed')
    }
}