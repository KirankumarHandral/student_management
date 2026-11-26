// fetch("http://127.0.0.1:8000/students");
// const studentForm = document.getElementById("studentForm");

// const nameInput = document.getElementById("name");
// const emailInput = document.getElementById("email");
// const mobileInput = document.getElementById("mobile");
// const courseInput = document.getElementById("course");

// const studentTable = document.getElementById("studentTable");
// const searchInput = document.getElementById("search");

// // Load students from Local Storage
// let students = JSON.parse(localStorage.getItem("students")) || [];

// // Track whether we are editing a student
// let editStudentId = null;


// // Save data to Local Storage
// function saveToLocalStorage() {
//     localStorage.setItem("students", JSON.stringify(students));
// }


// // Display students in the table
// function displayStudents(studentList = students) {

//     studentTable.innerHTML = "";

//     studentList.forEach((student) => {

//         const row = document.createElement("tr");

//         // Create table cells safely
//         const nameCell = document.createElement("td");
//         nameCell.textContent = student.name;

//         const emailCell = document.createElement("td");
//         emailCell.textContent = student.email;

//         const mobileCell = document.createElement("td");
//         mobileCell.textContent = student.mobile;

//         const courseCell = document.createElement("td");
//         courseCell.textContent = student.course;

//         const actionCell = document.createElement("td");

//         // Edit button
//         const editButton = document.createElement("button");
//         editButton.textContent = "Edit";
//         editButton.type = "button";
//         editButton.addEventListener("click", () => editStudent(student.id));

//         // Delete button
//         const deleteButton = document.createElement("button");
//         deleteButton.textContent = "Delete";
//         deleteButton.type = "button";
//         deleteButton.addEventListener("click", () => deleteStudent(student.id));

//         actionCell.append(editButton, deleteButton);

//         row.append(
//             nameCell,
//             emailCell,
//             mobileCell,
//             courseCell,
//             actionCell
//         );

//         studentTable.appendChild(row);
//     });
// }


// // Add or Update student
// studentForm.addEventListener("submit", function (event) {

//     event.preventDefault();

//     const name = nameInput.value.trim();
//     const email = emailInput.value.trim();
//     const mobile = mobileInput.value.trim();
//     const course = courseInput.value;

//     // Basic validation
//     if (!name || !email || !mobile || !course) {
//         alert("Please fill all fields.");
//         return;
//     }

//     // Mobile validation
//     if (!/^\d{10}$/.test(mobile)) {
//         alert("Please enter a valid 10-digit mobile number.");
//         return;
//     }

//     // Duplicate email validation
//     const duplicateEmail = students.some(student =>
//         student.email.toLowerCase() === email.toLowerCase() &&
//         student.id !== editStudentId
//     );

//     if (duplicateEmail) {
//         alert("Email already exists.");
//         return;
//     }

//     if (editStudentId !== null) {

//         // Update existing student
//         const studentIndex = students.findIndex(
//             student => student.id === editStudentId
//         );

//         if (studentIndex !== -1) {
//             students[studentIndex] = {
//                 id: editStudentId,
//                 name,
//                 email,
//                 mobile,
//                 course
//             };
//         }

//         editStudentId = null;

//         studentForm.querySelector("button[type='submit']").textContent = "Submit";

//     } else {

//         // Add new student
//         const newStudent = {
//             id: Date.now(),
//             name,
//             email,
//             mobile,
//             course
//         };

//         students.push(newStudent);
//     }

//     // Save and refresh
//     saveToLocalStorage();
//     displayStudents();

//     // Reset form
//     studentForm.reset();
// });


// // Edit student
// function editStudent(id) {

//     const student = students.find(student => student.id === id);

//     if (!student) {
//         return;
//     }

//     nameInput.value = student.name;
//     emailInput.value = student.email;
//     mobileInput.value = student.mobile;
//     courseInput.value = student.course;

//     editStudentId = id;

//     studentForm.querySelector("button[type='submit']").textContent = "Update";

//     nameInput.focus();
// }


// // Delete student
// function deleteStudent(id) {

//     const confirmDelete = confirm("Are you sure you want to delete this student?");

//     if (!confirmDelete) {
//         return;
//     }

//     students = students.filter(student => student.id !== id);

//     // If the deleted record was being edited, reset form
//     if (editStudentId === id) {
//         editStudentId = null;
//         studentForm.reset();
//         studentForm.querySelector("button[type='submit']").textContent = "Submit";
//     }

//     saveToLocalStorage();
//     displayStudents();
// }


// // Search students by name
// searchInput.addEventListener("input", function () {

//     const searchValue = searchInput.value.trim().toLowerCase();

//     const filteredStudents = students.filter(student =>
//         student.name.toLowerCase().includes(searchValue)
//     );

//     displayStudents(filteredStudents);
// });


// // Display records when the page loads
// displayStudents();












//_________________________________________________________________________________________________________________________




const API_URL = "http://127.0.0.1:8000/students";

// Get HTML elements
const studentForm = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const courseInput = document.getElementById("course");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("search");

// Store student data
let students = [];
let editId = null;


// 1. GET: Load students from backend
async function getStudents() {

    const response = await fetch(API_URL);

    students = await response.json();

    displayStudents();
}


// 2. DISPLAY: Show students in HTML table
function displayStudents() {

    studentTable.innerHTML = "";

    students.forEach(function(student) {

        const row = document.createElement("tr");

        const name = document.createElement("td");
        name.textContent = student.name;

        const email = document.createElement("td");
        email.textContent = student.email;

        const mobile = document.createElement("td");
        mobile.textContent = student.mobile;

        const course = document.createElement("td");
        course.textContent = student.course;

        const actions = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.onclick = function() {
            editStudent(student);
        };

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.onclick = function() {
            deleteStudent(student.id);
        };

        actions.append(editButton, deleteButton);

        row.append(name, email, mobile, course, actions);

        studentTable.appendChild(row);
    });
}


// 3. POST / PUT: Add or Update student
studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const studentData = {
        name: nameInput.value,
        email: emailInput.value,
        mobile: mobileInput.value,
        course: courseInput.value
    };

    let response;

    if (editId === null) {

        // Add student
        response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

    } else {

        // Update student
        response = await fetch(API_URL + "/" + editId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });
    }

    if (!response.ok) {
        const error = await response.json();
        alert(error.detail || "Something went wrong");
        return;
    }

    studentForm.reset();

    editId = null;

    getStudents();
});


// 4. EDIT: Fill form with existing data
function editStudent(student) {

    nameInput.value = student.name;
    emailInput.value = student.email;
    mobileInput.value = student.mobile;
    courseInput.value = student.course;

    editId = student.id;
}


// 5. DELETE: Delete student
async function deleteStudent(id) {

    const confirmDelete = confirm("Delete this student?");

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });

    if (!response.ok) {
        alert("Unable to delete student");
        return;
    }

    getStudents();
}


// 6. SEARCH: Search by student name
searchInput.addEventListener("input", function() {

    const searchValue = searchInput.value.toLowerCase();

    studentTable.innerHTML = "";

    students.forEach(function(student) {

        if (student.name.toLowerCase().includes(searchValue)) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.mobile}</td>
                <td>${student.course}</td>
            `;

            studentTable.appendChild(row);
        }
    });
});


// Load data when page opens
getStudents();

