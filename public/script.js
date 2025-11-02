document.addEventListener("DOMContentLoaded", () => {
  const noteList = document.getElementById("note-list");
  // Function to fetch data from the backend
    const fetchData = async () => {
    try {
        const response = await fetch("/data");
        const data = await response.json();
        noteList.innerHTML = ""; // Clear the list before rendering
        data.forEach((item) => {
        const record = document.createElement("tr");
        record.innerHTML = `
            <th scope="row" class="note-ID">${item.id}</th>
            <td>${item.date}</td>
            <td class="note-detail">${item.detail}</td>
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
        noteList.appendChild(record);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    };
    fetchData();
});