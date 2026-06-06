const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCount() {
    taskCount.textContent = `${tasks.length} Tasks`;
}

function renderTasks() {
    taskList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();

    let filtered = tasks.filter(task => {
        const matchSearch = task.text.toLowerCase().includes(searchTerm);

        if (currentFilter === "active") {
            return !task.completed && matchSearch;
        }

        if (currentFilter === "completed") {
            return task.completed && matchSearch;
        }

        return matchSearch;
    });

    filtered.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div style="display:flex;align-items:center;flex:1;">
                <input type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})">

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
            </div>

            <div class="actions">
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCount();
}

function addTask() {

    const text = taskInput.value.trim();

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed:false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function toggleTask(id) {

    tasks = tasks.map(task => {
        if(task.id === id){
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    const newText = prompt("Edit Task", task.text);

    if(newText === null) return;

    task.text = newText.trim();

    saveTasks();
    renderTasks();
}

clearCompletedBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
        addTask();
    }
});

searchInput.addEventListener("input", renderTasks);

document.querySelectorAll(".filter-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        document.querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

renderTasks();