initSqlJs({
    dbPath: '/student.db' 
})
.then(db=>{
refreshTable();
})
.catch(err => {
    console.error("Failed to initialize SQL.js", err);
});




function openModal(mode, id = null) {
    const modal = document.getElementById("studentModal");
    const title = document.getElementById("modalTitle");
    const nameInput = document.getElementById("name");
    const ageInput = document.getElementById("age");
    const majorInput = document.getElementById("major");
    const studentIdInput = document.getElementById("studentId");

    if (mode === 'add') {
        title.textContent = "Add Student";
        nameInput.value = '';
        ageInput.value = '';
        majorInput.value = '';
        studentIdInput.value = '';
    } else if (mode === 'edit' && id) {
        title.textContent = "Edit Student";
        const student = getStudentById(id);
        nameInput.value = student.name;
        ageInput.value = student.age;
        majorInput.value = student.major;
        studentIdInput.value = student.id;
    }

    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("studentModal").style.display = "none";
}

function saveStudent() {
    const id = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const major = document.getElementById("major").value;

    if (id) {
        const sql = `UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?`;
        const stmt = window.sqliteDB.prepare(sql);
        stmt.run([name, age, major, id]);
        stmt.free();
    } else {
        const sql = `INSERT INTO students (name, age, major) VALUES (?, ?, ?)`;
        const stmt = window.sqliteDB.prepare(sql);
        stmt.run([name, age, major]);
        stmt.free();
    }

    closeModal();
    refreshTable();
}

function deleteStudent(id) {
    const sql = `DELETE FROM students WHERE id = ?`;
    const stmt = window.sqliteDB.prepare(sql);
    stmt.run([id]);
    stmt.free();
    refreshTable();
}

function refreshTable() {
    const sql = `SELECT * FROM students`;
    const res = window.sqliteDB.exec(sql);
    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = "";

    res[0].values.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });

        const actionsTd = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => openModal('edit', row[0]);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteStudent(row[0]);

        actionsTd.appendChild(editButton);
        actionsTd.appendChild(deleteButton);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });
}

function getStudentById(id) {
    const sql = `SELECT * FROM students WHERE id = ?`;
    const stmt = window.sqliteDB.prepare(sql);
    stmt.bind([id]);
    stmt.step();
    const student = stmt.getAsObject();
    stmt.free();
    return student;
}

window.onclick = function(event) {
    const modal = document.getElementById("studentModal");
    if (event.target === modal) {
        closeModal();
    }
}